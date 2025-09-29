import { motion } from 'framer-motion';
import { MapPinIcon, LinkIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { formatDate, formatNumber } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

const UserProfile = ({ user, loading, error }) => {
    if (loading) {
        return <LoadingSpinner size="large" text="Loading user profile..." />;
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

    if (!user) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="user-profile cool-profile"
        >
            <div className="cool-profile-bg" />
            <div className="cool-profile-content">
                <div className="cool-profile-avatar">
                    <img
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        className="avatar-large"
                    />
                </div>
                <h1 className="cool-profile-name">{user.name || user.login}</h1>
                <p className="cool-profile-username">@{user.login}</p>
                {user.bio && <p className="cool-profile-bio">{user.bio}</p>}
                <div className="cool-profile-meta">
                    {user.location && (
                        <span className="meta-item"><MapPinIcon className="meta-icon" />{user.location}</span>
                    )}
                    {user.company && (
                        <span className="meta-item"><BuildingOfficeIcon className="meta-icon" />{user.company}</span>
                    )}
                    {user.blog && (
                        <span className="meta-item"><LinkIcon className="meta-icon" /><a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog.length > 25 ? `${user.blog.substring(0, 22)}...` : user.blog}</a></span>
                    )}
                </div>
                <div className="cool-profile-stats-glass">
                    <div className="stat-item">
                        <UserGroupIcon className="stat-icon" />
                        <span className="stat-number">{formatNumber(user.followers)}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(user.following)}</span>
                        <span className="stat-label">Following</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{formatNumber(user.public_repos)}</span>
                        <span className="stat-label">Repositories</span>
                    </div>
                </div>
                <div className="cool-profile-dates">
                    <span><strong>Joined:</strong> {formatDate(user.created_at)}</span>
                    {user.updated_at && (
                        <span><strong>Last updated:</strong> {formatDate(user.updated_at)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;