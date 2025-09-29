import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    StarIcon,
    EyeIcon,
    CodeBracketIcon,
    ArrowPathIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatDate, formatNumber, getLanguageColor, truncateText } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

const RepositoryCard = ({ repository, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="repository-card"
            onClick={() => onClick(repository)}
        >
            <div className="repo-header">
                <h3 className="repo-name">{repository.name}</h3>
                {repository.private && (
                    <span className="repo-private">Private</span>
                )}
            </div>

            {repository.description && (
                <p className="repo-description">
                    {truncateText(repository.description, 100)}
                </p>
            )}

            <div className="repo-stats">
                {repository.language && (
                    <div className="repo-language">
                        <span
                            className="language-dot"
                            style={{ backgroundColor: getLanguageColor(repository.language) }}
                        ></span>
                        <span>{repository.language}</span>
                    </div>
                )}

                <div className="repo-stat">
                    {repository.stargazers_count > 0 ? (
                        <StarIconSolid className="stat-icon star-filled" />
                    ) : (
                        <StarIcon className="stat-icon" />
                    )}
                    <span>{formatNumber(repository.stargazers_count)}</span>
                </div>

                <div className="repo-stat">
                    <EyeIcon className="stat-icon" />
                    <span>{formatNumber(repository.watchers_count)}</span>
                </div>

                <div className="repo-stat">
                    <ArrowPathIcon className="stat-icon" />
                    <span>{formatNumber(repository.forks_count)}</span>
                </div>

                <div className="repo-updated-stat">
                    <CalendarIcon className="stat-icon calendar-icon" />
                    <span className="update-date">Updated <span className="update-date-value">{formatDate(repository.updated_at)}</span></span>
                </div>
            </div>
        </motion.div>
    );
};

const RepositoriesList = ({ repositories, loading, error, onRepositoryClick }) => {
    const [sortBy, setSortBy] = useState('updated');
    const [filterLanguage, setFilterLanguage] = useState('');

    if (loading) {
        return <LoadingSpinner size="large" text="Loading repositories..." />;
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-container"
            >
                <h2>Error</h2>
                <p>{error}</p>
            </motion.div>
        );
    }

    if (!repositories || repositories.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
            >
                <h2>No repositories found</h2>
                <p>This user doesn't have any public repositories.</p>
            </motion.div>
        );
    }

    // Get unique languages for filter
    const languages = [...new Set(repositories
        .filter(repo => repo.language)
        .map(repo => repo.language))];

    // Filter and sort repositories
    const filteredRepositories = repositories
        .filter(repo => !filterLanguage || repo.language === filterLanguage)
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stars':
                    return b.stargazers_count - a.stargazers_count;
                case 'forks':
                    return b.forks_count - a.forks_count;
                case 'updated':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="repositories-container"
        >
            <div className="repositories-header">
                <h2>Repositories ({repositories.length})</h2>

                <div className="repositories-controls">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="updated">Recently Updated</option>
                        <option value="name">Name</option>
                        <option value="stars">Stars</option>
                        <option value="forks">Forks</option>
                    </select>

                    <select
                        value={filterLanguage}
                        onChange={(e) => setFilterLanguage(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Languages</option>
                        {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="repositories-grid">
                {filteredRepositories.map((repository) => (
                    <RepositoryCard
                        key={repository.id}
                        repository={repository}
                        onClick={onRepositoryClick}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default RepositoriesList;