import { bytesToBase64, base64ToBytes } from './encoding';
import type { CipherBundle, KdfParams } from './types';

// JSON-friendly wire shapes for crypto material crossing the network. Everything
// here is non-secret or already-wrapped ciphertext — the server stores these
// verbatim as opaque blobs (docs/ENCRYPTION_DESIGN.md §5).

/** A {@link CipherBundle} with each field base64-encoded for JSON transport. */
export interface WireCipherBundle {
  ciphertext: string;
  iv: string;
  tag: string;
}

export function bundleToWire(bundle: CipherBundle): WireCipherBundle {
  return {
    ciphertext: bytesToBase64(bundle.ciphertext),
    iv: bytesToBase64(bundle.iv),
    tag: bytesToBase64(bundle.tag),
  };
}

export function wireToBundle(wire: WireCipherBundle): CipherBundle {
  return {
    ciphertext: base64ToBytes(wire.ciphertext),
    iv: base64ToBytes(wire.iv),
    tag: base64ToBytes(wire.tag),
  };
}

/** Public KDF inputs the client needs before it can derive the Master Key. */
export interface WireSaltParams {
  salt: string; // base64
  kdfParams: KdfParams;
}

/** Body sent to the register endpoint. No plaintext password — only key material. */
export interface WireSignupBody {
  firstName: string;
  lastName?: string | null;
  userName: string;
  email: string;
  salt: string; // base64
  kdfParams: KdfParams;
  authHash: string; // hex verifier
  wrappedVaultKey: WireCipherBundle;
  wrappedRecoveryKey: WireCipherBundle;
}

/** Body sent to the recovery (reset-password) endpoint after re-wrapping. */
export interface WireRecoveryBody {
  email: string;
  salt: string; // base64
  kdfParams: KdfParams;
  authHash: string; // hex verifier
  wrappedVaultKey: WireCipherBundle;
}
