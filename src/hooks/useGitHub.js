import { useState, useEffect } from 'react';
import GitHubService from '../services/github';

export const useGitHubUser = (username) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) {
            setUser(null);
            return;
        }

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const userData = await GitHubService.getUser(username);
                setUser(userData);
            } catch (err) {
                setError(err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    return { user, loading, error };
};

export const useGitHubRepositories = (username) => {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) {
            setRepositories([]);
            return;
        }

        const fetchRepositories = async () => {
            setLoading(true);
            setError(null);
            try {
                const repos = await GitHubService.getUserRepositories(username);
                setRepositories(repos);
            } catch (err) {
                setError(err.message);
                setRepositories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [username]);

    return { repositories, loading, error };
};

export const useGitHubSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        // If query looks like a username (no spaces, reasonable length), 
        // also try direct user lookup as fallback
        const isLikelyUsername = /^[a-zA-Z0-9-_]+$/.test(query) && query.length <= 39;

        setLoading(true);
        setError(null);
        try {
            const searchData = await GitHubService.searchUsers(query);
            setResults(searchData.items || []);
        } catch (err) {
            // If search fails due to rate limit and query looks like username, try direct lookup
            if (err.message.includes('rate limit') && isLikelyUsername) {
                try {
                    const user = await GitHubService.getUser(query);
                    setResults([user]);
                    setError(null);
                } catch {
                    setError(err.message); // Keep original rate limit error
                    setResults([]);
                }
            } else {
                setError(err.message);
                setResults([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { results, loading, error, searchUsers, clearError };
};

export const useGitHubRepository = (owner, repo) => {
    const [repository, setRepository] = useState(null);
    const [languages, setLanguages] = useState({});
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!owner || !repo) return;

        const fetchRepositoryData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [repoData, languagesData, commitsData] = await Promise.all([
                    GitHubService.getRepository(owner, repo),
                    GitHubService.getRepositoryLanguages(owner, repo),
                    GitHubService.getRepositoryCommits(owner, repo),
                ]);

                setRepository(repoData);
                setLanguages(languagesData);
                setCommits(commitsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositoryData();
    }, [owner, repo]);

    return { repository, languages, commits, loading, error };
};