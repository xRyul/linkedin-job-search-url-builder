import { SearchParameters } from './types';

export const JOB_TYPES = {
  "Full-time": "F",
  "Part-time": "P",
  "Contract": "C",
  "Temporary": "T",
  "Internship": "I",
  "Volunteer": "V",
};

export const EXPERIENCE_LEVELS = {
  "Internship": "1",
  "Entry level": "2",
  "Associate": "3",
  "Mid-Senior level": "4",
  "Director": "5",
  "Executive": "6",
};

export const TIME_POSTED = {
  "Anytime": "",
  "Past 24 hours": "r86400",
  "Past week": "r604800",
  "Past month": "r2592000",
  "Past hour": "r3600",
};

export const TIME_POSTED_SLIDER_OPTIONS = [
  { value: 'r3600', label: 'Past Hour' },
  { value: 'r21600', label: 'Past 6 Hours' },
  { value: 'r43200', label: 'Past 12 Hours' },
  { value: 'r86400', label: 'Past 24 Hours' },
  { value: 'r259200', label: 'Past 3 Days' },
  { value: 'r604800', label: 'Past Week' },
  { value: 'r1209600', label: 'Past 2 Weeks' },
  { value: 'r2592000', label: 'Past Month' },
  { value: '', label: 'Anytime' },
];

export const DISTANCE_SLIDER_OPTIONS = [
  { value: '10', label: 'Within 10 miles' },
  { value: '25', label: 'Within 25 miles' },
  { value: '50', label: 'Within 50 miles' },
  { value: '100', label: 'Within 100 miles' },
  { value: '', label: 'Any Distance' },
];

export const WORKPLACE_TYPES = {
  "On-site": "1",
  "Remote": "2",
  "Hybrid": "3",
};

export const COMPANY_TYPES = {
  "Startup": "startup",
  "Unicorn (>$1B)": "unicorn",
  "Public Company": "public company",
  "Non-profit": "non-profit",
};

export const SORT_OPTIONS = {
  "Most Relevant": "DD",
  "Most Recent": "R",
};

export const DEFAULT_SEARCH_PARAMS: SearchParameters = {
  keywords: '',
  excludeKeywords: '',
  location: '',
  distance: '',
  jobTypes: [],
  experienceLevels: [],
  timePosted: 'r604800', // Default to 'Past Week' as a sensible slider default
  workplaceTypes: [],
  companyTypes: [],
  sortBy: 'R', // Default to 'Most Recent' as requested
};