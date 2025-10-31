import React, { useState } from 'react';

interface GeneratedUrlDisplayProps {
  url: string;
  keywordsQuery: string;
  isGenerating: boolean;
}

export const GeneratedUrlDisplay: React.FC<GeneratedUrlDisplayProps> = ({ url, keywordsQuery, isGenerating }) => {
  const [urlCopied, setUrlCopied] = useState(false);
  const [queryCopied, setQueryCopied] = useState(false);

  const handleCopy = (text: string, type: 'url' | 'query') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } else {
      setQueryCopied(true);
      setTimeout(() => setQueryCopied(false), 2000);
    }
  };
  
  const hasContent = !!url;
  const hasQueryContent = !!keywordsQuery && !isGenerating;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Your Custom URL</h2>
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 min-h-[42px]">
          {hasContent ? (
            <p className="flex-1 text-sm text-brand-primary dark:text-indigo-400 font-mono truncate">{url}</p>
          ) : (
             <p className="text-sm text-gray-500 dark:text-gray-400">{isGenerating ? 'Generating URL...' : 'Your generated URL will appear here.'}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Advanced Search Query</h3>
        <div className="relative">
          <pre className="bg-gray-900 text-green-300 p-3 pr-24 rounded-md border border-gray-700 text-xs overflow-x-auto min-h-[6rem] flex items-center justify-center">
            {isGenerating ? (
              <div className="flex items-center text-gray-400 animate-pulse">
                  <svg className="animate-spin mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating query...
              </div>
            ) : keywordsQuery ? (
              <code className="whitespace-pre-wrap break-words w-full">
                {keywordsQuery}
              </code>
            ) : (
              <div className="w-full text-center text-gray-500">
                Click "Generate URL & Query" above to see the advanced query.
              </div>
            ) }
          </pre>
          {hasQueryContent && (
            <button 
              onClick={() => handleCopy(keywordsQuery, 'query')} 
              aria-label="Copy advanced query"
              className="absolute top-2 right-2 px-3 py-1 text-xs font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors"
            >
              {queryCopied ? 'Copied!' : 'Copy Query'}
            </button>
          )}
        </div>
      </div>

      <div className="pt-2 flex flex-wrap gap-3">
        <button 
          onClick={() => handleCopy(url, 'url')}
          disabled={!hasContent}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {urlCopied ? 'Copied!' : 'Copy URL'}
        </button>
        <a 
          href={hasContent ? url : '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={(e) => !hasContent && e.preventDefault()}
          className={`flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors ${!hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Open in LinkedIn
        </a>
      </div>
    </div>
  );
};