import { IV_BYTES, KEY_BYTES, SALT_BYTES } from './constants';

/**
 * Returns the platform Web Crypto implementation. Works in the browser and in
 * Node 18+ (where `globalThis.crypto` is the Web Crypto API). Throws if neither
 * is available so we never silently fall back to a weak RNG.
 */
export function getWebCrypto(): Crypto {
  const c = globalThis.crypto;
  if (!c || !c.getRandomValues || !c.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  return c;
}

/** Cryptographically secure random bytes via `crypto.getRandomValues`. */
export function randomBytes(length: number): Uint8Array {
  const out = new Uint8Array(length);
  getWebCrypto().getRandomValues(out);
  return out;
}

/** A fresh per-user salt for Argon2id. */
export function generateSalt(): Uint8Array {
  return randomBytes(SALT_BYTES);
}

/** A fresh 96-bit IV for a single AES-GCM operation. Never reuse an IV+key pair. */
export function generateIv(): Uint8Array {
  return randomBytes(IV_BYTES);
}

/**
 * A fresh random 256-bit key — used for the Vault Key and the Recovery Key,
 * both of which are generated once at signup.
 */
export function generateKey(): Uint8Array {
  return randomBytes(KEY_BYTES);
}
