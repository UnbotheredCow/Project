import { FileText, BookOpen } from 'lucide-react';
import { Source } from '../types';

interface SourcesPanelProps {
  sources: Source[];
}

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  if (sources.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            Ask a question to see relevant sources
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {sources.length} found
        </span>
      </div>

      {sources.map((source, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{source.doc}</p>
                <p className="text-xs text-gray-500">Page {source.page}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-green-700">
                {Math.round(source.score * 100)}%
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {source.snippet}
            {source.snippet.length >= 300 && '...'}
          </p>
        </div>
      ))}
    </div>
  );
}
