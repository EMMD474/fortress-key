// Shared types for the zero-knowledge browser crypto module.
// See docs/ENCRYPTION_DESIGN.md §2.

/**
 * Argon2id parameters. Stored per-user (public, non-secret) in `User.kdfParams`
 * so they can be raised over time without breaking existing accounts.
 */
export interface KdfParams {
  /** Algorithm version, so we can migrate parameters later. */
  version: number;
  /** Memory cost in KiB. */
  memoryKiB: number;
  /** Time cost (number of iterations / passes). */
  iterations: number;
  /** Degree of parallelism (lanes). */
  parallelism: number;
}

/**
 * An AES-256-GCM ciphertext bundle. `iv` and `tag` are non-secret; integrity is
 * guaranteed by the GCM tag, which decryption verifies.
 */
export interface CipherBundle {
  ciphertext: Uint8Array;
  iv: Uint8Array;
  tag: Uint8Array;
}
