import { motion } from 'framer-motion';
import {
    StarIcon,
    EyeIcon,
    CodeBracketIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    LinkIcon,
    CalendarIcon,
    ArrowPathIcon,
    DocumentTextIcon,
    HashtagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatDate, formatNumber, getLanguageColor } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
import AIReview from './AIReview';

const LanguageBar = ({ languages }) => {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    if (total === 0) return null;

    const languageStats = Object.entries(languages)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: (bytes / total) * 100,
            color: getLanguageColor(name)
        }))
        .sort((a, b) => b.bytes - a.bytes);

    return (
        <div className="language-stats">
            <h3>Languages</h3>
            <div className="language-bar">
                {languageStats.map((lang) => (
                    <div
                        key={lang.name}
                        className="language-segment"
                        style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color
                        }}
                        title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                    />
                ))}
            </div>
            <div className="language-list">
                {languageStats.slice(0, 5).map((lang) => (
                    <div key={lang.name} className="language-item">
                        <span
                            className="language-dot"
                            style={{ backgroundColor: lang.color }}
                        />
                        <span className="language-name">{lang.name}</span>
                        <span className="language-percentage">
                            {lang.percentage.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CommitsList = ({ commits }) => {
    if (!commits || commits.length === 0) {
        return (
            <div className="empty-commits">
                <p>No recent commits found.</p>
            </div>
        );
    }

    return (
        <div className="commits-list">
            <h3>Recent Commits</h3>
            {commits.slice(0, 5).map((commit) => (
                <motion.div
                    key={commit.sha}
                    whileHover={{ scale: 1.01 }}
                    className="commit-item"
                >
                    <div className="commit-avatar">
                        <img
                            src={commit.author?.avatar_url || commit.committer?.avatar_url}
                            alt="Committer avatar"
                            className="avatar-small"
                        />
                    </div>
                    <div className="commit-info">
                        <p className="commit-message">
                            {commit.commit.message.split('\n')[0]}
                        </p>
                        <div className="commit-meta">
                            <span className="commit-author">
                                {commit.commit.author.name}
                            </span>
                            <span className="commit-date">
                                {formatDate(commit.commit.author.date)}
                            </span>
                            <span className="commit-sha">
                                {commit.sha.substring(0, 7)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const RepositoryDetails = ({ repository, languages, commits, loading, error, onBack }) => {
    if (loading) {
        return <LoadingSpinner size="large" text="Loading repository details..." />;
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-container"
            >
                <button onClick={onBack} className="back-button">
                    <ArrowLeftIcon className="back-icon" />
                    Back to Profile
                </button>
                <h2>Error</h2>
                <p>{error}</p>
            </motion.div>
        );
    }

    if (!repository) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="repository-details"
        >
            <button onClick={onBack} className="back-button">
                <ArrowLeftIcon className="back-icon" />
                Back to Profile
            </button>

            <div className="repo-details-header">
                <div className="repo-title">
                    <h1>{repository.full_name}</h1>
                    {repository.private && (
                        <span className="repo-private">Private</span>
                    )}
                </div>

                {repository.description && (
                    <p className="repo-description">{repository.description}</p>
                )}

                <div className="repo-links">
                    {repository.homepage && (
                        <a
                            href={repository.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-link"
                        >
                            <LinkIcon className="link-icon" />
                            Website
                        </a>
                    )}
                    <a
                        href={repository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                    >
                        <LinkIcon className="link-icon" />
                        View on GitHub
                    </a>
                </div>
            </div>

            <div className="repo-stats-detailed">
                <div className="stat-card">
                    {repository.stargazers_count > 0 ? (
                        <StarIconSolid className="stat-icon star-filled" />
                    ) : (
                        <StarIcon className="stat-icon" />
                    )}
                    <span className="stat-number">{formatNumber(repository.stargazers_count)}</span>
                    <span className="stat-label">Stars</span>
                </div>

                <div className="stat-card">
                    <EyeIcon className="stat-icon" />
                    <span className="stat-number">{formatNumber(repository.watchers_count)}</span>
                    <span className="stat-label">Watchers</span>
                </div>

                <div className="stat-card">
                    <ArrowPathIcon className="stat-icon" />
                    <span className="stat-number">{formatNumber(repository.forks_count)}</span>
                    <span className="stat-label">Forks</span>
                </div>

                {repository.open_issues_count > 0 && (
                    <div className="stat-card">
                        <ExclamationTriangleIcon className="stat-icon" />
                        <span className="stat-number">{formatNumber(repository.open_issues_count)}</span>
                        <span className="stat-label">Issues</span>
                    </div>
                )}
            </div>

            <div className="repo-metadata">
                <div className="metadata-item">
                    <CalendarIcon className="metadata-icon" />
                    <span>Created {formatDate(repository.created_at)}</span>
                </div>
                <div className="metadata-item">
                    <CalendarIcon className="metadata-icon updated-icon" />
                    <span>Last updated {formatDate(repository.updated_at)}</span>
                </div>
                {repository.size && (
                    <div className="metadata-item">
                        <DocumentTextIcon className="metadata-icon" />
                        <span>{formatNumber(repository.size)} KB</span>
                    </div>
                )}
                {repository.default_branch && (
                    <div className="metadata-item">
                        <HashtagIcon className="metadata-icon" />
                        <span>Default branch: {repository.default_branch}</span>
                    </div>
                )}
                {repository.default_branch && (
                    <div className="metadata-item">
                        <span>Default branch: {repository.default_branch}</span>
                    </div>
                )}
            </div>

            <div className="repo-details-content">
                <LanguageBar languages={languages} />
                <CommitsList commits={commits} />
            </div>

            <AIReview repository={repository} />
        </motion.div>
    );
};

export default RepositoryDetails;