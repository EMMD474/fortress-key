// Public surface of the browser crypto module.
// All encryption/decryption in Fortress Key happens here, client-side; the
// server only ever stores opaque ciphertext. See docs/ENCRYPTION_DESIGN.md.

export * from './types';
export * from './constants';
export * from './random';
export * from './encoding';
export * from './argon2';
export * from './hkdf';
export * from './aesgcm';
export * from './vault';
export * from './recoveryKey';
export * from './wire';

// Note: `clientAuth` (imports next-auth/react) and `vaultSession` are
// browser-only — import them directly from their modules, not via this barrel,
// so server code can keep importing the isomorphic primitives above.
