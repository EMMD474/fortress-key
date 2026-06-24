import { z } from "zod";

// Validation for the credentials blob-store API. The server treats credential
// secrets as opaque ciphertext, so it only validates the *shape* of the wire
// data — base64 blobs, a plaintext label for listing, and an optional category.
// It never sees or validates the decrypted fields (docs/ENCRYPTION_DESIGN.md §5).

const base64 = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9+/]+={0,2}$/, "must be base64");

const cipherBundle = z.object({
  encryptedData: base64,
  iv: base64,
  tag: base64,
});

export const createCredentialSchema = cipherBundle.extend({
  // Label stays plaintext for listing/search — must not contain secrets.
  label: z.string().min(1).max(200),
  categoryId: z.number().int().positive().nullable().optional(),
});

// On update every blob is re-supplied (re-encrypting changes iv/tag/ciphertext
// together); label and category are optional.
export const updateCredentialSchema = cipherBundle.extend({
  label: z.string().min(1).max(200).optional(),
  categoryId: z.number().int().positive().nullable().optional(),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
