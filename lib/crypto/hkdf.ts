import { AUTH_HKDF_INFO, KEY_BYTES } from './constants';
import { getWebCrypto } from './random';
import { utf8ToBytes, bytesToHex, asBufferSource } from './encoding';

// HKDF-SHA256 derivation of the auth verifier. The key-separation rule
// (docs/ENCRYPTION_DESIGN.md §2): the bytes used to authenticate to the server
// must never equal the bytes used to encrypt data. We derive `authHash` from the
// Master Key via HKDF with a distinct `info` label, so the server-facing
// verifier is cryptographically independent of the encryption key.

/**
 * Derive the auth verifier bytes from the Master Key via HKDF-SHA256.
 * The salt is intentionally empty here — domain separation comes from the
 * `info` label, and the Master Key is already a high-entropy Argon2id output.
 */
export async function deriveAuthHashBytes(masterKey: Uint8Array): Promise<Uint8Array> {
  const subtle = getWebCrypto().subtle;
  const baseKey = await subtle.importKey('raw', asBufferSource(masterKey), 'HKDF', false, [
    'deriveBits',
  ]);
  const bits = await subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: asBufferSource(new Uint8Array(0)),
      info: asBufferSource(utf8ToBytes(AUTH_HKDF_INFO)),
    },
    baseKey,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

/**
 * The auth verifier as a hex string. This is what the client sends to the
 * server, which hashes it again (argon2) before storing — so even the verifier
 * is never stored in the clear.
 */
export async function deriveAuthHash(masterKey: Uint8Array): Promise<string> {
  return bytesToHex(await deriveAuthHashBytes(masterKey));
}
