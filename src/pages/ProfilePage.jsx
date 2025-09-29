import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useGitHubUser, useGitHubRepositories, useGitHubRepository } from '../hooks/useGitHub';
import UserProfile from '../components/UserProfile';
import RepositoriesList from '../components/RepositoriesList';
import RepositoryDetails from '../components/RepositoryDetails';
import SearchBar from '../components/SearchBar';
import RateLimitWarning from '../components/RateLimitWarning';
import AIReview from '../components/AIReview';
import ThemeToggle from '../components/ThemeToggle';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [selectedRepo, setSelectedRepo] = useState(null);

    const { user, loading: userLoading, error: userError } = useGitHubUser(username);
    const { repositories, loading: reposLoading, error: reposError } = useGitHubRepositories(username);

    const {
        repository,
        languages,
        commits,
        loading: repoDetailsLoading,
        error: repoDetailsError
    } = useGitHubRepository(
        selectedRepo?.owner?.login,
        selectedRepo?.name
    );

    const handleUserSelect = (newUsername) => {
        navigate(`/profile/${newUsername}`);
    };

    const handleRepositoryClick = (repo) => {
        setSelectedRepo(repo);
    };

    const handleBackToProfile = () => {
        setSelectedRepo(null);
    };

    if (!username) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-container"
            >
                <h2>Invalid URL</h2>
                <p>Please provide a valid username in the URL.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="profile-page"
        >
            {selectedRepo ? (
                <RepositoryDetails
                    repository={repository}
                    languages={languages}
                    commits={commits}
                    loading={repoDetailsLoading}
                    error={repoDetailsError}
                    onBack={handleBackToProfile}
                />
            ) : (
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <UserProfile
                            user={user}
                            loading={userLoading}
                            error={userError}
                        />
                    </div>
                    <div className="profile-main">
                        {user && repositories && (
                            <AIReview
                                user={user}
                                repositories={repositories}
                            />
                        )}
                        {user && (
                            <RepositoriesList
                                repositories={repositories}
                                loading={reposLoading}
                                error={reposError}
                                onRepositoryClick={handleRepositoryClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ProfilePage;