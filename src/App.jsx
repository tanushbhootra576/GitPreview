import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import './styles/colorSystem.css'; /* Import first to establish color system */
import './styles/utilities.css'; /* Utility classes and animations */
import './styles/loadingSpinner.css'; /* Loading spinner animation */
import './styles/aiReview.css'; /* AI Review component styles */
import './App.css';
import './components/navbar.css';
import './components/backgroundElements.css';
import './styles/repositories.css';
import './styles/repositoryDetail.css';
import './styles/languageStats.css'; /* Language statistics styling */
import './styles/commits.css'; /* Commits styling */
import './styles/responsiveAdjustments.css'; /* Mobile-specific fixes */

function HomePageWrapper() {
  const navigate = useNavigate();

  const handleUserSelect = (username) => {
    navigate(`/profile/${username}`);
  };

  return <HomePage onUserSelect={handleUserSelect} />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePageWrapper />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
