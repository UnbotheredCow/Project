import { FileText, Trash2 } from 'lucide-react';

interface HeaderProps {
  documentChunks: number;
  onClear: () => void;
  isClearing: boolean;
}

export default function Header({ documentChunks, onClear, isClearing }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DocSearch AI</h1>
            <p className="text-sm text-gray-500">Intelligent Document Q&A</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {documentChunks > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                {documentChunks} chunks indexed
              </span>
            </div>
          )}

          {documentChunks > 0 && (
            <button
              onClick={onClear}
              disabled={isClearing}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Clear All</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
