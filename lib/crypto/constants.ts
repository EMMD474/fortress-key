import type { KdfParams } from './types';

// Sizes, in bytes, for the primitives used across the module.
export const SALT_BYTES = 16; // 128-bit per-user salt
export const KEY_BYTES = 32; // 256-bit keys (Vault Key, Recovery Key, Master Key)
export const IV_BYTES = 12; // 96-bit IV — the recommended size for AES-GCM
export const TAG_BYTES = 16; // 128-bit GCM auth tag

/**
 * Default Argon2id parameters for new accounts. Memory-hard and tuned for an
 * interactive browser unlock (~a few hundred ms on a typical laptop). These are
 * stored per-user so they can be raised later without locking anyone out.
 *
 * 64 MiB / 3 iterations / 1 lane sits in the range OWASP recommends for Argon2id.
 */
export const DEFAULT_KDF_PARAMS: KdfParams = {
  version: 1,
  memoryKiB: 64 * 1024,
  iterations: 3,
  parallelism: 1,
};

/**
 * HKDF "info" label that separates the auth verifier from the encryption key.
 * The bytes used to authenticate to the server must never equal the bytes used
 * to encrypt data (docs/ENCRYPTION_DESIGN.md §2, key-separation rule).
 */
export const AUTH_HKDF_INFO = 'fortress-key/auth-verifier/v1';
