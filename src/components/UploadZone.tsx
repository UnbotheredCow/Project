import { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        file => file.type === 'application/pdf'
      );

      if (files.length === 0) {
        setUploadStatus({ type: 'error', message: 'Please upload PDF files only' });
        setTimeout(() => setUploadStatus({ type: null, message: '' }), 3000);
        return;
      }

      await handleUpload(files);
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await handleUpload(files);
      }
    },
    [onUpload]
  );

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      await onUpload(files);
      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`,
      });
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
          ${isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-blue-100' : 'bg-white'}`}>
            <Upload className={`w-12 h-12 transition-colors ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {isUploading ? 'Uploading...' : 'Drop PDF files here'}
            </h3>
            <p className="text-sm text-gray-500">
              or click to browse from your computer
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileText className="w-4 h-4" />
            <span>Supports multiple PDF files</span>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-600">Processing documents...</span>
            </div>
          </div>
        )}
      </div>

      {uploadStatus.type && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-3 animate-fadeIn ${
            uploadStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
}
