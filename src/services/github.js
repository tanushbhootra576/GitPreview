import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
    constructor() {
        // Get GitHub token from environment variables
        const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

        this.api = axios.create({
            baseURL: GITHUB_API_BASE,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(GITHUB_TOKEN && {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                }),
            },
        });

        // Add response interceptor for better error handling
        this.api.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 403) {
                    // Rate limit exceeded
                    const resetTime = error.response.headers['x-ratelimit-reset'];
                    const resetDate = resetTime ? new Date(resetTime * 1000) : null;
                    const timeUntilReset = resetDate ? Math.ceil((resetDate - new Date()) / 1000 / 60) : 'unknown';

                    throw new Error(
                        `GitHub API rate limit exceeded. ${resetDate ? `Rate limit resets in ${timeUntilReset} minutes.` : ''} ` +
                        'Consider adding a GitHub personal access token to increase your rate limit.'
                    );
                }
                return Promise.reject(error);
            }
        );
    }

    async searchUsers(query, page = 1, perPage = 10) {
        try {
            const response = await this.api.get('/search/users', {
                params: {
                    q: query,
                    page,
                    per_page: perPage,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to search users: ${error.message}`);
        }
    }

    async getUser(username) {
        try {
            const response = await this.api.get(`/users/${username}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('User not found');
            }
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    async getUserRepositories(username, page = 1, perPage = 30) {
        try {
            const response = await this.api.get(`/users/${username}/repos`, {
                params: {
                    page,
                    per_page: perPage,
                    sort: 'updated',
                    direction: 'desc',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch repositories: ${error.message}`);
        }
    }

    async getRepository(owner, repo) {
        try {
            const response = await this.api.get(`/repos/${owner}/${repo}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Repository not found');
            }
            throw new Error(`Failed to fetch repository: ${error.message}`);
        }
    }

    async getRepositoryLanguages(owner, repo) {
        try {
            const response = await this.api.get(`/repos/${owner}/${repo}/languages`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch repository languages: ${error.message}`);
        }
    }

    async getRepositoryCommits(owner, repo, page = 1, perPage = 10) {
        try {
            const response = await this.api.get(`/repos/${owner}/${repo}/commits`, {
                params: {
                    page,
                    per_page: perPage,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch repository commits: ${error.message}`);
        }
    }
}

export default new GitHubService();