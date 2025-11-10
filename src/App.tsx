import { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ChatInterface from './components/ChatInterface';
import SourcesPanel from './components/SourcesPanel';
import { api } from './services/api';
import { Message, Source } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSources, setCurrentSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [documentChunks, setDocumentChunks] = useState(0);
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const status = await api.getStatus();
      setDocumentChunks(status.document_chunks);
      setShowUpload(status.document_chunks === 0);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      const response = await api.uploadPDFs(files);
      setDocumentChunks(response.chunk_count);
      setShowUpload(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.query(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentSources(response.sources);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to get answer',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all documents? This cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      await api.clearDocuments();
      setMessages([]);
      setCurrentSources([]);
      setDocumentChunks(0);
      setShowUpload(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to clear documents');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        documentChunks={documentChunks}
        onClear={handleClear}
        isClearing={isClearing}
      />

      <div className="flex-1 max-w-screen-2xl w-full mx-auto flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
          {showUpload ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-2xl">
                <UploadZone onUpload={handleUpload} />
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="w-96 bg-white rounded-2xl shadow-lg overflow-hidden">
          <SourcesPanel sources={currentSources} />
        </div>
      </div>
    </div>
  );
}

export default App;
