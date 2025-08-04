const express = require('express');
const FortniteApi = require('./index.js');

const app = express();
const port = process.env.PORT || 3000;

// Enhanced player database with more realistic data for performance testing
const playerDatabase = [
    { username: "free refresh kid", rank: 1, winRate: "99%", kd: "12.4", wins: 2847, kills: 34567, matches: 2875, platform: "PC", country: "FR", skin: "Renegade Raider" },
    { username: "free storm kids", rank: 2, winRate: "99%", kd: "11.8", wins: 2693, kills: 31734, matches: 2721, platform: "PC", country: "FR", skin: "Black Knight" },
    { username: "Twitch matthew1x", rank: 3, winRate: "99%", kd: "13.2", wins: 2541, kills: 33542, matches: 2565, platform: "PC", country: "US", skin: "Skull Trooper" },
    { username: "Ninja", rank: 4, winRate: "85%", kd: "8.9", wins: 2100, kills: 18690, matches: 2470, platform: "PC", country: "US", skin: "Icon Series" },
    { username: "Tfue", rank: 5, winRate: "82%", kd: "9.5", wins: 1987, kills: 18876, matches: 2425, platform: "PC", country: "US", skin: "Crystal" }
];

// Serve optimized static HTML page with performance features
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FastTracker - Lightning Fast Fortnite Stats</title>
        
        <!-- Performance optimizations -->
        <meta name="theme-color" content="#0a0e1a">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        
        <!-- Critical CSS inline for LCP optimization -->
        <style>
            :root {
                --primary-bg: #0a0e1a;
                --secondary-bg: #1a1f3a;
                --accent: #00d4ff;
                --text-primary: #ffffff;
                --text-secondary: #a0a9c0;
                --border: rgba(255, 255, 255, 0.1);
                --success: #22c55e;
                --warning: #f59e0b;
                --error: #ef4444;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: var(--primary-bg);
                color: var(--text-primary);
                line-height: 1.6;
                overflow-x: hidden;
            }
            
            /* Loading bar styles */
            .loading-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(0, 212, 255, 0.1);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .loading-bar.active {
                opacity: 1;
            }
            
            .loading-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent), #06b6d4);
                width: 0%;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px var(--accent);
            }
            
            /* Header optimized for mobile-first */
            .header {
                background: rgba(10, 14, 26, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid var(--border);
                padding: 1rem 0;
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
                height: 70px;
            }
            
            .nav-container {
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 1rem;
            }
            
            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                background: linear-gradient(45deg, var(--accent), #ff6b6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                cursor: pointer;
            }
            
            .nav-links {
                display: none;
                gap: 1rem;
            }
            
            .nav-links.active {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--secondary-bg);
                flex-direction: column;
                padding: 1rem;
                border-bottom: 1px solid var(--border);
            }
            
            .nav-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                color: var(--text-secondary);
                padding: 0.7rem 1.2rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                font-size: 0.875rem;
                text-decoration: none;
                text-align: center;
            }
            
            .nav-btn:hover, .nav-btn.active {
                background: linear-gradient(135deg, #0ea5e9, #06b6d4);
                border-color: #0ea5e9;
                color: var(--text-primary);
                transform: translateY(-1px);
            }
            
            .mobile-menu-btn {
                display: block;
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            /* Hero section optimized for LCP */
            .hero {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8rem 1rem 4rem;
                text-align: center;
                margin-top: 70px;
                min-height: 50vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .hero-content {
                max-width: 800px;
                width: 100%;
            }
            
            .hero h1 {
                font-size: clamp(2rem, 5vw, 4rem);
                font-weight: 900;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #e0e7ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .hero-subtitle {
                font-size: clamp(1rem, 3vw, 1.5rem);
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            
            /* Search section with performance optimizations */
            .search-container {
                position: relative;
                max-width: 500px;
                margin: 0 auto;
            }
            
            .search-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                padding: 1rem 3rem 1rem 1.5rem;
                font-size: 1.1rem;
                color: var(--text-primary);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--accent);
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
            }
            
            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            
            .search-btn {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(135deg, var(--accent), #06b6d4);
                border: none;
                color: var(--text-primary);
                padding: 0.8rem 1.5rem;
                border-radius: 40px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            
            .search-btn:hover {
                transform: translateY(-50%) scale(1.05);
                box-shadow: 0 4px 16px rgba(0, 212, 255, 0.4);
            }
            
            .search-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: translateY(-50%);
            }
            
            /* Platform selector */
            .platform-selector {
                margin: 1.5rem 0;
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .platform-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid var(--border);
                color: var(--text-secondary);
                padding: 0.5rem 1rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .platform-btn.active {
                background: var(--accent);
                color: var(--primary-bg);
                border-color: var(--accent);
            }
            
            /* Autocomplete dropdown */
            .autocomplete-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--secondary-bg);
                border: 1px solid var(--border);
                border-radius: 15px;
                margin-top: 0.5rem;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                display: none;
            }
            
            .autocomplete-dropdown.show {
                opacity: 1;
                transform: translateY(0);
                display: block;
            }
            
            .autocomplete-item {
                padding: 1rem;
                cursor: pointer;
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: background 0.2s ease;
            }
            
            .autocomplete-item:hover {
                background: rgba(0, 212, 255, 0.1);
            }
            
            .autocomplete-item:last-child {
                border-bottom: none;
            }
            
            .player-avatar-small {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, var(--accent), #0ea5e9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            /* Results section */
            .results-section {
                max-width: 1200px;
                margin: 4rem auto;
                padding: 0 1rem;
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.5s ease;
            }
            
            .results-section.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .player-card {
                background: linear-gradient(135deg, var(--secondary-bg) 0%, #2d3561 100%);
                border: 1px solid var(--border);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 2rem;
                position: relative;
                overflow: hidden;
            }
            
            .player-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--accent), #06b6d4);
            }
            
            .player-header {
                display: flex;
                align-items: center;
                gap: 2rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            
            .player-avatar {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--accent), #0ea5e9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .player-info h2 {
                font-size: clamp(1.5rem, 4vw, 2rem);
                margin-bottom: 0.5rem;
            }
            
            .player-rank {
                color: #ffd700;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .player-meta {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0.5rem 0;
                color: var(--text-secondary);
                font-size: 0.9rem;
                flex-wrap: wrap;
            }
            
            /* Stats grid with responsive design */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .stat-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 1.5rem;
                text-align: center;
                transition: transform 0.2s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-2px);
            }
            
            .stat-value {
                font-size: clamp(1.5rem, 3vw, 2rem);
                font-weight: bold;
                color: var(--accent);
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .stat-name {
                color: var(--text-secondary);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            /* Skeleton loading states */
            .skeleton {
                background: linear-gradient(90deg, var(--border) 25%, rgba(255,255,255,0.1) 50%, var(--border) 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 8px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .skeleton-text {
                height: 1rem;
                margin: 0.5rem 0;
            }
            
            .skeleton-title {
                height: 2rem;
                width: 60%;
                margin: 1rem 0;
            }
            
            .skeleton-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            
            /* Error states */
            .error-message {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid var(--error);
                color: var(--error);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
                margin: 2rem 0;
            }
            
            .success-message {
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid var(--success);
                color: var(--success);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
                margin: 2rem 0;
            }
            
            /* Responsive design */
            @media (min-width: 768px) {
                .nav-links {
                    display: flex;
                    position: static;
                    background: none;
                    flex-direction: row;
                    padding: 0;
                    border: none;
                }
                
                .mobile-menu-btn {
                    display: none;
                }
                
                .nav-container {
                    padding: 0 2rem;
                }
                
                .logo {
                    font-size: 1.8rem;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
            }
            
            @media (min-width: 1024px) {
                .hero {
                    padding: 10rem 2rem 6rem;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
            }
            
            /* Utilities */
            .visually-hidden {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <!-- Loading bar -->
        <div class="loading-bar" id="loadingBar">
            <div class="loading-bar-fill" id="loadingBarFill"></div>
        </div>
        
        <!-- Header -->
        <header class="header">
            <nav class="nav-container">
                <div class="logo">⚡ FastTracker</div>
                <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                    ☰
                </button>
                <div class="nav-links" id="navLinks">
                    <a href="#home" class="nav-btn active" onclick="showSection('home')">Home</a>
                    <a href="#search" class="nav-btn" onclick="showSection('search')">Search</a>
                    <a href="#leaderboards" class="nav-btn" onclick="showSection('leaderboards')">Leaderboards</a>
                    <a href="#live" class="nav-btn" onclick="showSection('live')">Live</a>
                    <a href="#compare" class="nav-btn" onclick="showSection('compare')">Compare</a>
                </div>
            </nav>
        </header>
        
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>Lightning Fast Fortnite Stats</h1>
                <p class="hero-subtitle">Get real-time player statistics, leaderboards, and match data faster than ever</p>
                
                <!-- Enhanced search with autocomplete -->
                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search player username..."
                        id="searchInput"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button class="search-btn" onclick="searchPlayer()" id="searchBtn">
                        🔍 Search
                    </button>
                    
                    <!-- Autocomplete dropdown -->
                    <div class="autocomplete-dropdown" id="autocompleteDropdown">
                        <!-- Will be populated by JavaScript -->
                    </div>
                </div>
                
                <!-- Platform selector -->
                <div class="platform-selector">
                    <button class="platform-btn active" data-platform="pc" onclick="selectPlatform('pc')">
                        🖥️ PC
                    </button>
                    <button class="platform-btn" data-platform="xbox" onclick="selectPlatform('xbox')">
                        🎮 Xbox
                    </button>
                    <button class="platform-btn" data-platform="playstation" onclick="selectPlatform('playstation')">
                        🕹️ PlayStation
                    </button>
                    <button class="platform-btn" data-platform="mobile" onclick="selectPlatform('mobile')">
                        📱 Mobile
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Results Section -->
        <section class="results-section" id="resultsSection">
            <!-- Dynamic content will be inserted here -->
        </section>
        
        <!-- Performance optimized JavaScript -->
        <script>
            // Global state management
            const state = {
                currentPlatform: 'pc',
                searchCache: new Map(),
                debounceTimer: null,
                isSearching: false,
                lastSearch: null
            };
            
            // Loading bar controller
            class LoadingBar {
                constructor() {
                    this.element = document.getElementById('loadingBar');
                    this.fill = document.getElementById('loadingBarFill');
                    this.isActive = false;
                }
                
                show() {
                    this.isActive = true;
                    this.element.classList.add('active');
                    this.updateProgress(0);
                }
                
                updateProgress(percent) {
                    if (this.isActive) {
                        this.fill.style.width = percent + '%';
                    }
                }
                
                hide() {
                    this.isActive = false;
                    this.updateProgress(100);
                    setTimeout(() => {
                        this.element.classList.remove('active');
                        this.updateProgress(0);
                    }, 300);
                }
            }
            
            const loadingBar = new LoadingBar();
            
            // Debounced search with caching
            function debounceSearch(func, delay) {
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(state.debounceTimer);
                        func(...args);
                    };
                    clearTimeout(state.debounceTimer);
                    state.debounceTimer = setTimeout(later, delay);
                };
            }
            
            // Enhanced search function with performance optimizations
            async function searchPlayer(username = null) {
                if (state.isSearching) return;
                
                const searchInput = document.getElementById('searchInput');
                const query = username || searchInput.value.trim();
                
                if (!query || query.length < 2) {
                    showError('Please enter a username with at least 2 characters');
                    return;
                }
                
                // Check cache first (15-minute TTL)
                const cacheKey = \`\${query}-\${state.currentPlatform}\`;
                const cached = state.searchCache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
                    displayPlayerData(cached.data);
                    return;
                }
                
                state.isSearching = true;
                loadingBar.show();
                
                try {
                    // Update button state
                    const searchBtn = document.getElementById('searchBtn');
                    searchBtn.disabled = true;
                    searchBtn.textContent = '⏳ Searching...';
                    
                    // Simulate progressive loading
                    loadingBar.updateProgress(20);
                    
                    // Mock API call with realistic timing
                    await new Promise(resolve => setTimeout(resolve, 500));
                    loadingBar.updateProgress(60);
                    
                    // Generate realistic player data
                    const playerData = generatePlayerData(query, state.currentPlatform);
                    loadingBar.updateProgress(90);
                    
                    // Cache the result
                    state.searchCache.set(cacheKey, {
                        data: playerData,
                        timestamp: Date.now()
                    });
                    
                    // Display results
                    displayPlayerData(playerData);
                    loadingBar.updateProgress(100);
                    
                } catch (error) {
                    console.error('Search error:', error);
                    showError('Failed to fetch player data. Please try again.');
                } finally {
                    state.isSearching = false;
                    loadingBar.hide();
                    
                    // Reset button state
                    const searchBtn = document.getElementById('searchBtn');
                    searchBtn.disabled = false;
                    searchBtn.textContent = '🔍 Search';
                }
            }
            
            // Generate realistic player data with performance considerations
            function generatePlayerData(username, platform) {
                const skillLevels = ['casual', 'average', 'skilled', 'pro'];
                const skillLevel = username.toLowerCase().includes('pro') || username.toLowerCase().includes('ttv') ? 'pro' : 
                                 username.toLowerCase().includes('noob') ? 'casual' : 'average';
                
                const baseStats = {
                    casual: { winRate: [5, 15], kd: [0.5, 1.5], matches: [100, 1000] },
                    average: { winRate: [10, 25], kd: [1.0, 2.5], matches: [500, 2000] },
                    skilled: { winRate: [20, 35], kd: [2.0, 4.0], matches: [1000, 5000] },
                    pro: { winRate: [30, 50], kd: [4.0, 12.0], matches: [2000, 10000] }
                };
                
                const stats = baseStats[skillLevel];
                const winRate = Math.random() * (stats.winRate[1] - stats.winRate[0]) + stats.winRate[0];
                const kd = Math.random() * (stats.kd[1] - stats.kd[0]) + stats.kd[0];
                const matches = Math.floor(Math.random() * (stats.matches[1] - stats.matches[0]) + stats.matches[0]);
                const wins = Math.floor(matches * (winRate / 100));
                const kills = Math.floor(matches * kd);
                
                return {
                    username,
                    platform: platform.toUpperCase(),
                    rank: Math.floor(Math.random() * 100000) + 1,
                    level: Math.floor(Math.random() * 500) + 1,
                    winRate: winRate.toFixed(1) + '%',
                    kd: kd.toFixed(2),
                    wins: wins.toLocaleString(),
                    kills: kills.toLocaleString(),
                    matches: matches.toLocaleString(),
                    score: (kills * 50 + wins * 1000).toLocaleString(),
                    playtime: Math.floor(matches * 15 / 60) + 'h',
                    country: ['🇺🇸 US', '🇬🇧 UK', '🇨🇦 CA', '🇩🇪 DE', '🇫🇷 FR'][Math.floor(Math.random() * 5)],
                    skin: ['Renegade Raider', 'Black Knight', 'Skull Trooper', 'Galaxy', 'Travis Scott'][Math.floor(Math.random() * 5)]
                };
            }
            
            // Display player data with optimized rendering
            function displayPlayerData(data) {
                const resultsSection = document.getElementById('resultsSection');
                
                // Use template literals for better performance
                resultsSection.innerHTML = \`
                    <div class="player-card fade-in">
                        <div class="player-header">
                            <div class="player-avatar">\${data.username.charAt(0).toUpperCase()}</div>
                            <div class="player-info">
                                <h2>\${data.username}</h2>
                                <div class="player-rank">#\${data.rank} Global</div>
                                <div class="player-meta">
                                    <span>\${data.country}</span>
                                    <span>•</span>
                                    <span>\${data.platform}</span>
                                    <span>•</span>
                                    <span>Level \${data.level}</span>
                                </div>
                                <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                    Current Skin: \${data.skin}
                                </div>
                            </div>
                        </div>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <span class="stat-value">\${data.wins}</span>
                                <span class="stat-name">Wins</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.kd}</span>
                                <span class="stat-name">K/D Ratio</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.winRate}</span>
                                <span class="stat-name">Win Rate</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.kills}</span>
                                <span class="stat-name">Kills</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.matches}</span>
                                <span class="stat-name">Matches</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.score}</span>
                                <span class="stat-name">Score</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.playtime}</span>
                                <span class="stat-name">Playtime</span>
                            </div>
                        </div>
                    </div>
                \`;
                
                resultsSection.classList.add('show');
                
                // Smooth scroll to results
                resultsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Platform selection
            function selectPlatform(platform) {
                state.currentPlatform = platform;
                
                // Update UI
                document.querySelectorAll('.platform-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.platform === platform);
                });
            }
            
            // Enhanced autocomplete with debouncing
            const debouncedAutocomplete = debounceSearch(showAutocomplete, 200);
            
            function showAutocomplete(query) {
                if (!query || query.length < 2) {
                    hideAutocomplete();
                    return;
                }
                
                // Mock autocomplete data
                const suggestions = [
                    'Ninja', 'Tfue', 'SypherPK', 'Bugha', 'Mongraal',
                    'free refresh kid', 'free storm kids', 'Twitch matthew1x'
                ].filter(name => 
                    name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);
                
                if (suggestions.length === 0) {
                    hideAutocomplete();
                    return;
                }
                
                const dropdown = document.getElementById('autocompleteDropdown');
                dropdown.innerHTML = suggestions.map(suggestion => \`
                    <div class="autocomplete-item" onclick="selectSuggestion('\${suggestion}')">
                        <div class="player-avatar-small">\${suggestion.charAt(0).toUpperCase()}</div>
                        <div>
                            <div style="font-weight: 600;">\${suggestion}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                \${state.currentPlatform.toUpperCase()} Player
                            </div>
                        </div>
                    </div>
                \`).join('');
                
                dropdown.classList.add('show');
            }
            
            function hideAutocomplete() {
                document.getElementById('autocompleteDropdown').classList.remove('show');
            }
            
            function selectSuggestion(username) {
                document.getElementById('searchInput').value = username;
                hideAutocomplete();
                searchPlayer(username);
            }
            
            // Error handling
            function showError(message) {
                const resultsSection = document.getElementById('resultsSection');
                resultsSection.innerHTML = \`
                    <div class="error-message fade-in">
                        ❌ \${message}
                    </div>
                \`;
                resultsSection.classList.add('show');
            }
            
            // Mobile menu toggle
            function toggleMobileMenu() {
                const navLinks = document.getElementById('navLinks');
                navLinks.classList.toggle('active');
            }
            
            // Section navigation (placeholder)
            function showSection(section) {
                console.log('Navigate to:', section);
                // This would handle SPA routing in a full implementation
            }
            
            // Event listeners
            document.addEventListener('DOMContentLoaded', function() {
                const searchInput = document.getElementById('searchInput');
                
                // Enhanced search input handling
                searchInput.addEventListener('input', function(e) {
                    debouncedAutocomplete(e.target.value);
                });
                
                searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        hideAutocomplete();
                        searchPlayer();
                    } else if (e.key === 'Escape') {
                        hideAutocomplete();
                    }
                });
                
                // Hide autocomplete when clicking outside
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.search-container')) {
                        hideAutocomplete();
                    }
                });
                
                // Performance monitoring
                if ('performance' in window) {
                    window.addEventListener('load', function() {
                        setTimeout(function() {
                            const perfData = performance.getEntriesByType('navigation')[0];
                            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                        }, 0);
                    });
                }
            });
            
            // Intersection Observer for lazy loading (future use)
            const observerConfig = {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            };
            
            const lazyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Lazy load content here
                        entry.target.classList.add('fade-in');
                        lazyObserver.unobserve(entry.target);
                    }
                });
            }, observerConfig);
            
            // Service worker registration for caching (production)
            if ('serviceWorker' in navigator && location.protocol === 'https:') {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('SW registered: ', registration);
                    }).catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                    });
                });
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`FastTracker running at http://localhost:${port}`);
  console.log('⚡ Optimized for speed and mobile performance');
});
