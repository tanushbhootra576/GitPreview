import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAIReview } from '../hooks/useAIReview';
import LoadingSpinner from './LoadingSpinner';

const AIReview = ({ user, repositories, repository }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { loading, error, review, reviewProfile, reviewRepository, clearReview } = useAIReview();

    const handleReviewClick = async () => {
        if (!isOpen) {
            setIsOpen(true);
            try {
                if (repository) {
                    await reviewRepository(repository);
                } else {
                    await reviewProfile(user, repositories);
                }
            } catch (err) {
                console.error("Error during AI review:", err);
                // The error state is handled by the useAIReview hook
                // Even with errors, we'll keep the panel open to show error messages or fallback content
            }
        } else {
            setIsOpen(false);
            clearReview();
        }
    };

    const formatReviewText = (text) => {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/### (.*?)(?:\n|$)/g, '<h3 class="review-heading">$1</h3>')
            .replace(/## (.*?)(?:\n|$)/g, '<h2 class="review-heading">$1</h2>')
            .replace(/# (.*?)(?:\n|$)/g, '<h1 class="review-heading">$1</h1>')
            .replace(/^\d+\.\s(.*)$/gm, '<div class="review-list-item">$1</div>')
            .replace(/^-\s(.*)$/gm, '<div class="review-bullet-item">• $1</div>')
            .split('\n\n')
            .map(paragraph => paragraph.trim() ? `<p class="review-paragraph">${paragraph}</p>` : '')
            .join('');
    };

    return (
        <div className="ai-review-container">
            <button
                onClick={handleReviewClick}
                className={`ai-review-trigger ${isOpen ? 'active' : ''}`}
                disabled={loading}
            >
                <div className="ai-review-btn-content">
                    <SparklesIcon className="ai-icon" />
                    <span>{loading ? 'Analyzing...' : isOpen ? 'Hide AI Review' : 'Get AI Profile Review'}</span>
                    {!isOpen && !loading && <div className="ai-btn-pulse"></div>}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="ai-review-panel">
                        {loading && (
                            <div className="ai-review-loading">
                                <LoadingSpinner size="medium" />
                                <p>AI is analyzing the {repository ? 'repository' : 'profile'}...</p>
                                <small>This may take a few moments</small>
                            </div>
                        )}

                        {error && (
                            <div className="review-error">
                                <ExclamationTriangleIcon className="review-error-icon" />
                                <h3>Review Failed</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {review && (
                            <div className="ai-review-content">
                                <div className="ai-review-header">
                                    <div className="review-provider">
                                        <CheckCircleIcon className="success-icon" />
                                        <span>Powered by {review.provider}</span>
                                        <div className="review-timestamp">
                                            <ClockIcon className="clock-icon" />
                                            {new Date(review.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            clearReview();
                                        }}
                                        className="close-review-btn"
                                    >
                                        <XMarkIcon className="close-icon" />
                                    </button>
                                </div>

                                <div className="ai-review-body">
                                    <div
                                        className="review-text"
                                        dangerouslySetInnerHTML={{
                                            __html: formatReviewText(review.review)
                                        }}
                                    />
                                </div>

                                <div className="ai-review-footer">
                                    <p className="ai-disclaimer">
                                        <SparklesIcon className="disclaimer-icon" />
                                        This review is generated by AI and should be used as guidance.
                                        Always use your professional judgment.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIReview;