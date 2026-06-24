import { signIn } from 'next-auth/react';
import {
  createSignupKeyMaterial,
  deriveLoginAuthHash,
  unlockVault,
  recoverWithRecoveryKey,
} from './vault';
import { parseRecoveryKey, formatRecoveryKey } from './recoveryKey';
import { setVaultKey, clearVaultKey } from './vaultSession';
import { bytesToBase64, base64ToBytes } from './encoding';
import { bundleToWire, wireToBundle } from './wire';
import type { WireSaltParams, WireSignupBody, WireRecoveryBody, WireCipherBundle } from './wire';

// Browser-side orchestration of the zero-knowledge auth flows. ALL key
// derivation and (un)wrapping happens here, in the user's browser. The server
// only ever receives wrapped keys and the auth verifier — never the master
// password, the Vault Key, or the Recovery Key (docs/ENCRYPTION_DESIGN.md §4).

interface SignupProfile {
  firstName: string;
  lastName?: string | null;
  userName: string;
  email: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await res.json().catch(() => null);
    throw new Error(message?.error || `Request to ${url} failed (${res.status}).`);
  }
  return res.json();
}

/** Fetch the public salt + KDF params for an email so we can derive the Master Key. */
async function fetchSaltParams(email: string): Promise<WireSaltParams> {
  const res = await fetch(`/api/auth/salt?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Could not load account parameters.');
  return res.json();
}

/**
 * Signup (§4.1): generate all key material in the browser, send only the
 * wrapped keys + verifier, and return the Recovery Key (formatted) to show the
 * user exactly once.
 */
export async function registerAccount(
  profile: SignupProfile,
  masterPassword: string,
): Promise<{ recoveryKey: string }> {
  const material = await createSignupKeyMaterial(masterPassword);

  const body: WireSignupBody = {
    firstName: profile.firstName,
    lastName: profile.lastName ?? null,
    userName: profile.userName,
    email: profile.email,
    salt: bytesToBase64(material.salt),
    kdfParams: material.kdfParams,
    authHash: material.authHash,
    wrappedVaultKey: bundleToWire(material.wrappedVaultKey),
    wrappedRecoveryKey: bundleToWire(material.wrappedRecoveryKey),
  };

  await postJson('/api/auth/register', body);

  // The Recovery Key never goes to the server; surface it to the UI once.
  const recoveryKey = formatRecoveryKey(material.recoveryKey);
  // Defensive: drop the raw bytes from this scope; the formatted string is all
  // the UI needs to display.
  material.recoveryKey.fill(0);
  return { recoveryKey };
}

/**
 * Unlock (§4.2): derive the auth verifier and sign in, then download the wrapped
 * Vault Key, unwrap it, and hold it in memory for the session.
 */
export async function loginAndUnlock(email: string, masterPassword: string): Promise<void> {
  const { salt: saltB64, kdfParams } = await fetchSaltParams(email);
  const salt = base64ToBytes(saltB64);

  // 1) Derive verifier and authenticate. NextAuth never sees the password.
  const authHash = await deriveLoginAuthHash(masterPassword, salt, kdfParams);
  const res = await signIn('credentials', { email, authHash, redirect: false });
  if (!res || res.error) {
    throw new Error('Invalid email or master password.');
  }

  // 2) Download the wrapped Vault Key (session-protected) and unwrap locally.
  const wrapped = await fetchWrappedVaultKey();
  const { vaultKey } = await unlockVault(masterPassword, salt, kdfParams, wireToBundle(wrapped));
  setVaultKey(vaultKey);
}

/** GET the caller's wrapped Vault Key (requires an authenticated session). */
async function fetchWrappedVaultKey(): Promise<WireCipherBundle> {
  const res = await fetch('/api/auth/vault-key', { credentials: 'include' });
  if (!res.ok) throw new Error('Could not load your vault key.');
  const data = (await res.json()) as { wrappedVaultKey: WireCipherBundle };
  return data.wrappedVaultKey;
}

/**
 * Recovery (§4.3): use the saved Recovery Key to unwrap the Vault Key, choose a
 * new master password, re-wrap, and send the new key material to the server.
 * No data is lost and the server never sees plaintext.
 */
export async function recoverAccount(
  email: string,
  recoveryKeyInput: string,
  newMasterPassword: string,
): Promise<void> {
  const recoveryKey = parseRecoveryKey(recoveryKeyInput);

  // Fetch the copy of the Vault Key wrapped under the Recovery Key.
  const res = await fetch(`/api/auth/recovery-material?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Could not start recovery for this account.');
  const { wrappedRecoveryKey } = (await res.json()) as { wrappedRecoveryKey: WireCipherBundle };

  let recovered;
  try {
    recovered = await recoverWithRecoveryKey(
      recoveryKey,
      wireToBundle(wrappedRecoveryKey),
      newMasterPassword,
    );
  } catch {
    throw new Error('That recovery key is not valid for this account.');
  } finally {
    recoveryKey.fill(0);
  }

  const body: WireRecoveryBody = {
    email,
    salt: bytesToBase64(recovered.salt),
    kdfParams: recovered.kdfParams,
    authHash: recovered.authHash,
    wrappedVaultKey: bundleToWire(recovered.wrappedVaultKey),
  };
  await postJson('/api/auth/reset-password', body);
  recovered.vaultKey.fill(0);
}

/** Lock the vault (e.g. on logout). */
export function lockVault(): void {
  clearVaultKey();
}
