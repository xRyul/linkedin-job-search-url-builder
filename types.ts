export interface SearchParameters {
  keywords: string;
  excludeKeywords: string;
  location: string;
  distance: string;
  jobTypes: string[];
  experienceLevels: string[];
  timePosted: string;
  workplaceTypes: string[];
  sortBy: string;
  companyTypes: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  url: string;
  params: SearchParameters;
}
