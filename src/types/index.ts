export interface Source {
  doc: string;
  page: number;
  snippet: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  document_count: number;
  chunk_count: number;
}

export interface StatusResponse {
  document_chunks: number;
  model: string;
  llm: string;
}
