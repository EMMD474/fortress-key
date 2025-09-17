export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.statusText}`);
    return res.json();
  },

  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include', // <-- add this line
    });
    if (!res.ok) throw new Error(`POST ${url} failed: ${res.statusText}`);
    return res.json();
  },

  async put<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include', // <-- add this line
    });
    if (!res.ok) throw new Error(`PUT ${url} failed: ${res.statusText}`);
    return res.json();
  },

  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.statusText}`);
    return res.json();
  }
};