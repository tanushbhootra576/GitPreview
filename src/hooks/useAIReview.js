import { useState, useCallback } from 'react';
import aiReviewService from '../services/aiReview';

export const useAIReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [review, setReview] = useState(null);

    const reviewProfile = useCallback(async (user, repositories) => {
        setLoading(true);
        setError(null);
        setReview(null);

        try {
            // Our aiReviewService now handles errors internally and falls back to demo mode,
            // so this should always succeed unless there's a critical error
            const result = await aiReviewService.reviewProfile(user, repositories);

            if (result.success) {
                setReview(result);
                // If we're in demo mode due to API failures, show a warning
                if (result.provider.includes('Demo') && !import.meta.env.VITE_DEMO_MODE) {
                    setError('Using demo mode due to API connection issues. Configure API keys for full functionality.');
                }
            } else {
                setError(result.error || 'Unknown error occurred');
            }
        } catch (err) {
            console.error('AI Review Error:', err);

            // Provide more detailed error messages
            if (err.message?.includes('QUOTA_EXCEEDED')) {
                setError('API quota exceeded. Try again later or switch to demo mode.');
            } else if (err.message?.includes('INVALID_API_KEY')) {
                setError('Invalid API key. Check your configuration.');
            } else if (err.message?.includes('CORS')) {
                setError('API request blocked by CORS policy. Using demo mode instead.');
            } else if (err.message?.includes('generateContent')) {
                setError('Gemini API configuration issue. Using demo mode instead.');
            } else if (err.message?.includes('Failed to fetch')) {
                setError('Network error connecting to AI service. Using demo mode instead.');
            } else {
                setError('Failed to generate AI review. Using demo mode.');
            }

            // Try to generate a demo review as fallback
            try {
                const demoResult = await aiReviewService.reviewProfile(user, repositories);
                if (demoResult.success) {
                    setReview(demoResult);
                }
            } catch (demoError) {
                console.error('Demo fallback also failed:', demoError);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const reviewRepository = useCallback(async (repository) => {
        setLoading(true);
        setError(null);
        setReview(null);

        try {
            // Our aiReviewService now handles errors internally and falls back to demo mode
            const result = await aiReviewService.reviewRepository(repository);

            if (result.success) {
                setReview(result);
                // If we're in demo mode due to API failures, show a warning
                if (result.provider.includes('Demo') && !import.meta.env.VITE_DEMO_MODE) {
                    setError('Using demo mode due to API connection issues. Configure API keys for full functionality.');
                }
            } else {
                setError(result.error || 'Unknown error occurred');
            }
        } catch (err) {
            console.error('Repository Review Error:', err);

            // Provide more detailed error messages
            if (err.message?.includes('QUOTA_EXCEEDED')) {
                setError('API quota exceeded. Try again later or switch to demo mode.');
            } else if (err.message?.includes('INVALID_API_KEY')) {
                setError('Invalid API key. Check your configuration.');
            } else if (err.message?.includes('CORS')) {
                setError('API request blocked by CORS policy. Using demo mode instead.');
            } else if (err.message?.includes('generateContent')) {
                setError('Gemini API configuration issue. Using demo mode instead.');
            } else if (err.message?.includes('Failed to fetch')) {
                setError('Network error connecting to AI service. Using demo mode instead.');
            } else {
                setError('Failed to generate repository review. Using demo mode.');
            }

            // Try to generate a demo review as fallback
            try {
                const demoResult = await aiReviewService.reviewRepository(repository);
                if (demoResult.success) {
                    setReview(demoResult);
                }
            } catch (demoError) {
                console.error('Demo fallback also failed:', demoError);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const clearReview = useCallback(() => {
        setReview(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        review,
        reviewProfile,
        reviewRepository,
        clearReview
    };
};