import React, { useState, useCallback } from 'react';
import { generateSearchParameters, generateKeywords, generateBooleanQuery } from './services/geminiService';
import { SearchParameters } from './types';
import { JOB_TYPES, EXPERIENCE_LEVELS, TIME_POSTED_SLIDER_OPTIONS, WORKPLACE_TYPES, SORT_OPTIONS, DEFAULT_SEARCH_PARAMS, DISTANCE_SLIDER_OPTIONS, COMPANY_TYPES } from './constants';
import { ParameterControls } from './components/ParameterControls';
import { GeneratedUrlDisplay } from './components/GeneratedUrlDisplay';
import { AIPrompt } from './components/AIPrompt';
import { KeywordSuggester } from './components/KeywordSuggester';

const Step: React.FC<{ number: string; children: React.ReactNode; className?: string }> = ({ number, children, className = '' }) => {
  const isStep2 = number === '2';
  return (
    <div className={`flex ${isStep2 ? 'items-center' : 'items-start'} gap-4 md:gap-6 mb-12 ${className}`}>
      <div className={`flex-shrink-0 ${!isStep2 ? 'pt-2' : ''}`}>
        <div className="flex items-center justify-center w-12 h-12 text-2xl font-bold text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 rounded-full">
          {number}
        </div>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParameters>(DEFAULT_SEARCH_PARAMS);
  const [prompt, setPrompt] = useState<string>('');
  const [advancedQuery, setAdvancedQuery] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGeneratingQuery, setIsGeneratingQuery] = useState(false);
  const [isAiFilling, setIsAiFilling] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggesterOpen, setIsSuggesterOpen] = useState(false);
  const [isStep0Open, setIsStep0Open] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = useCallback((params: SearchParameters, queryStr: string): string => {
    const url = new URL('https://www.linkedin.com/jobs/search/');
    const query = url.searchParams;

    if (queryStr) query.set('keywords', queryStr.trim());
    if (params.location) query.set('location', params.location);
    if (params.location && params.distance) query.set('distance', params.distance);
    if (params.jobTypes.length > 0) query.set('f_JT', params.jobTypes.join(','));
    if (params.experienceLevels.length > 0) query.set('f_E', params.experienceLevels.join(','));
    if (params.timePosted) query.set('f_TPR', params.timePosted);
    if (params.workplaceTypes.length > 0) query.set('f_WT', params.workplaceTypes.join(','));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    
    return url.toString();
  }, []);

  const handleAiFill = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAiFilling(true);
    setError(null);
    try {
      const params = await generateSearchParameters(promptText);
      setSearchParams(params);
      setIsStep0Open(false); // Collapse after filling
    } catch (e) {
      console.error(e);
      setError('Failed to generate parameters from your prompt. Please try again.');
    } finally {
      setIsAiFilling(false);
    }
  };

  const handleGenerateUrlAndQuery = async () => {
    setIsGeneratingQuery(true);
    setError(null);
    try {
      const query = await generateBooleanQuery(searchParams);
      setAdvancedQuery(query);
      const url = buildUrl(searchParams, query);
      setGeneratedUrl(url);
    } catch (e) {
      console.error(e);
      setError("Failed to generate URL and query. Please try again.");
    } finally {
      setIsGeneratingQuery(false);
    }
  };
  
  const handleSuggestKeywords = async (promptText: string) => {
    setIsSuggesting(true);
    setError(null);
    try {
      const suggestedKeywords = await generateKeywords(promptText, searchParams);
      if (suggestedKeywords) {
        setSearchParams(prev => ({
          ...prev,
          keywords: prev.keywords ? `${prev.keywords}, ${suggestedKeywords}`.trim() : suggestedKeywords,
        }));
      }
      setIsSuggesterOpen(false);
    } catch (e) {
      console.error(e);
      setError('Failed to suggest keywords. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-brand-primary" fill="currentColor" viewBox="0 0 40 40"><path d="M34.98,2.99H5.02C3.9,2.99,3,3.9,3,5.02v29.96C3,36.1,3.9,37,5.02,37h29.96c1.12,0,2.02-0.9,2.02-2.02V5.02 C37,3.9,36.1,2.99,34.98,2.99z M13.19,31.02h-4.23V15.34h4.23V31.02z M11.07,13.44c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5S12.45,13.44,11.07,13.44z M29.89,31.02h-4.23v-7.5c0-1.79-0.03-4.08-2.49-4.08c-2.49,0-2.87,1.94-2.87,3.95 v7.63h-4.23V15.34h4.06v1.86h0.06c0.56-1.07,1.95-2.19,3.99-2.19c4.27,0,5.06,2.81,5.06,6.46V31.02z"></path></svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">LinkedIn Job URL Builder</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          
          <Step number="0">
            <div className={`aurora-glow rounded-lg ${isStep0Open ? 'open' : ''}`}>
              <div className="relative z-10 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out ring-1 ring-brand-primary/20">
                <button
                  type="button"
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => setIsStep0Open(!isStep0Open)}
                  aria-expanded={isStep0Open}
                  aria-controls="step-0-content"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Describe Your Dream Job <span className="text-base font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                        {isStep0Open ? 'Use natural language. The AI will extract the parameters for you.' : 'Click to expand and let AI fill the parameters for you.'}
                    </p>
                  </div>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 flex-shrink-0 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isStep0Open ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id="step-0-content"
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${isStep0Open ? 'max-h-[500px]' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <AIPrompt
                              prompt={prompt}
                              setPrompt={setPrompt}
                              onAiFill={handleAiFill}
                              isFilling={isAiFilling}
                          />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </Step>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-8 ml-16" role="alert">{error}</div>}

          <Step number="1">
            <ParameterControls
              params={searchParams}
              setParams={setSearchParams}
              jobTypes={JOB_TYPES}
              experienceLevels={EXPERIENCE_LEVELS}
              timePostedSliderOptions={TIME_POSTED_SLIDER_OPTIONS}
              distanceSliderOptions={DISTANCE_SLIDER_OPTIONS}
              workplaceTypes={WORKPLACE_TYPES}
              companyTypes={COMPANY_TYPES}
              sortOptions={SORT_OPTIONS}
              onSuggestClick={() => setIsSuggesterOpen(true)}
            />
          </Step>

          <Step number="2">
            <button
              type="button"
              onClick={handleGenerateUrlAndQuery}
              disabled={isGeneratingQuery}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              {isGeneratingQuery ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate URL & Query'
              )}
            </button>
          </Step>

          <Step number="3" className="mb-0">
            <GeneratedUrlDisplay url={generatedUrl} keywordsQuery={advancedQuery} isGenerating={isGeneratingQuery} />
          </Step>
        </div>
      </main>
      
      <KeywordSuggester
        isOpen={isSuggesterOpen}
        onClose={() => setIsSuggesterOpen(false)}
        onSuggest={handleSuggestKeywords}
        isLoading={isSuggesting}
      />
      
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        <p>Crafted to streamline your job search.</p>
      </footer>
    </div>
  );
};

export default App;