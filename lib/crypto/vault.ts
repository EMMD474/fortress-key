import { DEFAULT_KDF_PARAMS } from './constants';
import { generateKey, generateSalt } from './random';
import { deriveMasterKey } from './argon2';
import { deriveAuthHash } from './hkdf';
import { wrapKey, unwrapKey, aesGcmEncrypt, aesGcmDecrypt } from './aesgcm';
import { utf8ToBytes, bytesToUtf8 } from './encoding';
import type { CipherBundle, KdfParams } from './types';

// High-level vault operations — the building blocks the UI flows in Stage 1.3
// compose. Everything here runs in the browser; no plaintext or key ever
// crosses the network. See docs/ENCRYPTION_DESIGN.md §4.

/** The plaintext shape of a stored credential (encrypted under the Vault Key). */
export interface CredentialFields {
  username: string;
  password: string;
  website: string;
  notes: string;
}

/** Everything the server needs to persist for a new account. All non-secret or wrapped. */
export interface SignupKeyMaterial {
  salt: Uint8Array;
  kdfParams: KdfParams;
  authHash: string;
  wrappedVaultKey: CipherBundle;
  wrappedRecoveryKey: CipherBundle;
  /** Shown to the user exactly once, never sent to the server. */
  recoveryKey: Uint8Array;
}

/**
 * Signup (docs/ENCRYPTION_DESIGN.md §4.1): generate the salt, Vault Key, and
 * Recovery Key, derive the Master Key + auth verifier, and wrap the Vault Key
 * under both the Master Key and the Recovery Key.
 */
export async function createSignupKeyMaterial(
  masterPassword: string,
  kdfParams: KdfParams = DEFAULT_KDF_PARAMS,
): Promise<SignupKeyMaterial> {
  const salt = generateSalt();
  const vaultKey = generateKey();
  const recoveryKey = generateKey();

  const masterKey = await deriveMasterKey(masterPassword, salt, kdfParams);
  const authHash = await deriveAuthHash(masterKey);

  const wrappedVaultKey = await wrapKey(vaultKey, masterKey);
  const wrappedRecoveryKey = await wrapKey(vaultKey, recoveryKey);

  return { salt, kdfParams, authHash, wrappedVaultKey, wrappedRecoveryKey, recoveryKey };
}

/**
 * Unlock (docs/ENCRYPTION_DESIGN.md §4.2): re-derive the Master Key from the
 * password + stored salt, produce the auth verifier for login, and unwrap the
 * Vault Key into memory. A wrong password fails at `unwrapKey` (GCM tag check).
 */
export async function unlockVault(
  masterPassword: string,
  salt: Uint8Array,
  kdfParams: KdfParams,
  wrappedVaultKey: CipherBundle,
): Promise<{ authHash: string; vaultKey: Uint8Array }> {
  const masterKey = await deriveMasterKey(masterPassword, salt, kdfParams);
  const authHash = await deriveAuthHash(masterKey);
  const vaultKey = await unwrapKey(wrappedVaultKey, masterKey);
  return { authHash, vaultKey };
}

/**
 * Derive only the auth verifier (for the login request) without unwrapping the
 * vault — useful when the login step and the unwrap step are separated.
 */
export async function deriveLoginAuthHash(
  masterPassword: string,
  salt: Uint8Array,
  kdfParams: KdfParams,
): Promise<string> {
  const masterKey = await deriveMasterKey(masterPassword, salt, kdfParams);
  return deriveAuthHash(masterKey);
}

/**
 * Recovery (docs/ENCRYPTION_DESIGN.md §4.3): use the saved Recovery Key to
 * unwrap the Vault Key, then re-wrap it under a brand-new master password.
 * Returns the new key material to send to the server. No data is lost and the
 * server never sees plaintext.
 */
export async function recoverWithRecoveryKey(
  recoveryKey: Uint8Array,
  wrappedRecoveryKey: CipherBundle,
  newMasterPassword: string,
  kdfParams: KdfParams = DEFAULT_KDF_PARAMS,
): Promise<{
  salt: Uint8Array;
  kdfParams: KdfParams;
  authHash: string;
  wrappedVaultKey: CipherBundle;
  vaultKey: Uint8Array;
}> {
  const vaultKey = await unwrapKey(wrappedRecoveryKey, recoveryKey);

  const salt = generateSalt();
  const masterKey = await deriveMasterKey(newMasterPassword, salt, kdfParams);
  const authHash = await deriveAuthHash(masterKey);
  const wrappedVaultKey = await wrapKey(vaultKey, masterKey);

  return { salt, kdfParams, authHash, wrappedVaultKey, vaultKey };
}

/**
 * Change master password (docs/ENCRYPTION_DESIGN.md §2, reason 1): re-wrap the
 * existing Vault Key under a new Master Key. The vault itself is never
 * re-encrypted — only the wrapped Vault Key changes.
 */
export async function changeMasterPassword(
  vaultKey: Uint8Array,
  newMasterPassword: string,
  kdfParams: KdfParams = DEFAULT_KDF_PARAMS,
): Promise<{ salt: Uint8Array; kdfParams: KdfParams; authHash: string; wrappedVaultKey: CipherBundle }> {
  const salt = generateSalt();
  const masterKey = await deriveMasterKey(newMasterPassword, salt, kdfParams);
  const authHash = await deriveAuthHash(masterKey);
  const wrappedVaultKey = await wrapKey(vaultKey, masterKey);
  return { salt, kdfParams, authHash, wrappedVaultKey };
}

/** Encrypt a credential's secret fields under the Vault Key. */
export async function encryptCredential(
  fields: CredentialFields,
  vaultKey: Uint8Array,
): Promise<CipherBundle> {
  return aesGcmEncrypt(utf8ToBytes(JSON.stringify(fields)), vaultKey);
}

/** Decrypt a credential bundle back into its secret fields. Throws on tamper. */
export async function decryptCredential(
  bundle: CipherBundle,
  vaultKey: Uint8Array,
): Promise<CredentialFields> {
  return JSON.parse(bytesToUtf8(await aesGcmDecrypt(bundle, vaultKey))) as CredentialFields;
}
