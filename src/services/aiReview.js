import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

class AIReviewService {
    constructor() {
        // Use the newer Gemini 2.5 Flash model for better responses
        this.geminiModel = 'gemini-2.5-flash';
        this.lastRequestTime = 0;
        this.requestDelay = 1000; // 1 second between requests
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async rateLimitedRequest(requestFn) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.requestDelay) {
            await this.delay(this.requestDelay - timeSinceLastRequest);
        }

        this.lastRequestTime = Date.now();
        return await requestFn();
    }

    generateProfilePrompt(user, repositories) {
        return `
As an expert code reviewer and software engineering analyst, please analyze this GitHub profile and provide comprehensive insights:

# GitHub User: ${user.login}
- Name: ${user.name || 'Not specified'}
- Bio: ${user.bio || 'Not specified'}
- Public Repositories: ${user.public_repos}
- Followers: ${user.followers}
- Following: ${user.following}
- Account created: ${new Date(user.created_at).toLocaleDateString()}
- Last active: ${new Date(user.updated_at).toLocaleDateString()}

## Repositories (${repositories.length} most recent):
${repositories.map(repo => `
- ${repo.name}
  Language: ${repo.language || 'Not specified'}
  Stars: ${repo.stargazers_count}
  Forks: ${repo.forks_count}
  Created: ${new Date(repo.created_at).toLocaleDateString()}
  Last updated: ${new Date(repo.updated_at).toLocaleDateString()}
  Description: ${repo.description || 'No description'}
`).join('\n')}

Provide a detailed professional assessment of this GitHub profile including:
1. Overall skills assessment based on repository analysis
2. Technical proficiency evaluation
3. Project diversity and complexity assessment
4. Growth over time and recent activity patterns
5. Development strengths and potential areas for improvement
6. Recommended focus areas for skill development
7. Career development suggestions based on the profile

Format your response in markdown with clear sections and bullet points. Include specific observations about repositories that stand out.
`;
    }

    generateRepositoryPrompt(repository) {
        return `
As an expert code reviewer and software engineering analyst, please provide a comprehensive assessment of this GitHub repository:

# Repository: ${repository.name}
- Owner: ${repository.owner?.login || 'Unknown'}
- Language: ${repository.language || 'Not specified'}
- Stars: ${repository.stargazers_count}
- Forks: ${repository.forks_count}
- Watchers: ${repository.watchers_count}
- Open Issues: ${repository.open_issues_count}
- Created: ${new Date(repository.created_at).toLocaleDateString()}
- Last updated: ${new Date(repository.updated_at).toLocaleDateString()}
- Description: ${repository.description || 'No description'}
- Default branch: ${repository.default_branch}
- License: ${repository.license?.name || 'Not specified'}
- Size: ${Math.round(repository.size / 1024)} MB

Provide a comprehensive code quality assessment covering:
1. Overall project structure and organization analysis
2. Technical implementation quality assessment
3. Best practices adherence evaluation
4. Documentation quality and completeness
5. Potential areas for improvement
6. Maintenance and update frequency analysis
7. Community engagement and open source practices

Format your response in markdown with clear sections. Be specific and detailed in your analysis.
`;
    }

    async reviewWithGemini(user, repositories) {
        try {
            // Initialize the Gemini API with the provided API key
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: this.geminiModel });

            // Generate the prompt based on whether we're reviewing a profile or a specific repository
            const prompt = Array.isArray(repositories) && repositories.length > 1 
                ? this.generateProfilePrompt(user, repositories)
                : this.generateRepositoryPrompt(repositories[0]);

            // Make the API request with rate limiting
            const result = await this.rateLimitedRequest(async () => {
                return await model.generateContent({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2000,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                    ],
                });
            });

            const response = result.response;
            
            return {
                success: true,
                provider: 'Gemini',
                review: response.text(),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }

    async reviewWithMistral(user, repositories) {
        try {
            // Initialize the Mistral client with the provided API key
            const mistral = new OpenAI({
                apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
                baseURL: 'https://api.mistral.ai/v1',
            });

            // Generate the prompt based on whether we're reviewing a profile or a specific repository
            const prompt = Array.isArray(repositories) && repositories.length > 1 
                ? this.generateProfilePrompt(user, repositories)
                : this.generateRepositoryPrompt(repositories[0]);

            // Make the API request with rate limiting
            const completion = await this.rateLimitedRequest(async () => {
                return await mistral.chat.completions.create({
                    model: 'mistral-large-latest',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert software engineer and code reviewer. Provide detailed, professional and constructive feedback on GitHub profiles and repositories.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 2000,
                    temperature: 0.7
                });
            });
            
            // Check for valid response
            if (!completion || !completion.choices || !completion.choices[0]) {
                throw new Error('Invalid response structure from Mistral API');
            }
            
            return {
                success: true,
                provider: 'Mistral',
                review: completion.choices[0].message.content,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Mistral API error:', error);
            throw error;
        }
    }

    generateDemoReview(user, repositories) {
        const topLanguages = repositories
            .filter(repo => repo.language)
            .reduce((acc, repo) => {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
                return acc;
            }, {});

        const primaryLanguage = Object.entries(topLanguages)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'JavaScript';

        return `# GitHub Profile Review: ${user.name || user.login} (Demo Mode)

## Profile Overview
**${user.login}** has been on GitHub since ${new Date(user.created_at).toLocaleDateString()}, demonstrating a ${Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365))}+ year history in software development.

${user.bio ? `> "${user.bio}"` : ''}

## Technical Skills Assessment
Based on repository analysis, ${user.login} shows proficiency in:
- **Primary Language**: ${primaryLanguage}
- **Project Types**: ${repositories.some(r => r.language === 'JavaScript') ? 'Web Development, ' : ''}${repositories.some(r => r.language === 'Python') ? 'Data Science/Automation, ' : ''}${repositories.some(r => ['Java', 'C#', 'C++'].includes(r.language)) ? 'Application Development, ' : ''}General Software Engineering
- **Complexity Level**: ${repositories.some(r => r.stargazers_count > 10) ? 'Intermediate to Advanced' : 'Beginner to Intermediate'}

## Community Engagement
- **Repositories**: ${user.public_repos} public projects
- **Followers**: ${user.followers} (${user.followers > 100 ? 'Strong' : user.followers > 20 ? 'Good' : 'Growing'} community presence)
- **Following**: ${user.following} developers
- **Collaboration**: Evidence of active participation in the developer community

## Areas of Expertise
Based on the repository analysis:
1. **${primaryLanguage} Development** - Primary focus area
2. **Web Development** - Multiple web-related projects
3. **Open Source** - Consistent public repository contributions

## Growth Recommendations
1. **Enhance Documentation**: Add more detailed README files with setup instructions and examples
2. **Increase Collaboration**: Consider contributing to larger open source projects
3. **Add Testing**: Implement comprehensive testing suites for better code quality
4. **Performance Optimization**: Focus on code efficiency and best practices

## Overall Rating: ${user.public_repos > 20 ? 'Advanced' : user.public_repos > 10 ? 'Intermediate+' : 'Intermediate'}

*This is a demo review. For more detailed analysis, please configure valid API keys for Gemini or Mistral AI services.*`;
    }

    async reviewProfile(user, repositories) {
        // Always use demo mode if API keys aren't available or demo mode is explicitly enabled
        const useDemo = 
            import.meta.env.VITE_DEMO_MODE === 'true' || 
            (!import.meta.env.VITE_GEMINI_API_KEY && !import.meta.env.VITE_MISTRAL_API_KEY);
            
        if (useDemo) {
            console.log('Demo mode enabled, generating sample review...');
            await this.delay(1500); // Simulate API delay (shorter for better UX)
            return {
                success: true,
                provider: 'Demo AI',
                review: this.generateDemoReview(user, repositories),
                timestamp: new Date().toISOString()
            };
        }

        // API mode: try Gemini first, then Mistral, then fallback to demo
        let geminiError = null;
        let mistralError = null;
        
        // Try Gemini if API key exists
        if (import.meta.env.VITE_GEMINI_API_KEY) {
            try {
                console.log('Attempting profile review with Gemini...');
                return await this.reviewWithGemini(user, repositories);
            } catch (error) {
                geminiError = error;
                console.error('Gemini API error:', error);
            }
        } else {
            console.log('Skipping Gemini (no API key)');
        }

        // Try Mistral if API key exists and Gemini failed
        if (import.meta.env.VITE_MISTRAL_API_KEY) {
            try {
                console.log('Attempting profile review with Mistral...');
                return await this.reviewWithMistral(user, repositories);
            } catch (error) {
                mistralError = error;
                console.error('Mistral API error:', error);
            }
        } else {
            console.log('Skipping Mistral (no API key)');
        }

        // Both APIs failed or weren't configured, use demo mode
        console.log('Both APIs failed, using demo mode...');
        return {
            success: true,
            provider: 'Demo AI (API Fallback)',
            review: this.generateDemoReview(user, repositories),
            timestamp: new Date().toISOString()
        };
    }

    generateRepositoryDemoReview(repository) {
        const createdDate = new Date(repository.created_at);
        const updatedDate = new Date(repository.updated_at);
        const daysSinceUpdate = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));

        return `# Repository Review: ${repository.name} (Demo Mode)

## Code Quality Assessment
**${repository.name}** is a ${repository.language || 'multi-language'} project with ${repository.stargazers_count} stars and ${repository.forks_count} forks. The repository demonstrates ${repository.stargazers_count > 10 ? 'good' : 'emerging'} community interest.

## Technical Implementation
- **Primary Language**: ${repository.language || 'Mixed'}
- **Repository Size**: ${Math.round(repository.size / 1024)} MB
- **License**: ${repository.license?.name || 'No license specified'}
- **Visibility**: ${repository.private ? 'Private' : 'Public'} repository

## Maintenance & Activity
- **Created**: ${createdDate.toLocaleDateString()} (${Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365))} years ago)
- **Last Updated**: ${updatedDate.toLocaleDateString()} (${daysSinceUpdate} days ago)
- **Activity Level**: ${daysSinceUpdate < 30 ? 'Highly Active' : daysSinceUpdate < 90 ? 'Active' : daysSinceUpdate < 365 ? 'Moderately Active' : 'Low Activity'}

## Documentation Quality
${repository.description ? `✅ Project has a clear description: "${repository.description}"` : '⚠️ No project description provided'}

## Best Practices Analysis
- **Issue Tracking**: ${repository.open_issues_count} open issues ${repository.open_issues_count > 0 ? '(active community engagement)' : '(well-maintained)'}
- **Default Branch**: ${repository.default_branch || 'main'}

## Recommendations
1. **Enhance Documentation**: ${repository.description ? 'Expand' : 'Add'} comprehensive README with usage examples
2. **Community Engagement**: ${repository.stargazers_count < 5 ? 'Promote the project to gain visibility' : 'Continue engaging with contributors'}
3. **Code Quality**: Implement automated testing and CI/CD workflows
4. **License**: ${repository.license ? 'License is properly configured' : 'Consider adding an open source license'}

## Overall Score: ${repository.stargazers_count > 50 ? '9/10' : repository.stargazers_count > 10 ? '7/10' : repository.stargazers_count > 0 ? '6/10' : '5/10'}

*This is a demo review. For detailed code analysis, please configure valid API keys.*`;
    }

    async reviewRepository(repository) {
        // Check if demo mode is enabled
        if (import.meta.env.VITE_DEMO_MODE === 'true') {
            console.log('Demo mode enabled, generating sample repository review...');
            await this.delay(1500); // Simulate API delay
            return {
                success: true,
                provider: 'Demo AI',
                review: this.generateRepositoryDemoReview(repository),
                timestamp: new Date().toISOString()
            };
        }

        // Create a simplified user object for repository review
        const repoUser = {
            login: repository.owner?.login || 'unknown',
            name: repository.name,
            bio: repository.description,
            public_repos: 1,
            followers: repository.stargazers_count,
            following: repository.forks_count,
            created_at: repository.created_at,
            updated_at: repository.updated_at
        };

        try {
            return await this.reviewWithGemini(repoUser, [repository]);
        } catch (error) {
            console.log('API unavailable, using demo mode...', error);
            return {
                success: true,
                provider: 'Demo AI (API Fallback)',
                review: this.generateRepositoryDemoReview(repository),
                timestamp: new Date().toISOString()
            };
        }
    }
}

export default new AIReviewService();