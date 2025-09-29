import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const RateLimitWarning = ({ error, onDismiss }) => {
    const isRateLimit = error?.includes('rate limit');

    if (!isRateLimit) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rate-limit-warning"
        >
            <div className="warning-content">
                <div className="warning-header">
                    <ExclamationTriangleIcon className="warning-icon" />
                    <h3>Rate Limit Exceeded</h3>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="dismiss-button"
                            aria-label="Dismiss"
                        >
                            ×
                        </button>
                    )}
                </div>

                <p className="warning-message">
                    You've exceeded GitHub's API rate limit. This happens when making too many requests.
                </p>

                <div className="warning-solutions">
                    <div className="solution-item">
                        <InformationCircleIcon className="solution-icon" />
                        <div>
                            <strong>Quick Fix:</strong> Wait a few minutes and try again, or search for users directly by typing their exact username.
                        </div>
                    </div>

                    <div className="solution-item">
                        <InformationCircleIcon className="solution-icon" />
                        <div>
                            <strong>Permanent Solution:</strong> Add a GitHub personal access token to increase your rate limit from 60 to 5000 requests per hour.
                        </div>
                    </div>
                </div>

                <div className="token-instructions">
                    <h4>How to add a GitHub token:</h4>
                    <ol>
                        <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Settings → Tokens</a></li>
                        <li>Create a new token (no special permissions needed for public data)</li>
                        <li>Copy the token and add it to <code>src/services/github.js</code></li>
                    </ol>
                </div>
            </div>
        </motion.div>
    );
};

export default RateLimitWarning;