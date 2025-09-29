import { motion } from 'framer-motion';

const UserSearchResult = ({ user, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="user-search-result"
            onClick={onClick}
        >
            <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="user-avatar-small"
            />
            <div className="user-info">
                <h4 className="user-login">{user.login}</h4>
                {user.type && (
                    <span className="user-type">{user.type}</span>
                )}
            </div>
        </motion.div>
    );
};

export default UserSearchResult;