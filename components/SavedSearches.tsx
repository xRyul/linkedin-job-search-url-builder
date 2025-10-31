
import React from 'react';
import { SavedSearch } from '../types';

interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoad: (search: SavedSearch) => void;
  onDelete: (id: string) => void;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({ searches, onLoad, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Saved Searches</h2>
      {searches.length === 0 ? (
        <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v1h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2V5z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No saved searches</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a search and save it to see it here.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {searches.map((search) => (
            <li key={search.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-shadow hover:shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-brand-primary dark:text-indigo-400">{search.name}</p>
                    <a href={search.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 dark:text-gray-400 hover:underline truncate block w-48 sm:w-64">
                      {search.url}
                    </a>
                  </div>
                  <button onClick={() => onDelete(search.id)} aria-label="Delete search" className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                  </button>
              </div>
              <div className="mt-3">
                  <button onClick={() => onLoad(search)} className="w-full text-center px-3 py-1.5 text-sm font-medium text-white bg-brand-primary/90 hover:bg-brand-primary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                    Load
                  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};