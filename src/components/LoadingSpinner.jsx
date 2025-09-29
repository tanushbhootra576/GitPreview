import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text }) => {
    const sizeClasses = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-container"
        >
            <div className={`loading-spinner ${sizeClasses[size]}`}>
                <div className="spinner-ring"></div>
            </div>
            {text && <p className="loading-text">{text}</p>}
        </motion.div>
    );
};

export default LoadingSpinner;