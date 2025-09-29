import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useGitHubSearch } from '../hooks/useGitHub';
import UserSearchResult from './UserSearchResult';
import LoadingSpinner from './LoadingSpinner';
import RateLimitWarning from './RateLimitWarning';

const SearchBar = ({ onUserSelect, inputRef }) => {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const { results, loading, error, searchUsers } = useGitHubSearch();

    // Show warning when error contains rate limit
    useEffect(() => {
        if (error?.includes('rate limit')) {
            setShowWarning(true);
        }
    }, [error]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        // Only show results if there are previous results, don't auto-search
        if (!value.trim()) {
            setShowResults(false);
        }
    };

    const handleUserSelect = (user) => {
        setQuery(user.login);
        setShowResults(false);
        onUserSelect(user.login);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            await searchUsers(query.trim());
            setShowResults(true);
            onUserSelect(query.trim());
            setShowResults(false);
        }
    };

    return (
        <div className="search-container expanded">
            {showWarning && (
                <RateLimitWarning
                    error={error}
                    onDismiss={() => setShowWarning(false)}
                />
            )}
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <MagnifyingGlassIcon className="search-icon" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search GitHub users..."
                        className="search-input"
                        ref={inputRef}
                    />
                </div>
            </form>

            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="search-results"
                >
                    {loading && (
                        <div className="search-loading">
                            <LoadingSpinner size="small" />
                            <span>Searching users...</span>
                        </div>
                    )}

                    {error && (
                        <div className="search-error">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && !error && results.length === 0 && query && (
                        <div className="search-no-results">
                            <p>No users found for "{query}"</p>
                        </div>
                    )}

                    {!loading && !error && results.length > 0 && (
                        <div className="search-results-list">
                            {results.slice(0, 10).map((user) => (
                                <UserSearchResult
                                    key={user.id}
                                    user={user}
                                    onClick={() => handleUserSelect(user)}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SearchBar;