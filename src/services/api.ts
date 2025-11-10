const API_BASE_URL = 'http://localhost:8000';

export const api = {
  async uploadPDFs(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  },

  async query(question: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Query failed');
    }

    return response.json();
  },

  async clearDocuments(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clear`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Clear failed');
    }

    return response.json();
  },

  async getStatus(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/status`);

    if (!response.ok) {
      throw new Error('Failed to get status');
    }

    return response.json();
  },
};
