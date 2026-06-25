import { encryptCredential, decryptCredential } from "@/lib/crypto/vault";
import { bundleToWire, wireToBundle, type WireCipherBundle } from "@/lib/crypto/wire";
import { getVaultKey } from "@/lib/crypto/vaultSession";

// Client-side credentials API. Encryption and decryption happen HERE, in the
// browser, under the in-memory Vault Key. The server only ever sees opaque
// ciphertext (docs/ENCRYPTION_DESIGN.md §5). The label stays plaintext for
// listing/search — never put secrets in it.

interface Credential {
  id: string;
  label: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: { name: string; id: number } | null;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCredentialData {
  label: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  categoryId?: number | null;
}

interface UpdateCredentialData extends Partial<CreateCredentialData> {
  id: string;
}

// Raw blob shape returned by the API (ciphertext + plaintext metadata).
interface CredentialBlob extends WireCipherBundle {
  id: string;
  label: string;
  category: { name: string; id: number } | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

function requireVaultKey(): Uint8Array {
  const key = getVaultKey();
  if (!key) {
    throw new Error("Vault is locked. Unlock with your master password first.");
  }
  return key;
}

class CredentialsAPI {
  private baseUrl = "/api/credentials";

  /** Decrypt a server blob into a plaintext credential using the Vault Key. */
  private async decryptBlob(blob: CredentialBlob): Promise<Credential> {
    const fields = await decryptCredential(
      wireToBundle({ ciphertext: blob.ciphertext, iv: blob.iv, tag: blob.tag }),
      requireVaultKey(),
    );
    return {
      id: blob.id,
      label: blob.label,
      username: fields.username,
      password: fields.password,
      website: fields.website,
      notes: fields.notes,
      category: blob.category,
      categoryId: blob.categoryId,
      createdAt: new Date(blob.createdAt),
      updatedAt: new Date(blob.updatedAt),
    };
  }

  /** Encrypt plaintext fields into the wire bundle the API stores. */
  private async encryptFields(data: CreateCredentialData): Promise<WireCipherBundle> {
    const bundle = await encryptCredential(
      {
        username: data.username ?? "",
        password: data.password ?? "",
        website: data.website ?? "",
        notes: data.notes ?? "",
      },
      requireVaultKey(),
    );
    return bundleToWire(bundle);
  }

  async getCredentials(): Promise<Credential[]> {
    const response = await fetch(this.baseUrl, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch credentials");
    const data = (await response.json()) as { credentials: CredentialBlob[] };
    return Promise.all(data.credentials.map((blob) => this.decryptBlob(blob)));
  }

  async getCredential(id: string): Promise<Credential> {
    const response = await fetch(`${this.baseUrl}/${id}`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch credential");
    const data = (await response.json()) as { credential: CredentialBlob };
    return this.decryptBlob(data.credential);
  }

  async createCredential(data: CreateCredentialData): Promise<void> {
    const wire = await this.encryptFields(data);
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ label: data.label, categoryId: data.categoryId ?? null, ...wire }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to create credential");
    }
  }

  async updateCredential(data: UpdateCredentialData): Promise<void> {
    const { id, label, categoryId, ...fields } = data;
    const wire = await this.encryptFields({
      label: label ?? "",
      username: fields.username ?? "",
      password: fields.password ?? "",
      website: fields.website,
      notes: fields.notes,
    });
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ label, categoryId, ...wire }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to update credential");
    }
  }

  async deleteCredential(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Failed to delete credential");
    }
  }
}

export const credentialsAPI = new CredentialsAPI();
export type { Credential, CreateCredentialData, UpdateCredentialData };
