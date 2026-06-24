import { createHmac } from 'crypto';
import { DEFAULT_KDF_PARAMS, SALT_BYTES } from '@/lib/crypto/constants';
import type { KdfParams } from '@/lib/crypto/types';

// The salt endpoint must answer for any email — including ones with no account —
// or it becomes a user-enumeration oracle. For an unknown email we return a
// salt deterministically derived from the email under a server secret. It is
// stable (so repeated probes look identical) and indistinguishable from a real
// random salt, while never colliding with a real user's salt in practice.

function decoySalt(email: string): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || 'fortress-key-dev-secret';
  const digest = createHmac('sha256', secret)
    .update(`salt-decoy:${email.toLowerCase()}`)
    .digest();
  return new Uint8Array(digest.subarray(0, SALT_BYTES));
}

export interface SaltParamsResult {
  salt: Uint8Array;
  kdfParams: KdfParams;
}

/**
 * Resolve the public KDF inputs for an email. Returns the real values for a
 * known user and a deterministic decoy for an unknown one — the caller cannot
 * tell the difference, so the endpoint leaks nothing about who has an account.
 */
export function resolveSaltParams(
  user: { salt: Uint8Array | null; kdfParams: unknown } | null,
  email: string,
): SaltParamsResult {
  if (user?.salt) {
    return {
      salt: new Uint8Array(user.salt),
      kdfParams: (user.kdfParams as KdfParams) ?? DEFAULT_KDF_PARAMS,
    };
  }
  return { salt: decoySalt(email), kdfParams: DEFAULT_KDF_PARAMS };
}
