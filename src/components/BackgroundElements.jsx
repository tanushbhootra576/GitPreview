import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements = () => {
    return (
        <div className="background-elements">
            {/* SVG-based geometric shapes */}
            <motion.div
                className="svg-element svg-element-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M250 50C361.25 50 450 138.75 450 250C450 361.25 361.25 450 250 450C138.75 450 50 361.25 50 250C50 138.75 138.75 50 250 50Z"
                        strokeWidth="2"
                        strokeDasharray="1500"
                        strokeDashoffset="1500"
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        className="svg-path"
                    />
                    <motion.circle
                        cx="250"
                        cy="250"
                        r="150"
                        strokeWidth="2"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        className="svg-path"
                    />
                </svg>
            </motion.div>

            <motion.div
                className="svg-element svg-element-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            >
                <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M300 100L500 300L300 500L100 300L300 100Z"
                        strokeWidth="2"
                        strokeDasharray="1600"
                        strokeDashoffset="1600"
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        className="svg-path"
                    />
                    <motion.path
                        d="M300 150L450 300L300 450L150 300L300 150Z"
                        strokeWidth="2"
                        strokeDasharray="1200"
                        strokeDashoffset="1200"
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        className="svg-path"
                    />
                </svg>
            </motion.div>

            <motion.div
                className="svg-element svg-element-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            >
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.rect
                        x="100"
                        y="100"
                        width="200"
                        height="200"
                        strokeWidth="2"
                        strokeDasharray="800"
                        strokeDashoffset="800"
                        animate={{ strokeDashoffset: 0, rotate: 360 }}
                        transition={{
                            strokeDashoffset: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
                            rotate: { duration: 20, ease: "linear", repeat: Infinity }
                        }}
                        className="svg-path"
                    />
                    <motion.rect
                        x="150"
                        y="150"
                        width="100"
                        height="100"
                        strokeWidth="2"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                        animate={{ strokeDashoffset: 0, rotate: -360 }}
                        transition={{
                            strokeDashoffset: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
                            rotate: { duration: 15, ease: "linear", repeat: Infinity }
                        }}
                        className="svg-path"
                    />
                </svg>
            </motion.div>

            {/* Code bracket elements */}
            <motion.div
                className="code-bracket code-bracket-1"
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                {"</>"}
            </motion.div>

            <motion.div
                className="code-bracket code-bracket-2"
                animate={{
                    y: [0, 10, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                {"{...}"}
            </motion.div>

            <motion.div
                className="code-bracket code-bracket-3"
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 6, repeat: Infinity }}
            >
                {"()=>{}"}
            </motion.div>

            {/* Blurred orange circle bottom right */}
            <motion.div
                className="blurred-orange-circle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            >
                <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                        cx="210"
                        cy="210"
                        r="180"
                        fill="url(#orangeGradient)"
                        filter="url(#blur)"
                        opacity="0.7"
                    />
                    <defs>
                        <radialGradient id="orangeGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stopColor="#ffb347" />
                            <stop offset="100%" stopColor="#ff6a00" />
                        </radialGradient>
                        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="60" />
                        </filter>
                    </defs>
                </svg>
            </motion.div>

            <div className="noise-overlay"></div>
        </div>
    );
};

export default BackgroundElements;