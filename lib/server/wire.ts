import type { WireCipherBundle } from '@/lib/crypto/wire';

// Server-side conversion between base64 wire bundles and the raw byte columns
// Prisma stores. The server treats all of this as opaque ciphertext — it never
// decrypts (docs/ENCRYPTION_DESIGN.md §5).

export interface StoredBundle {
  data: Buffer;
  iv: Buffer;
  tag: Buffer;
}

/** Decode a base64 wire bundle into Buffers for storage. */
export function decodeBundle(wire: WireCipherBundle): StoredBundle {
  return {
    data: Buffer.from(wire.ciphertext, 'base64'),
    iv: Buffer.from(wire.iv, 'base64'),
    tag: Buffer.from(wire.tag, 'base64'),
  };
}

/** Encode stored byte columns back into a base64 wire bundle for the client. */
export function encodeBundle(data: Uint8Array, iv: Uint8Array, tag: Uint8Array): WireCipherBundle {
  return {
    ciphertext: Buffer.from(data).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    tag: Buffer.from(tag).toString('base64'),
  };
}
