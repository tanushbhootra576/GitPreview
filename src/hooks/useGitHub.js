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

        setLoading(true);
        setError(null);
        try {
            const searchData = await GitHubService.searchUsers(query);
            setResults(searchData.items || []);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, error, searchUsers };
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