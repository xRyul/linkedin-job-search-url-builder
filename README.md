# LinkedIn Job Search URL Builder 🔍

LinkedIn job search URL builder that converts natural language prompts into LinkedIn formated URL with search paramters, keyworads, boolean logic and filters. 

## Features

- Describe your ideal job in plain English
- Automatically generates complex search strings with AND/OR/NOT logic
- Filters: Job type, experience level, location, remote options, company types, and more
- Optionally,  suggests additional relevant keywords based on context
- Generate ready-to-use LinkedIn job search URLs

## 📝 Example Usage

**Input**: "Remote software engineer position with Python and React, 2-5 years experience, posted in the last week"
**Output**: Complete LinkedIn search URL with:
- URL: https://www.linkedin.com/jobs/search/?keywords=%28%28%22software+engineer%22+OR+%22software+developer%22+OR+developer+OR+engineer%29+AND+%28Python+OR+py%29+AND+%28React+OR+%22ReactJS%22+OR+%22React.js%22%29+AND+%28remote+OR+%22work+from+home%22+OR+telecommute+OR+%22distributed+team%22%29+AND+NOT+%28junior+OR+intern+OR+graduate+OR+%22entry+level%22+OR+%22entry-level%22+OR+senior+OR+lead+OR+principal+OR+architect%29+AND+%28startup%29%29&f_TPR=r604800&sortBy=R
- Boolean keyword query: `("Software Engineer" OR Developer OR Programmer) AND (Python OR Django OR Flask) AND (React OR "React.js" OR Frontend)`
- Filters: Remote work, Mid-Senior level, Past Week
