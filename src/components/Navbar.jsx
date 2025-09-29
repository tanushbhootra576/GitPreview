import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useGitHubSearch } from "../hooks/useGitHub";
import "./navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const searchInputRef = useRef(null);
    const { results, searchUsers } = useGitHubSearch();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            return;
        }

        // Debounce search query
        const timeoutId = setTimeout(() => {
            searchUsers(value);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    // Handle form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            searchUsers(query);
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="nav-logo">
                    <svg className="nav-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span>GitPreview</span>
                </Link>

                {/* Search (desktop) */}
                <div className="nav-search desktop-only">
                    <form onSubmit={handleSearchSubmit}>
                        <MagnifyingGlassIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search GitHub users..."
                            value={query}
                            onChange={handleSearchChange}
                            ref={searchInputRef}
                        />
                    </form>
                    {/* Results dropdown */}
                    {results.length > 0 && (
                        <div className="search-results">
                            {results.map((user) => (
                                <div
                                    key={user.id}
                                    className="search-item"
                                    onClick={() => {
                                        navigate(`/profile/${user.login}`);
                                        setQuery('');
                                    }}
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt={`${user.login}'s avatar`}
                                        className="search-avatar"
                                    />
                                    <span>{user.login}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Links */}
                <div className="nav-links desktop-only">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                {/* Hamburger */}
                <button className="hamburger" onClick={toggleMenu}>
                    {isOpen ? <XMarkIcon className="icon" /> : <Bars3Icon className="icon" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="mobile-menu">
                    <div className="nav-search mobile-only">
                        <form onSubmit={handleSearchSubmit}>
                            <MagnifyingGlassIcon className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search GitHub users..."
                                value={query}
                                onChange={handleSearchChange}
                            />
                        </form>
                        {results.length > 0 && (
                            <div className="search-results">
                                {results.map((user) => (
                                    <div
                                        key={user.id}
                                        className="search-item"
                                        onClick={() => {
                                            navigate(`/profile/${user.login}`);
                                            setQuery('');
                                            setIsOpen(false);
                                        }}
                                    >
                                        <img
                                            src={user.avatar_url}
                                            alt={`${user.login}'s avatar`}
                                            className="search-avatar"
                                        />
                                        <span>{user.login}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                    <Link to="/about" onClick={toggleMenu}>About</Link>
                    <Link to="/contact" onClick={toggleMenu}>Contact</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
