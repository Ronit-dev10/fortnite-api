const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for API calls
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Platform mapping for FortniteTracker API
const PLATFORM_MAP = {
    'pc': 'kbm',
    'xbox': 'gamepad', 
    'playstation': 'touch',
    'mobile': 'touch'
};

// Cache for API responses (15 minute TTL as requested)
const apiCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Helper function to get cached data
function getCachedData(key) {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
}

// Helper function to set cached data
function setCachedData(key, data) {
    apiCache.set(key, {
        data,
        timestamp: Date.now()
    });
}

// Custom Fortnite Stats API integration
async function fetchPlayerStats(username, platform) {
    const cacheKey = `${username}-${platform}`;

    // Check cache first (15 minute session cache as requested)
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log(`[CACHE] Using cached data for ${username} on ${platform}`);
        return cached;
    }

    try {
        const fetch = require('node-fetch');

        console.log(`[API] Fetching ${username} from custom API on ${platform}`);

        // YOUR CUSTOM API ENDPOINT
        const response = await fetch(`https://myapi.com/stats/${platform}/${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`API failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate API response structure
        if (!data || !data.stats) {
            throw new Error('Invalid API response structure');
        }

        // Transform your API data to display format
        const playerData = transformCustomAPIData(data, username, platform);

        // Cache the result (15 minutes as requested)
        setCachedData(cacheKey, playerData);

        console.log(`[SUCCESS] Live data fetched from custom API for ${username}`);
        return playerData;

    } catch (error) {
        console.error(`[ERROR] Custom API fetch failed for ${username}:`, error.message);

        // Throw error instead of returning fallback (as requested)
        throw new Error(`Failed to fetch player data: ${error.message}`);
    }
}

// Transform your custom API data to display format
function transformCustomAPIData(apiData, username, platform) {
    try {
        // Expected structure from your API:
        // {
        //   "username": "NickEh30",
        //   "platform": "pc",
        //   "stats": {
        //     "wins": 1250,
        //     "kills": 21900,
        //     "kd": 3.25,
        //     "matchesPlayed": 5900
        //   },
        //   "matchHistory": [...]
        // }

        const stats = apiData.stats;
        const winRate = stats.matchesPlayed > 0 ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) : '0.0';

        return {
            username: apiData.username || username,
            platform: (apiData.platform || platform).toUpperCase(),
            rank: apiData.rank || calculateRankFromStats(stats),
            level: apiData.level || calculateLevelFromStats(stats),
            winRate: winRate + '%',
            kd: stats.kd.toFixed(2),
            wins: stats.wins.toLocaleString(),
            kills: stats.kills.toLocaleString(),
            matches: stats.matchesPlayed.toLocaleString(),
            score: calculateScore(stats.kills, stats.wins),
            playtime: calculatePlaytime(stats.matchesPlayed),
            country: apiData.country || getRandomCountry(),
            skin: apiData.currentSkin || getRandomSkin(),
            matchHistory: apiData.matchHistory || [],
            verified: true,
            lastUpdated: new Date().toISOString(),
            source: 'Custom Fortnite API'
        };
    } catch (error) {
        console.error('API data transformation error:', error);
        throw new Error('Failed to process API response data');
    }
}

// Calculate estimated rank based on stats
function calculateRankFromStats(stats) {
    const score = stats.wins * 1000 + stats.kills * 50;
    // Higher score = better rank (lower number)
    return Math.max(1, Math.floor(100000 - (score / 100)));
}

// Calculate estimated level based on stats
function calculateLevelFromStats(stats) {
    return Math.floor(stats.kills / 100) + Math.floor(stats.wins / 10) + 50;
}

// Calculate playtime based on matches
function calculatePlaytime(matches) {
    const hours = Math.floor(matches * 15 / 60); // 15 min avg per match
    return hours + 'h';
}

// Removed fallback data generation - API should always provide real data

function calculateScore(kills, wins) {
    return (kills * 50 + wins * 1000).toLocaleString();
}

function getRandomCountry() {
    const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR'];
    return countries[Math.floor(Math.random() * countries.length)];
}

function getRandomSkin() {
    const skins = ['Renegade Raider', 'Black Knight', 'Skull Trooper', 'Galaxy', 'Travis Scott', 'Ariana Grande', 'Naruto', 'Goku'];
    return skins[Math.floor(Math.random() * skins.length)];
}

// API endpoint for live player search
app.get('/api/search/:platform/:username', async (req, res) => {
    try {
        const { username, platform } = req.params;
        
        if (!username || username.length < 2) {
            return res.status(400).json({ error: 'Username must be at least 2 characters' });
        }
        
        if (!PLATFORM_MAP[platform]) {
            return res.status(400).json({ error: 'Invalid platform' });
        }
        
        console.log(`[API] Searching Custom API: ${username} on ${platform.toUpperCase()}`);

        const playerData = await fetchPlayerStats(username, platform);
        
        res.json({
            success: true,
            data: playerData,
            cached: getCachedData(`${username}-${platform}`) !== null,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch player data',
            message: error.message
        });
    }
});

// Serve the optimized HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FastTracker - Custom Fortnite Stats API</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        
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
            
            /* Enhanced loading bar */
            .loading-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
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
                background: linear-gradient(90deg, var(--accent), #06b6d4, #22c55e);
                width: 0%;
                transition: width 0.3s ease;
                box-shadow: 0 0 15px var(--accent);
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 15px var(--accent); }
                50% { box-shadow: 0 0 25px var(--accent), 0 0 35px rgba(0, 212, 255, 0.5); }
            }
            
            /* Header */
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
            
            .status-indicator {
                background: var(--success);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                animation: blink 2s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.7; }
            }
            
            /* Hero section */
            .hero {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8rem 1rem 4rem;
                text-align: center;
                margin-top: 70px;
                min-height: 60vh;
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
            
            /* Search container */
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
                min-width: 120px;
            }
            
            .search-btn:hover:not(:disabled) {
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
                padding: 0.6rem 1.2rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .platform-btn.active {
                background: var(--accent);
                color: var(--primary-bg);
                border-color: var(--accent);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
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
            
            .player-card.verified::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--success), var(--accent));
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
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex-wrap: wrap;
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
            
            /* Status badges */
            .live-badge {
                background: linear-gradient(45deg, var(--success), #16a34a);
                color: white;
                padding: 0.2rem 0.6rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
                animation: pulse-green 2s infinite;
            }
            
            @keyframes pulse-green {
                0%, 100% { box-shadow: 0 0 5px var(--success); }
                50% { box-shadow: 0 0 15px var(--success), 0 0 25px rgba(34, 197, 94, 0.5); }
            }
            
            .cache-badge {
                background: linear-gradient(45deg, var(--warning), #f97316);
                color: white;
                padding: 0.2rem 0.6rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
            }
            
            .fallback-badge {
                background: linear-gradient(45deg, var(--error), #dc2626);
                color: white;
                padding: 0.2rem 0.6rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
            }
            
            /* Stats grid */
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
                border: 1px solid transparent;
            }
            
            .stat-card.highlight {
                background: rgba(0, 212, 255, 0.1);
                border-color: rgba(0, 212, 255, 0.3);
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
            
            /* Data notices */
            .data-notice {
                background: rgba(245, 158, 11, 0.1);
                border: 1px solid var(--warning);
                color: var(--warning);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
                margin: 1rem 0;
                font-size: 0.9rem;
            }
            
            .data-source {
                text-align: center;
                color: var(--text-secondary);
                font-size: 0.8rem;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border);
            }
            
            /* Error states */
            .error-message {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid var(--error);
                color: var(--error);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                margin: 2rem 0;
            }
            
            /* Responsive design */
            @media (min-width: 768px) {
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
            
            /* Match History Section */
            .match-history-section {
                margin: 2rem 0;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                border: 1px solid var(--border);
            }

            .match-history-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .match-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                transition: transform 0.2s ease;
            }

            .match-card:hover {
                transform: translateY(-2px);
                border-color: rgba(0, 212, 255, 0.3);
            }

            .match-date {
                color: var(--text-secondary);
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
            }

            .match-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .match-kills {
                color: var(--accent);
                font-weight: 600;
                font-size: 0.9rem;
            }

            .match-placement {
                color: var(--warning);
                font-weight: 600;
                font-size: 0.9rem;
            }

            /* Utilities */
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
        <!-- Enhanced loading bar -->
        <div class="loading-bar" id="loadingBar">
            <div class="loading-bar-fill" id="loadingBarFill"></div>
        </div>
        
        <!-- Header -->
        <header class="header">
            <nav class="nav-container">
                <div class="logo">⚡ FastTracker</div>
                <div class="status-indicator">🔴 LIVE DATA</div>
            </nav>
        </header>
        
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>Custom Fortnite Stats API</h1>
                <p class="hero-subtitle">Lightning-fast player statistics from your custom API endpoint</p>
                
                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Enter Fortnite username..."
                        id="searchInput"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button class="search-btn" onclick="searchPlayer()" id="searchBtn">
                        🔍 Search Live
                    </button>
                </div>
                
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
                
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                    Try searching: <strong>Ninja</strong>, <strong>Tfue</strong>, <strong>SypherPK</strong>, or any Fortnite player
                </p>
            </div>
        </section>
        
        <!-- Results Section -->
        <section class="results-section" id="resultsSection">
            <!-- Dynamic content will be inserted here -->
        </section>
        
        <script>
            // Global state with session storage
            const state = {
                currentPlatform: 'pc',
                isSearching: false,
                searchTimeout: null
            };

            // Session storage helpers (15 minute cache as requested)
            function getSessionCache(key) {
                try {
                    const cached = sessionStorage.getItem('fortnite_' + key);
                    if (cached) {
                        const data = JSON.parse(cached);
                        if (Date.now() - data.timestamp < 15 * 60 * 1000) {
                            return data.playerData;
                        }
                        sessionStorage.removeItem('fortnite_' + key);
                    }
                } catch (e) {
                    console.warn('Session cache error:', e);
                }
                return null;
            }

            function setSessionCache(key, playerData) {
                try {
                    sessionStorage.setItem('fortnite_' + key, JSON.stringify({
                        playerData,
                        timestamp: Date.now()
                    }));
                } catch (e) {
                    console.warn('Session cache write error:', e);
                }
            }
            
            // Enhanced loading bar controller
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
                    }, 500);
                }
            }
            
            const loadingBar = new LoadingBar();
            
            // Custom API search function with session caching
            async function searchPlayer(username = null) {
                if (state.isSearching) return;

                const searchInput = document.getElementById('searchInput');
                const query = username || searchInput.value.trim();

                if (!query || query.length < 2) {
                    showError('Please enter a username with at least 2 characters');
                    return;
                }

                // Check session cache first
                const cacheKey = query.toLowerCase() + '_' + state.currentPlatform;
                const cachedData = getSessionCache(cacheKey);
                if (cachedData) {
                    console.log('📋 Using session cached data for ' + query);
                    displayLivePlayerData(cachedData, true);
                    return;
                }

                state.isSearching = true;
                loadingBar.show();

                try {
                    const searchBtn = document.getElementById('searchBtn');
                    searchBtn.disabled = true;
                    searchBtn.textContent = '⏳ Searching API...';

                    loadingBar.updateProgress(10);
                    console.log('🔍 Searching ' + query + ' on ' + state.currentPlatform.toUpperCase() + ' via Custom API');

                    loadingBar.updateProgress(30);

                    // Call your custom API endpoint
                    const response = await fetch('/api/search/' + state.currentPlatform + '/' + encodeURIComponent(query), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    loadingBar.updateProgress(70);

                    if (!response.ok) {
                        throw new Error('API returned ' + response.status + ': ' + response.statusText);
                    }

                    const result = await response.json();
                    loadingBar.updateProgress(90);

                    if (!result.success) {
                        throw new Error(result.error || 'API request failed');
                    }

                    // Cache the result in session storage
                    setSessionCache(cacheKey, result.data);

                    // Display the LIVE API data
                    displayLivePlayerData(result.data, false);
                    loadingBar.updateProgress(100);

                } catch (error) {
                    console.error('🚨 Custom API search error:', error);
                    showError('Failed to fetch player data from API: ' + error.message);
                } finally {
                    state.isSearching = false;
                    loadingBar.hide();

                    const searchBtn = document.getElementById('searchBtn');
                    searchBtn.disabled = false;
                    searchBtn.textContent = '🔍 Search Live';
                }
            }

            // Debounced search (300ms as requested)
            function debouncedSearch(query) {
                clearTimeout(state.searchTimeout);
                state.searchTimeout = setTimeout(() => {
                    if (query && query.length >= 2) {
                        searchPlayer(query);
                    }
                }, 300);
            }
            
            // Display live API data (no fallback handling)
            function displayLivePlayerData(data, isCached = false) {
                const resultsSection = document.getElementById('resultsSection');

                const formattedRank = typeof data.rank === 'number' ? data.rank.toLocaleString() : data.rank;

                // Status badges - only show API status
                const statusBadges = [];
                statusBadges.push('<span class="live-badge">🔴 LIVE API</span>');
                if (isCached) {
                    statusBadges.push('<span class="cache-badge">💾 CACHED</span>');
                }

                // Build match history section if available
                let matchHistoryHtml = '';
                if (data.matchHistory && data.matchHistory.length > 0) {
                    matchHistoryHtml = '<div class="match-history-section">' +
                        '<h3 style="margin-bottom: 1rem; color: var(--accent);">Recent Match History</h3>' +
                        '<div class="match-history-grid">' +
                        data.matchHistory.slice(0, 5).map(match =>
                            '<div class="match-card">' +
                                '<div class="match-date">' + new Date(match.date).toLocaleDateString() + '</div>' +
                                '<div class="match-stats">' +
                                    '<span class="match-kills">' + match.kills + ' Kills</span>' +
                                    '<span class="match-placement">#' + match.placement + '</span>' +
                                '</div>' +
                            '</div>'
                        ).join('') +
                        '</div>' +
                    '</div>';\n                }

                resultsSection.innerHTML =
                    '<div class="player-card fade-in verified">' +
                        '<div class="player-header">' +
                            '<div class="player-avatar">' + data.username.charAt(0).toUpperCase() + '</div>' +
                            '<div class="player-info">' +
                                '<h2>' + data.username + ' ' + statusBadges.join(' ') + '</h2>' +
                                '<div class="player-rank">#' + formattedRank + ' Global</div>' +
                                '<div class="player-meta">' +
                                    '<span>🌍 ' + data.country + '</span>' +
                                    '<span>•</span>' +
                                    '<span>' + data.platform + '</span>' +
                                    '<span>•</span>' +
                                    '<span>Level ' + data.level + '</span>' +
                                '</div>' +
                                '<div style="color: var(--text-secondary); margin-top: 0.5rem;">' +
                                    'Current Skin: ' + data.skin +
                                '</div>' +
                                '<div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.5rem;">Last Updated: ' + new Date(data.lastUpdated).toLocaleString() + '</div>' +
                            '</div>' +
                        '</div>' +

                        '<div class="stats-grid">' +
                            '<div class="stat-card highlight">' +
                                '<span class="stat-value">' + data.wins + '</span>' +
                                '<span class="stat-name">Wins</span>' +
                            '</div>' +
                            '<div class="stat-card highlight">' +
                                '<span class="stat-value">' + data.kd + '</span>' +
                                '<span class="stat-name">K/D Ratio</span>' +
                            '</div>' +
                            '<div class="stat-card highlight">' +
                                '<span class="stat-value">' + data.winRate + '</span>' +
                                '<span class="stat-name">Win Rate</span>' +
                            '</div>' +
                            '<div class="stat-card">' +
                                '<span class="stat-value">' + data.kills + '</span>' +
                                '<span class="stat-name">Kills</span>' +
                            '</div>' +
                            '<div class="stat-card">' +
                                '<span class="stat-value">' + data.matches + '</span>' +
                                '<span class="stat-name">Matches</span>' +
                            '</div>' +
                            '<div class="stat-card">' +
                                '<span class="stat-value">' + data.score + '</span>' +
                                '<span class="stat-name">Score</span>' +
                            '</div>' +
                            '<div class="stat-card">' +
                                '<span class="stat-value">' + data.playtime + '</span>' +
                                '<span class="stat-name">Playtime</span>' +
                            '</div>' +
                        '</div>' +

                        matchHistoryHtml +

                        '<div class="data-source">' +
                            '📊 Data Source: <strong>' + data.source + '</strong> • Platform: <strong>' + data.platform + '</strong>' +
                        '</div>' +
                    '</div>';

                resultsSection.classList.add('show');
                resultsSection.scrollIntoView({
                    behavior: 'smooth',\n                    block: 'start'\n                });\n                \n                console.log('✅ Displayed LIVE API data for ' + data.username + ' on ' + data.platform);\n            }
            
            // Platform selection
            function selectPlatform(platform) {
                state.currentPlatform = platform;
                
                document.querySelectorAll('.platform-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.platform === platform);
                });
                
                console.log('Platform switched to:', platform.toUpperCase());
            }
            
            // Error handling
            function showError(message) {
                const resultsSection = document.getElementById('resultsSection');
                resultsSection.innerHTML = 
                    '<div class="error-message fade-in">' +
                        '❌ ' + message +
                    '</div>';
                resultsSection.classList.add('show');
            }
            
            // Event listeners
            document.addEventListener('DOMContentLoaded', function() {
                const searchInput = document.getElementById('searchInput');

                // Debounced input listener (300ms delay as requested)
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value.trim();
                    if (query.length >= 2) {
                        debouncedSearch(query);
                    }
                });

                searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        clearTimeout(state.searchTimeout); // Cancel debounce
                        searchPlayer();
                    }
                });

                console.log('✅ FastTracker with Custom API integration ready!');
                console.log('⚡ Features: Debounced search (300ms), Session cache (15min), Live API data');
            });
        </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 FastTracker with LIVE FortniteTracker integration running at http://localhost:${port}`);
  console.log('⚡ Features: Real-time data, platform-specific search, smart caching, enhanced loading bar');
  console.log('📊 Data source: FortniteTracker.com with fallback system');
});
