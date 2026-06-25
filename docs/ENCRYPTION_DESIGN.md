# Fortress Key — Encryption Architecture (Zero-Knowledge E2E)

**Status:** Approved design — pending implementation (Stage 1).
**Supersedes:** the server-side encryption notes in `VAULT_README.md`.
**Audience:** maintainers implementing and auditing the vault crypto.

---

## 1. Goal & threat model

Fortress Key is a real, public password manager. The security promise to users is:

> Nobody but the user — not the server, not the operator, not a database thief, not a subpoena — can read a stored password.

To make that promise true, **all encryption and decryption happen in the user's browser**. The server only ever stores and serves **opaque ciphertext**. This is the *zero-knowledge* (end-to-end encrypted) model used by Bitwarden, 1Password, and Proton Pass.

### What the server can see
- The user's email and profile fields.
- A verifier (`authHash`, itself hashed again server-side) used to confirm login — **not** the password.
- Random, non-secret values: per-user `salt`, KDF parameters, IVs.
- Encrypted blobs: wrapped keys and credential ciphertext.

### What the server can NEVER see
- The master password.
- The Master Key, Recovery Key, or Vault Key.
- Any credential field (username, password, website, notes) in plaintext.

### Out-of-scope threats (be honest with users)
- A compromised **end-user device** (keylogger, malicious browser extension) — E2E cannot protect plaintext the user themselves is typing/viewing.
- A **malicious code push to the client** (supply-chain). Mitigations: Subresource Integrity, strict CSP, dependency scanning, reproducible builds. This is the residual trust users place in us; it is why a third-party audit is a hard gate before public launch.

---

## 2. Core idea: the key hierarchy

The central design decision: **credentials are not encrypted with the master password.** A random **Vault Key** sits in the middle, and the server stores *wrapped* (encrypted) copies of it.

```
  Master Password ──Argon2id(salt)──► Master Key ───┐
   (never leaves browser)                           │ unwraps
                                                     ├──► VAULT KEY ──► encrypts every credential
  Recovery Key ────────────────────► (key bytes) ───┘   (random 256-bit,
   (shown once at signup, user saves it)                  generated once at signup)
```

Two reasons for the indirection:

1. **Change master password without re-encrypting the vault.** Only the *wrapped Vault Key* is re-encrypted, not thousands of credentials.
2. **Recovery is possible without the server holding a backdoor.** A second wrapped copy of the Vault Key — encrypted under the Recovery Key — lets a user who saved their recovery key regain access.

### Primitives

| Purpose | Primitive | Parameters |
|---|---|---|
| Key derivation (password → key) | **Argon2id** (WASM in browser) | memory-hard; params stored per-user in `kdfParams` so they can be raised later |
| Encryption / key wrapping | **AES-256-GCM** | random 96-bit IV per operation; 128-bit auth tag stored and verified |
| Auth verifier derivation | **HKDF-SHA256** | splits a separate `authHash` from the Master Key so the same bytes are never reused for auth + encryption |
| Random material | **CSPRNG** (`crypto.getRandomValues`) | salt, Vault Key, Recovery Key, IVs |

> **Key-separation rule:** the bytes used to *authenticate* to the server must never equal the bytes used to *encrypt* data. We derive `authHash` from the Master Key via HKDF with a distinct info label; the server only ever stores `argon2(authHash)`.

---

## 3. Data model changes

### User (additions)

| Field | Type | Secret? | Notes |
|---|---|---|---|
| `salt` | `Bytes` | No | Per-user, random. Input to Argon2id. |
| `kdfParams` | `Json` | No | Argon2id memory/time/parallelism + version. Enables future upgrades. |
| `authHash` | `String` | No (already hashed) | Replaces `masterHash`. Server stores `argon2(authHash)`; verifies login without seeing the password. |
| `wrappedVaultKey` | `Bytes` | Encrypted | Vault Key encrypted under the Master Key. |
| `wrappedVaultKeyIv` | `Bytes` | No | IV for the above. |
| `wrappedVaultKeyTag` | `Bytes` | No | GCM tag for the above. |
| `wrappedRecoveryKey` | `Bytes` | Encrypted | Vault Key encrypted under the Recovery Key. |
| `wrappedRecoveryKeyIv` | `Bytes` | No | IV for the above. |
| `wrappedRecoveryKeyTag` | `Bytes` | No | GCM tag for the above. |

> Implementations may concatenate `iv || ciphertext || tag` into one `Bytes` column instead of three columns. Either is fine; be consistent.

### Credential (additions)

| Field | Type | Notes |
|---|---|---|
| `tag` | `Bytes` | **GCM auth tag — currently missing and required.** Without it, integrity cannot be verified on decrypt. |
| `encryptedData` | `Bytes` | (existing) Ciphertext of `{ username, password, website, notes }` JSON, encrypted under the **Vault Key**. |
| `iv` | `Bytes` | (existing) Random per credential. |
| `label` | `String` | (existing) Stays plaintext for listing/search. **Do not put secrets in the label.** |

The `Category` and `UserOTP` models are unaffected by the crypto change. Note: `UserOTP`'s password-reset purpose is **replaced** by the recovery-key flow (see §4.3) and should be removed or repurposed.

---

## 4. Flows

### 4.1 Signup (entirely client-side)

1. Generate random `salt`, `vaultKey` (256-bit), `recoveryKey` (256-bit).
2. `masterKey = Argon2id(masterPassword, salt, kdfParams)`.
3. `authHash = HKDF(masterKey, info="auth")`.
4. `wrappedVaultKey = AES-GCM-encrypt(vaultKey, key=masterKey)`.
5. `wrappedRecoveryKey = AES-GCM-encrypt(vaultKey, key=recoveryKey)`.
6. **POST to server:** `email`, profile, `salt`, `kdfParams`, `authHash`, both wrapped keys (+ IVs/tags). The server hashes `authHash` again with argon2 and stores everything.
7. **Display the Recovery Key once** in a formatted, copyable block. User must confirm they saved it before the account is usable. It is never sent to the server in plaintext and cannot be recovered if lost.

### 4.2 Unlock (login + decrypt)

1. User enters master password. Client fetches `salt` + `kdfParams` (public) for the email.
2. `masterKey = Argon2id(masterPassword, salt)`, `authHash = HKDF(masterKey, "auth")`.
3. NextAuth verifies `authHash` against the stored hash → issues a JWT session.
4. Client downloads `wrappedVaultKey` and unwraps it with `masterKey` → **Vault Key held in memory**.
5. Client downloads credential ciphertext and decrypts locally with the Vault Key.

### 4.3 Recovery (forgot master password)

1. User enters their saved Recovery Key.
2. Client unwraps `wrappedRecoveryKey` → recovers the **Vault Key** (no data lost).
3. User sets a new master password → new `salt`/`masterKey`/`authHash`.
4. Client re-wraps the Vault Key under the new Master Key and sends the new `wrappedVaultKey` + `authHash`.
5. The server never saw any plaintext at any step.

> **No recovery key + forgotten master password = permanent, unrecoverable data loss.** This is an inherent property of zero-knowledge and must be stated plainly in the signup UI.

---

## 5. Server's role after this change

The credentials API becomes a **dumb, secure blob store**:

1. Verify the session (`getServerSession`).
2. Scope every query by `userId` (users only touch their own rows).
3. Store / return opaque ciphertext.

Removed from the server entirely: `deriveKey`, `encryptData`, `decryptData`, and the `masterPassword` field in every request body. There is no plaintext on the server for a breach to leak.

---

## 6. Session & key lifetime

- The **Vault Key lives only in browser memory** for the session.
- On full page reload it is gone; the user re-enters their master password to re-unlock. (Safest default. A future option: cache the derived key in `sessionStorage` for convenience — larger XSS attack surface; revisit deliberately.)
- The existing 15-minute JWT expiry aligns with re-unlock; consider sliding renewal for UX.

---

## 7. Non-crypto hardening (required before real users)

These are not optional for a product holding real passwords:

- **Input validation** — Zod schema on every API route.
- **Rate limiting / brute-force protection** — on login and recovery endpoints.
- **Content-Security-Policy + security headers** — XSS on a password manager is total compromise.
- **Subresource Integrity** + dependency scanning in CI — protect the client bundle (the residual trust boundary).
- **Argon2id / native hashing** server-side for `authHash`; per-user salt everywhere.
- **No secret logging** — audit every `console.*`.
- **Indexes** on `Credential.userId`, `Credential.categoryId`; single Prisma client instance.
- **Third-party security audit** — a hard gate before any public (non-trusted-circle) use.

---

## 8. Implementation order (Stage 1)

1. Schema migration — new `User` / `Credential` fields above.
2. Browser crypto module (`lib/crypto/`) — Argon2id (WASM), AES-GCM wrap/unwrap, HKDF; with **round-trip and tamper tests**.
3. Rewrite signup / unlock / recovery flows; strip `masterPassword` from all API payloads.
4. Slim the credentials API to a blob store.

See `docs/ENCRYPTION_FLOWS.html` for visual diagrams of these flows.
