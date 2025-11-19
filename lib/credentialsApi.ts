interface Credential {
  id: string;
  label: string;
  username: string;
  password: string;
  website: string;
  notes?: string;
  category: { name: string; id: number } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCredentialData {
  label: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  categoryId?: number;
  masterPassword: string;
}

interface UpdateCredentialData extends Partial<CreateCredentialData> {
  id: string;
}

class CredentialsAPI {
  private baseUrl = '/api/credentials';

  async getCredentials(): Promise<Credential[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch credentials');
    }
    const data = await response.json();
    return data.credentials.map((cred: any) => ({
      ...cred,
      createdAt: new Date(cred.createdAt),
      updatedAt: new Date(cred.updatedAt),
    }));
  }

  async getCredential(id: string): Promise<Credential> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch credential');
    }
    const data = await response.json();
    return {
      ...data.credential,
      createdAt: new Date(data.credential.createdAt),
      updatedAt: new Date(data.credential.updatedAt),
    };
  }

  async createCredential(credentialData: CreateCredentialData): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentialData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create credential');
    }
  }

  async updateCredential(credentialData: UpdateCredentialData): Promise<void> {
    const { id, ...data } = credentialData;
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update credential');
    }
  }

  async deleteCredential(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete credential');
    }
  }
}

export const credentialsAPI = new CredentialsAPI();
export type { Credential, CreateCredentialData, UpdateCredentialData };
