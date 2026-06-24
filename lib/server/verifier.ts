import bcrypt from 'bcryptjs';

// Server-side hashing of the client's auth verifier (`authHash`).
//
// The client sends `authHash` = HKDF(masterKey, "auth") — a 256-bit,
// high-entropy value derived in the browser. We hash it again before storing so
// a database leak never exposes a value usable to authenticate
// (docs/ENCRYPTION_DESIGN.md §2, §7). bcrypt is used here because it is already
// a project dependency; the verifier is already high-entropy, so the cost
// factor only needs to defend against an offline leak, not weak passwords.

const COST = 12;

/** Hash a client-supplied auth verifier for storage in `User.authHash`. */
export function hashVerifier(authHash: string): Promise<string> {
  return bcrypt.hash(authHash, COST);
}

/** Verify a login attempt's verifier against the stored hash. */
export function verifyVerifier(authHash: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(authHash, storedHash);
}
