import { GoogleGenAI, Type } from "@google/genai";
import { SearchParameters } from '../types';
import { JOB_TYPES, EXPERIENCE_LEVELS, TIME_POSTED, WORKPLACE_TYPES, SORT_OPTIONS, COMPANY_TYPES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const generateParamsSchema = {
  type: Type.OBJECT,
  properties: {
    keywords: {
      type: Type.STRING,
      description: 'A comma-separated string of relevant keywords for the job title and skills. Example: "Software Engineer, Python, React, Cloud"',
    },
    excludeKeywords: {
      type: Type.STRING,
      description: 'A comma-separated string of keywords to exclude from the search. Example: "Senior, Manager, Lead"',
    },
    location: {
      type: Type.STRING,
      description: 'The geographical location for the job search. e.g. "California, United States"',
    },
    distance: {
      type: Type.STRING,
      description: `The search radius in miles from the location. Available options: 10, 25, 50, 100. Default to empty string for 'Any Distance'.`,
    },
    jobTypes: {
      type: Type.ARRAY,
      description: `An array of job type codes. Available options: ${Object.values(JOB_TYPES).join(', ')}.`,
      items: { type: Type.STRING },
    },
    experienceLevels: {
      type: Type.ARRAY,
      description: `An array of experience level codes. Map user intent (e.g., 'senior', '5 years') to the closest codes. Available options: ${Object.values(EXPERIENCE_LEVELS).join(', ')}.`,
      items: { type: Type.STRING },
    },
    timePosted: {
      type: Type.STRING,
      description: `A single time posted code. Available options: ${Object.values(TIME_POSTED).join(', ')}. Default to 'Anytime' if not specified.`,
    },
    workplaceTypes: {
      type: Type.ARRAY,
      description: `An array of workplace type codes. Available options: ${Object.values(WORKPLACE_TYPES).join(', ')}.`,
      items: { type: Type.STRING },
    },
    companyTypes: {
      type: Type.ARRAY,
      description: `An array of company type keywords based on user's preference. Available options: ${Object.values(COMPANY_TYPES).join(', ')}.`,
      items: { type: Type.STRING },
    },
    sortBy: {
      type: Type.STRING,
      description: `A single sort by code. Available options: ${Object.values(SORT_OPTIONS).join(', ')}. Default to 'Most Recent' (R) if not specified.`,
    },
  },
  required: ['keywords', 'excludeKeywords', 'location', 'distance', 'jobTypes', 'experienceLevels', 'timePosted', 'workplaceTypes', 'companyTypes', 'sortBy'],
};

export async function generateSearchParameters(prompt: string): Promise<SearchParameters> {
  const systemInstruction = `You are an expert LinkedIn Job Search assistant. Your task is to convert a user's natural language description of their ideal job into a set of precise LinkedIn search parameters.

  **Rules:**
  - Fill in all parameters based on the user's prompt.
  - If the user specifies a search radius (e.g., "within 25 miles"), set the 'distance' parameter. Otherwise, default to an empty string.
  - For 'keywords' and 'excludeKeywords', provide simple, comma-separated lists of terms. Do NOT use boolean logic here.
  - Map user intent (e.g., 'senior', '5 years') to the closest 'experienceLevels' code.
  - Map time references (e.g., "posted yesterday") to the correct 'timePosted' code.
  - If the user mentions company types like "startup", "unicorn", or "non-profit", populate the 'companyTypes' array with the corresponding keywords: "startup", "unicorn", "public company", "non-profit".
  - Default 'sortBy' to 'R' (Most Recent) unless relevance is specified.

  Return ONLY a valid JSON object matching the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: generateParamsSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedParams: SearchParameters = JSON.parse(jsonString);
    
    if (!parsedParams.keywords || !Array.isArray(parsedParams.jobTypes)) {
      throw new Error("Invalid JSON structure received from API");
    }
    
    return parsedParams;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not process the prompt with the AI model.");
  }
}

export async function generateBooleanQuery(params: SearchParameters): Promise<string> {
  const systemInstruction = `You are an expert LinkedIn Job Search query writer. Your task is to convert a JSON object of search parameters into a single, powerful, and accurate boolean search string for the LinkedIn 'keywords' field.

    **Rules for creating the boolean query:**
    1.  **Use Boolean Logic:** Construct a single string using parentheses \`()\`, \`OR\`, \`AND\`, and \`NOT\`.
    2.  **Analyze Keywords:** Take the comma-separated \`keywords\` string and create \`OR\` groups for synonyms or related skills. Use quotes for multi-word phrases. Combine different concepts with \`AND\`.
    3.  **Analyze Exclusions:** Take the comma-separated \`excludeKeywords\` string and add each term to the query prefixed with \`NOT\`.
    4.  **Incorporate Context:** Use other parameters like 'experienceLevels' to refine the query. For example, if experience is junior/entry-level, you might add terms like \`(junior OR "entry level" OR graduate)\` and explicitly add \`NOT (senior OR lead OR principal)\`. If experience is senior, do the opposite.
    5.  **Filter by Company Type:** If the \`companyTypes\` array is not empty, append an \`AND\` condition to the query. For example, if it contains ["startup", "unicorn"], add \`AND (startup OR unicorn)\`.
    6.  **Be Comprehensive:** Think of related terms and technologies to create a thorough search query.
    
    Return ONLY the final boolean search string, with no other text or explanation.`;

    const prompt = `Generate a boolean query for the following search parameters: ${JSON.stringify(params, null, 2)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for boolean query generation:", error);
        throw new Error("Could not generate boolean query with the AI model.");
    }
}


export async function generateKeywords(prompt: string, currentParams: SearchParameters): Promise<string> {
  const context = `
    Current search context:
    - Keywords: ${currentParams.keywords}
    - Exclude Keywords: ${currentParams.excludeKeywords}
    - Location: ${currentParams.location}
    - Distance: ${currentParams.distance ? `Within ${currentParams.distance} miles` : 'Any'}
    - Job Types: ${Object.entries(JOB_TYPES).filter(([, value]) => currentParams.jobTypes.includes(value)).map(([key]) => key).join(', ') || 'Any'}
    - Experience Levels: ${Object.entries(EXPERIENCE_LEVELS).filter(([, value]) => currentParams.experienceLevels.includes(value)).map(([key]) => key).join(', ') || 'Any'}
    - Workplace: ${Object.entries(WORKPLACE_TYPES).filter(([, value]) => currentParams.workplaceTypes.includes(value)).map(([key]) => key).join(', ') || 'Any'}
    - Company Types: ${Object.entries(COMPANY_TYPES).filter(([, value]) => currentParams.companyTypes.includes(value)).map(([key]) => key).join(', ') || 'Any'}
  `;

  const systemInstruction = `You are an expert LinkedIn Job Search keyword assistant.
  The user already has a defined job search, summarized below. Your task is to suggest *additional* relevant keywords based on their new request, considering the existing context.

  ${context}

  - Analyze the user's new request.
  - Generate a concise, comma-separated string of new keywords that complement the existing ones.
  - **Do not repeat keywords** that are already in the "Keywords" list above.
  - Focus on technologies, related skills, synonyms, or different job titles.
  - Return ONLY the new keywords. Do not add any extra explanation or formatting.

  Example user request: "add some cloud technologies"
  Example output: "AWS, Azure, GCP, Docker, Kubernetes"

  Example user request: "more soft skills for this role"
  Example output: "Leadership, Communication, Teamwork, Collaboration, Problem-solving"`;

  try {
    const fullPrompt = `User's new request: "${prompt}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });
    return response.text.trim();
  } catch (error)
 {
    console.error("Error calling Gemini API for keyword generation:", error);
    throw new Error("Could not generate keywords with the AI model.");
  }
}
