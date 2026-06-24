// In-memory holder for the unwrapped Vault Key during a browser session.
//
// The Vault Key lives ONLY in JS memory (docs/ENCRYPTION_DESIGN.md §6). It is
// never written to localStorage/sessionStorage/cookies and is gone on a full
// page reload, at which point the user re-enters their master password to
// re-unlock. This module is a deliberate singleton so any component can reach
// the key without prop-drilling.

let vaultKey: Uint8Array | null = null;

/** Store the unwrapped Vault Key after a successful unlock. */
export function setVaultKey(key: Uint8Array): void {
  vaultKey = key;
}

/** Get the Vault Key, or null if the vault is locked (e.g. after a reload). */
export function getVaultKey(): Uint8Array | null {
  return vaultKey;
}

/** True if the vault is currently unlocked in this session. */
export function isVaultUnlocked(): boolean {
  return vaultKey !== null;
}

/**
 * Wipe the Vault Key from memory (logout, lock, or password change cleanup).
 * Best-effort zeroing before dropping the reference.
 */
export function clearVaultKey(): void {
  if (vaultKey) {
    vaultKey.fill(0);
  }
  vaultKey = null;
}
