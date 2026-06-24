import { describe, it, expect } from 'vitest';
import {
  aesGcmEncrypt,
  aesGcmDecrypt,
  wrapKey,
  unwrapKey,
} from './aesgcm';
import { deriveMasterKey } from './argon2';
import { deriveAuthHashBytes } from './hkdf';
import { generateKey, generateSalt, generateIv, randomBytes } from './random';
import { utf8ToBytes, bytesToUtf8, bytesEqual } from './encoding';
import {
  createSignupKeyMaterial,
  unlockVault,
  recoverWithRecoveryKey,
  changeMasterPassword,
  encryptCredential,
  decryptCredential,
} from './vault';
import { DEFAULT_KDF_PARAMS, KEY_BYTES, IV_BYTES, TAG_BYTES, SALT_BYTES } from './constants';

// Use a deliberately cheap KDF in tests so Argon2id doesn't make the suite slow.
const FAST_KDF = { version: 1, memoryKiB: 1024, iterations: 1, parallelism: 1 };

describe('CSPRNG helpers', () => {
  it('produce the documented sizes', () => {
    expect(generateSalt().length).toBe(SALT_BYTES);
    expect(generateKey().length).toBe(KEY_BYTES);
    expect(generateIv().length).toBe(IV_BYTES);
  });

  it('do not repeat (overwhelmingly likely distinct)', () => {
    const a = randomBytes(32);
    const b = randomBytes(32);
    expect(bytesEqual(a, b)).toBe(false);
  });
});

describe('AES-256-GCM round-trip', () => {
  it('decrypts what it encrypts', async () => {
    const key = generateKey();
    const plaintext = utf8ToBytes('correct horse battery staple');
    const bundle = await aesGcmEncrypt(plaintext, key);

    expect(bundle.iv.length).toBe(IV_BYTES);
    expect(bundle.tag.length).toBe(TAG_BYTES);

    const out = await aesGcmDecrypt(bundle, key);
    expect(bytesToUtf8(out)).toBe('correct horse battery staple');
  });

  it('uses a fresh IV per encryption', async () => {
    const key = generateKey();
    const pt = utf8ToBytes('same input');
    const a = await aesGcmEncrypt(pt, key);
    const b = await aesGcmEncrypt(pt, key);
    expect(bytesEqual(a.iv, b.iv)).toBe(false);
    expect(bytesEqual(a.ciphertext, b.ciphertext)).toBe(false);
  });
});

describe('AES-256-GCM tamper detection', () => {
  it('rejects a flipped ciphertext byte', async () => {
    const key = generateKey();
    const bundle = await aesGcmEncrypt(utf8ToBytes('secret'), key);
    bundle.ciphertext[0] ^= 0x01;
    await expect(aesGcmDecrypt(bundle, key)).rejects.toThrow();
  });

  it('rejects a flipped auth tag byte', async () => {
    const key = generateKey();
    const bundle = await aesGcmEncrypt(utf8ToBytes('secret'), key);
    bundle.tag[0] ^= 0x01;
    await expect(aesGcmDecrypt(bundle, key)).rejects.toThrow();
  });

  it('rejects a flipped IV byte', async () => {
    const key = generateKey();
    const bundle = await aesGcmEncrypt(utf8ToBytes('secret'), key);
    bundle.iv[0] ^= 0x01;
    await expect(aesGcmDecrypt(bundle, key)).rejects.toThrow();
  });

  it('rejects the wrong key', async () => {
    const bundle = await aesGcmEncrypt(utf8ToBytes('secret'), generateKey());
    await expect(aesGcmDecrypt(bundle, generateKey())).rejects.toThrow();
  });
});

describe('Key wrapping', () => {
  it('wraps and unwraps a Vault Key under both a Master Key and a Recovery Key', async () => {
    const vaultKey = generateKey();
    const masterKey = generateKey();
    const recoveryKey = generateKey();

    const wrappedUnderMaster = await wrapKey(vaultKey, masterKey);
    const wrappedUnderRecovery = await wrapKey(vaultKey, recoveryKey);

    expect(bytesEqual(await unwrapKey(wrappedUnderMaster, masterKey), vaultKey)).toBe(true);
    expect(bytesEqual(await unwrapKey(wrappedUnderRecovery, recoveryKey), vaultKey)).toBe(true);
  });
});

describe('Argon2id + HKDF key separation', () => {
  it('derives a stable 256-bit Master Key for the same inputs', async () => {
    const salt = generateSalt();
    const a = await deriveMasterKey('pw', salt, FAST_KDF);
    const b = await deriveMasterKey('pw', salt, FAST_KDF);
    expect(a.length).toBe(KEY_BYTES);
    expect(bytesEqual(a, b)).toBe(true);
  });

  it('produces a different Master Key for a different salt', async () => {
    const a = await deriveMasterKey('pw', generateSalt(), FAST_KDF);
    const b = await deriveMasterKey('pw', generateSalt(), FAST_KDF);
    expect(bytesEqual(a, b)).toBe(false);
  });

  it('auth verifier bytes are NOT equal to the Master Key (key-separation rule)', async () => {
    const masterKey = await deriveMasterKey('pw', generateSalt(), FAST_KDF);
    const authBytes = await deriveAuthHashBytes(masterKey);
    expect(authBytes.length).toBe(KEY_BYTES);
    expect(bytesEqual(authBytes, masterKey)).toBe(false);
  });
});

describe('End-to-end vault flows', () => {
  it('signup -> unlock recovers the same Vault Key and a matching auth hash', async () => {
    const mat = await createSignupKeyMaterial('hunter2', FAST_KDF);
    const unlocked = await unlockVault('hunter2', mat.salt, mat.kdfParams, mat.wrappedVaultKey);
    expect(unlocked.authHash).toBe(mat.authHash);
    // The unlocked Vault Key must be the same one wrapped under the Recovery Key.
    const viaRecovery = await unwrapKey(mat.wrappedRecoveryKey, mat.recoveryKey);
    expect(bytesEqual(unlocked.vaultKey, viaRecovery)).toBe(true);
  });

  it('unlock with the wrong password fails (GCM tag check)', async () => {
    const mat = await createSignupKeyMaterial('hunter2', FAST_KDF);
    await expect(
      unlockVault('wrong-password', mat.salt, mat.kdfParams, mat.wrappedVaultKey),
    ).rejects.toThrow();
  });

  it('recovery re-wraps the same Vault Key under a new password', async () => {
    const mat = await createSignupKeyMaterial('old-pw', FAST_KDF);
    const original = await unlockVault('old-pw', mat.salt, mat.kdfParams, mat.wrappedVaultKey);

    const recovered = await recoverWithRecoveryKey(
      mat.recoveryKey,
      mat.wrappedRecoveryKey,
      'brand-new-pw',
      FAST_KDF,
    );
    expect(bytesEqual(recovered.vaultKey, original.vaultKey)).toBe(true);

    // New password now unlocks; old password no longer does.
    const reUnlock = await unlockVault('brand-new-pw', recovered.salt, recovered.kdfParams, recovered.wrappedVaultKey);
    expect(bytesEqual(reUnlock.vaultKey, original.vaultKey)).toBe(true);
    expect(reUnlock.authHash).toBe(recovered.authHash);
  });

  it('change master password keeps the same Vault Key', async () => {
    const mat = await createSignupKeyMaterial('pw1', FAST_KDF);
    const { vaultKey } = await unlockVault('pw1', mat.salt, mat.kdfParams, mat.wrappedVaultKey);

    const changed = await changeMasterPassword(vaultKey, 'pw2', FAST_KDF);
    const reUnlock = await unlockVault('pw2', changed.salt, changed.kdfParams, changed.wrappedVaultKey);
    expect(bytesEqual(reUnlock.vaultKey, vaultKey)).toBe(true);
  });

  it('encrypts and decrypts credential fields under the Vault Key', async () => {
    const vaultKey = generateKey();
    const fields = {
      username: 'alice@example.com',
      password: 'p@ssw0rd!',
      website: 'https://example.com',
      notes: 'work account',
    };
    const bundle = await encryptCredential(fields, vaultKey);
    expect(await decryptCredential(bundle, vaultKey)).toEqual(fields);
  });

  it('credential decryption fails under a different Vault Key', async () => {
    const bundle = await encryptCredential(
      { username: 'a', password: 'b', website: 'c', notes: 'd' },
      generateKey(),
    );
    await expect(decryptCredential(bundle, generateKey())).rejects.toThrow();
  });
});
