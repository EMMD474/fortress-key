import { KEY_BYTES } from './constants';

// Human-friendly encoding for the 256-bit Recovery Key. Crockford Base32 (no
// I/L/O/U) keeps it unambiguous to read and type; we group into blocks of 5 and
// join with dashes. Shown to the user exactly once at signup and never stored
// by the server (docs/ENCRYPTION_DESIGN.md §4.1).

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const GROUP_SIZE = 5;

/** Encode raw key bytes into a grouped, dash-separated Recovery Key string. */
export function formatRecoveryKey(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += ALPHABET[(value >>> bits) & 31];
    }
  }
  if (bits > 0) {
    out += ALPHABET[(value << (5 - bits)) & 31];
  }
  // Group for readability: ABCDE-FGHJK-...
  const groups: string[] = [];
  for (let i = 0; i < out.length; i += GROUP_SIZE) {
    groups.push(out.slice(i, i + GROUP_SIZE));
  }
  return groups.join('-');
}

/**
 * Parse a user-entered Recovery Key back into raw bytes. Tolerant of
 * lower/upper case, spaces, dashes, and the common O/0 and I/L/1 confusions.
 * Throws if the result isn't the expected key length.
 */
export function parseRecoveryKey(input: string): Uint8Array {
  const cleaned = input
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1');

  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of cleaned) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) {
      throw new Error('Recovery key contains invalid characters.');
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }

  if (bytes.length !== KEY_BYTES) {
    throw new Error('Recovery key is not the expected length.');
  }
  return new Uint8Array(bytes);
}
