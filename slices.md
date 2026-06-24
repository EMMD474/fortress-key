# Fortress Key — Project Slices

A slice is a vertical, shippable chunk of the path from "server-side toy vault"
to "publicly launchable zero-knowledge password manager." Slices are ordered by
dependency; each lists its scope and status.

**Status legend**
- ✅ **Done — awaiting testing & review** — code complete and pushed; not yet QA'd, reviewed, or merged.
- 🟡 **In progress**
- ⬜ **Not started**

Source of truth for the crypto design: [`docs/ENCRYPTION_DESIGN.md`](docs/ENCRYPTION_DESIGN.md).

---

## Slice 1 — Zero-knowledge crypto core ✅ Done — awaiting testing & review

The foundation: all encryption/decryption moved into the browser; the server
became an opaque blob store. This is "Stage 1" from `ENCRYPTION_DESIGN.md` §8.

| Sub-task | Issue | PR |
|---|---|---|
| 1.1 Schema migration (key-hierarchy fields, `Credential.tag`, indexes) | #1 | #5 |
| 1.2 Browser crypto module (`lib/crypto/`: Argon2id, AES-GCM, HKDF, tests) | #2 | #6 |
| 1.3 Client-side signup / unlock / recovery flows; strip `masterPassword` | #3 | #7 |
| 1.4 Slim credentials API to an opaque blob store (+ Zod) | #4 | #8 |

**Outstanding before this slice can be marked truly Done:**
- [ ] Apply the migration against a real Postgres (`prisma migrate reset` + `pnpm seed`) — no DB was available during implementation.
- [ ] Manual QA of the full signup → save recovery key → login → recover → change-password loop.
- [ ] Review + merge PRs #5 → #6 → #7 → #8 (stacked; merge in order or fold into `emmd` together).
- [ ] 22 unit tests pass (`pnpm test`); broaden coverage in Slice 5.

---

## Slice 2 — Vault UX wiring ⬜ Not started

Connect the product UI to the new zero-knowledge core (the vault page still
renders mock data; nothing calls `credentialsAPI` yet).

- [ ] Wire `app/(main)/vault/page.tsx` to `credentialsAPI` (replace `mockCredentials`).
- [ ] Wire `components/AddCredentials.tsx` create/edit to the encrypting client API.
- [ ] **Unlock-on-reload gate**: the Vault Key lives only in memory (§6) — re-prompt for the master password after a refresh before showing the vault.
- [ ] Lock the vault on logout and on idle timeout; call `clearVaultKey()`.
- [ ] Import/Export modal: encrypt on import, decrypt on export — all client-side.
- [ ] Fix the pre-existing `AddCredentials.tsx` `onSubmit`/`onClick` type bug.

---

## Slice 3 — Account & key management ⬜ Not started

Full lifecycle for identity and keys (server routes already accept the new
contracts; the UI and edge cases remain).

- [ ] Change-master-password UI: re-wrap the Vault Key, send `passwordChange` to `update-profile` (route already supports it).
- [ ] Recovery-key rotation / re-display flow.
- [ ] Profile update UI against the new `update-profile` contract.
- [ ] Account deletion (purge the user's credential blobs and wrapped keys).
- [ ] Remove the now-unused `UserOTP` model + migration (superseded by recovery-key flow).

---

## Slice 4 — Non-crypto hardening ⬜ Not started

Required before real users (`ENCRYPTION_DESIGN.md` §7).

- [ ] Rate limiting / brute-force protection on `login`, `recovery`, and `salt` endpoints.
- [ ] Zod validation on the remaining routes (categories, password-gen, auth/profile).
- [ ] Content-Security-Policy + security headers (XSS on a password manager = total compromise).
- [ ] No-secret-logging audit (sweep every `console.*`).
- [ ] Subresource Integrity + dependency scanning in CI (protect the client bundle — the residual trust boundary).
- [ ] Confirm DB indexes; ensure a single Prisma client everywhere (credentials route fixed; sweep the rest).
- [ ] Remove the now-unused server `ENCRYPTION_KEY` env var.

---

## Slice 5 — Testing & QA ⬜ Not started

- [ ] Expand unit tests: server routes, anti-enumeration decoys, recovery edge cases.
- [ ] End-to-end tests (Playwright): signup → recovery key → login → add/read credential → recover → change password.
- [ ] CI gate on PRs: typecheck + lint + `pnpm test`.
- [ ] Clear out pre-existing type errors (`test/home.tsx`, `AddCredentials.tsx`).

---

## Slice 6 — Ops & deployment ⬜ Not started

From `REMEMBER.md` and launch needs.

- [ ] Hosting (evaluate Linode), domain name, environment/secrets management.
- [ ] Mail server / transactional email (Resend or SMTP) for welcome + notices (not for recovery).
- [ ] Managed Postgres with backups; migration apply + rollback runbook.
- [ ] Observability: error tracking, uptime, structured logs (no secrets).
- [ ] Resolve the auto-generated `pnpm-workspace.yaml` (`allowBuilds: false` blocks Prisma/sharp build scripts).

---

## Slice 7 — Third-party security audit ⬜ Not started — hard gate

A hard gate before any public (non-trusted-circle) use (`ENCRYPTION_DESIGN.md` §2, §7).

- [ ] Engage an external auditor for the crypto design and the client bundle.
- [ ] Reproducible builds.
- [ ] Remediate findings; re-audit if material.

---

## Slice 8 — Public launch ⬜ Not started

- [ ] Docs: supersede `VAULT_README.md` with `ENCRYPTION_DESIGN.md`; write a user-facing security explainer.
- [ ] Onboarding UX + landing page.
- [ ] Honest in-product threat-model disclosures (device compromise, supply chain, and "no recovery key + forgotten password = permanent data loss").
- [ ] Beta (trusted circle) → general availability.
