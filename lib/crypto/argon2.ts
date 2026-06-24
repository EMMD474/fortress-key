import { argon2id } from 'hash-wasm';
import { KEY_BYTES } from './constants';
import type { KdfParams } from './types';

// Argon2id key derivation via hash-wasm (pure WASM — runs in the browser and in
// Node without native bindings). Turns the master password into the 256-bit
// Master Key. The Master Key never leaves the browser; only a separate HKDF auth
// verifier is sent to the server (see hkdf.ts).

/**
 * Derive the 256-bit Master Key from the master password and the user's salt.
 *
 * @param masterPassword the secret typed by the user
 * @param salt per-user random bytes (public, stored on the server)
 * @param params Argon2id cost parameters (public, stored per-user)
 */
export async function deriveMasterKey(
  masterPassword: string,
  salt: Uint8Array,
  params: KdfParams,
): Promise<Uint8Array> {
  return argon2id({
    password: masterPassword,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memoryKiB,
    hashLength: KEY_BYTES,
    outputType: 'binary',
  });
}
