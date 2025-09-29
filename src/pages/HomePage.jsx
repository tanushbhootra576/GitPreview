import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundElements from '../components/BackgroundElements';

const HomePage = ({ onUserSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="home-page"
        >
            <BackgroundElements />
            <div className="home-content">
                <div className="hero-section">
                    <h1 className="hero-title">GitPreview</h1>
                    <p className="hero-subtitle">
                        Discover GitHub users, explore their profiles, and dive into their repositories
                    </p>
                </div>

                <div className="features">
                    <div className="feature-card">
                        <h3>Search Users</h3>
                        <p>Find GitHub users by username with real-time search suggestions</p>
                    </div>

                    <div className="feature-card">
                        <h3>View Profiles</h3>
                        <p>See detailed user profiles with stats, bio, and social links</p>
                    </div>

                    <div className="feature-card">
                        <h3>Explore Repositories</h3>
                        <p>Browse repositories with language stats, recent commits, and more</p>
                    </div>
                </div>

                <div className="search-section">
                    <div className="search-container">
                        <div className="search-icon-wrapper">
                            <MagnifyingGlassIcon className="search-icon" />
                        </div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for a GitHub username..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    onUserSelect(e.target.value.trim());
                                }
                            }}
                        />
                        <button
                            className="search-button"
                            onClick={(e) => {
                                const input = e.target.previousSibling;
                                if (input.value.trim()) {
                                    onUserSelect(input.value.trim());
                                }
                            }}
                        >
                            Search
                        </button>
                    </div>
                    <p className="search-info">Enter any GitHub username to view their profile and repositories</p>
                </div>
            </div>
        </motion.div>
    );
};

export default HomePage;