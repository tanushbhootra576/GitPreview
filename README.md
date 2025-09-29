# GitPreview

A beautiful, modern web application for exploring GitHub profiles, repositories, and user statistics with an elegant user interface and smooth animations.

![GitPreview](https://img.shields.io/badge/React-18+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5+-yellow.svg)
![Responsive](https://img.shields.io/badge/Mobile-Responsive-green.svg)

##  Features

###  **Search & Discovery**
- Real-time GitHub user search with autocomplete suggestions
- Intelligent search results with user avatars and types
- Responsive search interface with beautiful glassmorphism effects

###  **User Profiles**
- Comprehensive user profile display with avatar, bio, and social links
- Interactive statistics cards showing followers, following, and repositories
- Beautiful gradient backgrounds and modern card designs
- Sticky profile sidebar for easy navigation

###  **Repository Exploration**
- Complete repository listing with sorting and filtering options
- Language-based filtering with color-coded indicators
- Repository cards with stars, forks, watchers, and last updated information
- Hover animations and smooth transitions

### 🔬 **Repository Details**
- In-depth repository analysis with language statistics
- Visual language distribution bar with percentages
- Recent commits display with author information and timestamps
- Repository metadata including creation date, size, and default branch
- Direct links to repository and project websites

###  **Modern Design**
- Beautiful gradient backgrounds and glassmorphism effects
- Responsive design that works perfectly on all device sizes
- Smooth animations and hover effects using Framer Motion
- Professional color scheme with CSS custom properties
- Accessible focus states and keyboard navigation

##  Technologies Used

- **React 19** - Latest React with modern hooks and features
- **Vite** - Lightning-fast build tool and development server
- **React Router DOM** - Client-side routing for seamless navigation
- **Axios** - Promise-based HTTP client for GitHub API requests
- **Framer Motion** - Smooth animations and page transitions
- **Heroicons & Lucide React** - Beautiful, consistent icon sets
- **Modern CSS** - Advanced styling with gradients, backdrop filters, and custom properties

##  Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gitpreview.git
   cd gitpreview
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

##  Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be created in the `dist` folder.

##  Project Structure

```
src/
├── components/          # Reusable React components
│   ├── LoadingSpinner.jsx
│   ├── RepositoriesList.jsx
│   ├── RepositoryDetails.jsx
│   ├── SearchBar.jsx
│   ├── UserProfile.jsx
│   └── UserSearchResult.jsx
├── hooks/              # Custom React hooks
│   └── useGitHub.js    # GitHub API hooks
├── pages/              # Page components
│   ├── HomePage.jsx
│   └── ProfilePage.jsx
├── services/           # API services
│   └── github.js       # GitHub API service
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── styles/             # Styling files
├── App.jsx             # Main application component
├── App.css             # Main stylesheet
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

##  Key Features Explained

### Search Functionality
The search feature provides real-time suggestions as you type, with debounced API calls to prevent excessive requests. Search results show user avatars, usernames, and account types.

### Profile Display
User profiles are displayed in a beautiful card format with:
- Large, circular avatar with hover effects
- Comprehensive user information (name, bio, location, company)
- Interactive statistics showing followers, following, and repository counts
- Social links and external website links

### Repository Management
Repositories are displayed in a grid layout with:
- Sortable by name, stars, forks, or last updated
- Filterable by programming language
- Visual language indicators with official language colors
- Quick stats for stars, watchers, and forks

### Repository Details
Detailed repository views include:
- Language usage statistics with visual bar chart
- Recent commit history with author avatars
- Repository metadata and external links
- Responsive design for all screen sizes

## Design Philosophy

The application follows modern web design principles:

- **Glassmorphism**: Semi-transparent elements with backdrop blur effects
- **Gradients**: Beautiful color transitions throughout the interface
- **Micro-interactions**: Subtle hover effects and smooth transitions
- **Typography**: Clean, readable fonts with proper hierarchy
- **Color System**: Consistent color palette using CSS custom properties
- **Responsive First**: Mobile-friendly design that scales beautifully

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.


## Acknowledgments

- GitHub API for providing comprehensive user and repository data
- React team for the amazing framework
- Vite team for the blazing-fast build tool
- All the open-source libraries that made this project possible



---

**Developed by Tanush Bhootra**