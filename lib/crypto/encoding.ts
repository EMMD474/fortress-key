// Byte <-> string conversion helpers. These are not cryptographic; they exist so
// the rest of the module never reaches for Node's Buffer (which is absent in the
// browser) and so we encode binary consistently when talking to the API.

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** UTF-8 encode a string to bytes. */
export function utf8ToBytes(text: string): Uint8Array {
  return textEncoder.encode(text);
}

/** UTF-8 decode bytes to a string. */
export function bytesToUtf8(bytes: Uint8Array): string {
  return textDecoder.decode(bytes);
}

/** Standard base64 encode. Works in browser and Node without `Buffer`. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Standard base64 decode. */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

/** Lowercase hex encode — used for the auth verifier sent to the server. */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Cast a Uint8Array to `BufferSource` for the Web Crypto API.
 *
 * TS 5.7 types a plain `Uint8Array` as `Uint8Array<ArrayBufferLike>`, which may
 * be backed by a `SharedArrayBuffer` and so isn't assignable to Web Crypto's
 * `BufferSource`. Our buffers are never shared, so this assertion is safe and
 * avoids copying on every crypto call.
 */
export function asBufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

/** Constant-time equality for two byte arrays. */
export function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
