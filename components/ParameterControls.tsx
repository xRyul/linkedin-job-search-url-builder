import React from 'react';
import { SearchParameters } from '../types';

interface ParameterControlsProps {
  params: SearchParameters;
  setParams: React.Dispatch<React.SetStateAction<SearchParameters>>;
  jobTypes: Record<string, string>;
  experienceLevels: Record<string, string>;
  timePostedSliderOptions: { value: string; label: string }[];
  distanceSliderOptions: { value: string; label: string }[];
  workplaceTypes: Record<string, string>;
  companyTypes: Record<string, string>;
  sortOptions: Record<string, string>;
  onSuggestClick: () => void;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
    {children}
  </div>
);

const TextAreaInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; className?: string }> = ({ label, value, onChange, className = '' }) => (
  <textarea
    aria-label={label}
    placeholder={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full h-24 p-3 font-mono text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 resize-y ${className}`}
  />
);

const TextInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <input
    type="text"
    aria-label={label}
    placeholder={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200"
  />
);

const CheckboxGroup: React.FC<{ options: Record<string, string>; selected: string[]; onChange: (newSelection: string[]) => void }> = ({ options, selected, onChange }) => (
    <div className="grid grid-cols-1 gap-y-2 pt-1">
      {Object.entries(options).map(([label, value]) => (
        <label key={value} className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => {
              const newSelection = selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value];
              onChange(newSelection);
            }}
            className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
        </label>
      ))}
    </div>
  );

const SelectInput: React.FC<{ options: Record<string, string>; value: string; onChange: (value: string) => void }> = ({ options, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200"
  >
    {Object.entries(options).map(([label, val]) => (
      <option key={val} value={val}>{label}</option>
    ))}
  </select>
);

const SliderInput: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ options, value, onChange, disabled = false }) => {
  const currentIndex = Math.max(0, options.findIndex(opt => opt.value === value));
  const percentage = options.length > 1 ? (currentIndex / (options.length - 1)) * 100 : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newIndex = parseInt(e.target.value, 10);
      onChange(options[newIndex].value);
  };

  return (
       <div className="pt-2">
            <div className="relative h-5 mb-4"> {/* Increased margin-bottom for labels */}
                {/* Custom Track background */}
                <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2" />
                
                {/* Filled Track */}
                <div
                    className={`absolute top-1/2 left-0 h-1.5 rounded-full transform -translate-y-1/2 ${disabled ? 'bg-gray-400' : 'bg-brand-primary'}`}
                    style={{ width: `${percentage}%` }}
                />

                {/* Ticks */}
                <div className="absolute w-full flex justify-between items-center top-1/2 transform -translate-y-1/2">
                    {options.map((_, index) => (
                        <div
                            key={index}
                            className={`h-3 w-1 rounded-full ${currentIndex >= index ? (disabled ? 'bg-gray-400' : 'bg-brand-primary') : (disabled ? 'bg-gray-300' : 'bg-gray-300 dark:bg-gray-600')}`}
                        />
                    ))}
                </div>
                
                {/* Real Slider - invisible but functional */}
                <input
                    type="range"
                    min="0"
                    max={options.length - 1}
                    value={currentIndex}
                    onChange={handleSliderChange}
                    className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={disabled}
                    aria-label="slider input"
                />
            </div>
            
            {/* Faint labels for each stop */}
            <div className="flex justify-between -mx-2">
                {options.map((opt, index) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => !disabled && onChange(opt.value)}
                        disabled={disabled}
                        className={`w-full px-1 text-center text-[11px] transition-colors duration-200 disabled:cursor-not-allowed ${
                            currentIndex === index
                                ? `font-bold ${disabled ? 'text-gray-500' : 'text-brand-primary dark:text-indigo-400'}`
                                : `text-gray-400 dark:text-gray-500 ${!disabled && 'hover:text-gray-600 dark:hover:text-gray-300'}`
                        }`}
                        title={opt.label}
                    >
                        {/* Use a shortened version of the label */}
                        {opt.label.replace('Past ', '').replace('Within ', '').replace(' miles', 'mi')}
                    </button>
                ))}
            </div>
      </div>
  );
};


export const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  setParams,
  jobTypes,
  experienceLevels,
  timePostedSliderOptions,
  distanceSliderOptions,
  workplaceTypes,
  companyTypes,
  sortOptions,
  onSuggestClick,
}) => {
  const handleParamChange = <K extends keyof SearchParameters,>(
    key: K,
    value: SearchParameters[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const isDistanceDisabled = !params.location;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Parameters</h2>
      
      <ControlSection title="Keywords (comma-separated)">
         <div className="relative">
          <TextAreaInput
            label="Keywords"
            value={params.keywords}
            onChange={(v) => handleParamChange('keywords', v)}
            className="pr-12"
          />
          <button
            type="button"
            onClick={onSuggestClick}
            aria-label="Suggest keywords with AI"
            title="Suggest keywords with AI"
            className="absolute top-2 right-2 p-2 bg-brand-primary/10 hover:bg-brand-primary/20 dark:bg-brand-primary/20 dark:hover:bg-brand-primary/30 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        </div>
      </ControlSection>
      
      <ControlSection title="Exclude Keywords (comma-separated)">
        <TextAreaInput label="Exclude Keywords" value={params.excludeKeywords} onChange={(v) => handleParamChange('excludeKeywords', v)} />
      </ControlSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Column 1 */}
        <div className="space-y-6">
          <ControlSection title="Location">
            <TextInput label="Location" value={params.location} onChange={(v) => handleParamChange('location', v)} />
          </ControlSection>
          <ControlSection title="Distance Radius">
              <SliderInput
                options={distanceSliderOptions}
                value={params.distance}
                onChange={(v) => handleParamChange('distance', v)}
                disabled={isDistanceDisabled}
              />
              {isDistanceDisabled && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">Enter a location to set a radius.</p>}
          </ControlSection>
        </div>

        {/* Checkbox filters section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            <ControlSection title="Job Type">
              <CheckboxGroup options={jobTypes} selected={params.jobTypes} onChange={(v) => handleParamChange('jobTypes', v)} />
            </ControlSection>
            <ControlSection title="Experience Level">
              <CheckboxGroup options={experienceLevels} selected={params.experienceLevels} onChange={(v) => handleParamChange('experienceLevels', v)} />
            </ControlSection>
            <ControlSection title="Workplace Type">
              <CheckboxGroup options={workplaceTypes} selected={params.workplaceTypes} onChange={(v) => handleParamChange('workplaceTypes', v)} />
            </ControlSection>
            <ControlSection title="Company Type">
              <CheckboxGroup
                options={companyTypes}
                selected={params.companyTypes}
                onChange={(v) => handleParamChange('companyTypes', v)}
              />
            </ControlSection>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ControlSection title="Date Posted">
          <SliderInput
            options={timePostedSliderOptions}
            value={params.timePosted}
            onChange={(v) => handleParamChange('timePosted', v)}
          />
        </ControlSection>
        <ControlSection title="Sort By">
          <SelectInput options={sortOptions} value={params.sortBy} onChange={(v) => handleParamChange('sortBy', v)} />
        </ControlSection>
      </div>
    </div>
  );
};