import { IV_BYTES, KEY_BYTES, TAG_BYTES } from './constants';
import { getWebCrypto, generateIv } from './random';
import { asBufferSource } from './encoding';
import type { CipherBundle } from './types';

// AES-256-GCM via Web Crypto SubtleCrypto. SubtleCrypto returns ciphertext with
// the GCM tag appended; we split it out so `tag` can be stored/sent separately
// (matching the DB columns in docs/ENCRYPTION_DESIGN.md §3).

async function importAesKey(keyBytes: Uint8Array, usage: KeyUsage): Promise<CryptoKey> {
  if (keyBytes.length !== KEY_BYTES) {
    throw new Error(`AES key must be ${KEY_BYTES} bytes, got ${keyBytes.length}.`);
  }
  return getWebCrypto().subtle.importKey(
    'raw',
    asBufferSource(keyBytes),
    { name: 'AES-GCM' },
    false,
    [usage],
  );
}

/**
 * Encrypt `plaintext` under `keyBytes` with a fresh random IV.
 * Returns the ciphertext, IV, and the detached 128-bit GCM tag.
 */
export async function aesGcmEncrypt(
  plaintext: Uint8Array,
  keyBytes: Uint8Array,
): Promise<CipherBundle> {
  const key = await importAesKey(keyBytes, 'encrypt');
  const iv = generateIv();

  const sealed = new Uint8Array(
    await getWebCrypto().subtle.encrypt(
      { name: 'AES-GCM', iv: asBufferSource(iv), tagLength: TAG_BYTES * 8 },
      key,
      asBufferSource(plaintext),
    ),
  );

  // SubtleCrypto appends the tag to the ciphertext; detach it.
  const ciphertext = sealed.slice(0, sealed.length - TAG_BYTES);
  const tag = sealed.slice(sealed.length - TAG_BYTES);
  return { ciphertext, iv, tag };
}

/**
 * Decrypt a {@link CipherBundle} under `keyBytes`.
 * Throws if the key, IV, or ciphertext/tag have been tampered with — GCM
 * authentication failure surfaces as a thrown error, never as garbage output.
 */
export async function aesGcmDecrypt(
  bundle: CipherBundle,
  keyBytes: Uint8Array,
): Promise<Uint8Array> {
  const { ciphertext, iv, tag } = bundle;
  if (iv.length !== IV_BYTES) {
    throw new Error(`IV must be ${IV_BYTES} bytes, got ${iv.length}.`);
  }
  if (tag.length !== TAG_BYTES) {
    throw new Error(`Auth tag must be ${TAG_BYTES} bytes, got ${tag.length}.`);
  }

  const key = await importAesKey(keyBytes, 'decrypt');

  // Re-attach the tag to the ciphertext for SubtleCrypto.
  const sealed = new Uint8Array(ciphertext.length + tag.length);
  sealed.set(ciphertext, 0);
  sealed.set(tag, ciphertext.length);

  try {
    return new Uint8Array(
      await getWebCrypto().subtle.decrypt(
        { name: 'AES-GCM', iv: asBufferSource(iv), tagLength: TAG_BYTES * 8 },
        key,
        asBufferSource(sealed),
      ),
    );
  } catch {
    // Normalise the platform's opaque OperationError into a clear failure.
    throw new Error('Decryption failed: data is corrupt, tampered, or the key is wrong.');
  }
}

/** Convenience: encrypt one key (e.g. the Vault Key) under another (wrapping). */
export function wrapKey(keyToWrap: Uint8Array, wrappingKey: Uint8Array): Promise<CipherBundle> {
  return aesGcmEncrypt(keyToWrap, wrappingKey);
}

/** Convenience: decrypt a wrapped key. Throws on tamper or wrong key. */
export function unwrapKey(wrapped: CipherBundle, wrappingKey: Uint8Array): Promise<Uint8Array> {
  return aesGcmDecrypt(wrapped, wrappingKey);
}
