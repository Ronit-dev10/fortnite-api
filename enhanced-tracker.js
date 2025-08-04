const express = require('express');
const axios = require('axios');
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

// FortniteTracker API configuration
const FORTNITE_TRACKER_API = {
  baseURL: 'https://api.fortnitetracker.com/v1',
  // Replace with your actual TRN API key
  apiKey: process.env.TRN_API_KEY || 'YOUR_TRN_API_KEY_HERE',
};

// Platform mapping for FortniteTracker API
const PLATFORM_MAP = {
  pc: 'pc',
  xbox: 'xbl',
  playstation: 'psn',
  mobile: 'touch',
};

// Cache for API responses (15 minute TTL)
const apiCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Helper function to get cached data
function getCachedData(key) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  apiCache.delete(key); // Remove expired cache
  return null;
}

// Helper function to set cached data
function setCachedData(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Real FortniteTracker API integration
async function fetchRealPlayerStats(username, platform) {
  const cacheKey = `${username}-${platform}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`[CACHE] Using cached data for ${username} on ${platform}`);
    return cached;
  }

  try {
    const mappedPlatform = PLATFORM_MAP[platform];
    if (!mappedPlatform) {
      throw new Error(`Invalid platform: ${platform}`);
    }

    console.log(`[API] Fetching real data for ${username} on ${mappedPlatform}`);

    const response = await axios.get(
      `${FORTNITE_TRACKER_API.baseURL}/profile/${mappedPlatform}/${encodeURIComponent(username)}`,
      {
        headers: {
          'TRN-Api-Key': FORTNITE_TRACKER_API.apiKey,
          'User-Agent': 'FortniteTracker-API-Client/1.0',
        },
        timeout: 10000, // 10 second timeout
      },
    );

    if (!response.data || !response.data.epicUserHandle) {
      throw new Error('Player not found on FortniteTracker');
    }

    const playerData = parseFortniteTrackerResponse(response.data, platform);

    // Cache the result
    setCachedData(cacheKey, playerData);

    return playerData;
  } catch (error) {
    console.error(`[ERROR] FortniteTracker API failed for ${username}:`, error.message);

    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Player not found on FortniteTracker');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.response.status === 401) {
        throw new Error('Invalid API key');
      }
    }

    throw new Error(`Failed to fetch player data: ${error.message}`);
  }
}

// Parse FortniteTracker API response
function parseFortniteTrackerResponse(data, platform) {
  const stats = data.stats || {};

  // Get Solo stats (p2) as primary, with fallbacks to other modes
  const soloStats = stats.p2 || {};
  const duoStats = stats.p10 || {};
  const squadStats = stats.p9 || {};

  // Current season stats if available
  const currentSoloStats = stats.curr_p2 || soloStats;

  // Extract key stats with proper fallbacks
  const kills = getSafeStat(currentSoloStats.kills) || getSafeStat(soloStats.kills) || 0;
  const matches = getSafeStat(currentSoloStats.matches) || getSafeStat(soloStats.matches) || 0;
  const wins = getSafeStat(currentSoloStats.top1) || getSafeStat(soloStats.top1) || 0;
  const kd = getSafeStat(currentSoloStats.kd) || getSafeStat(soloStats.kd) || 0;
  const score = getSafeStat(currentSoloStats.score) || getSafeStat(soloStats.score) || 0;

  // Calculate additional stats
  const winRate = matches > 0 ? ((wins / matches) * 100).toFixed(1) : '0.0';
  const playtime =
    getSafeStat(currentSoloStats.minutesPlayed) || getSafeStat(soloStats.minutesPlayed) || 0;
  const playtimeHours = Math.floor(playtime / 60);

  return {
    username: data.epicUserHandle,
    platform: platform.toUpperCase(),
    platformName: data.platformName || platform.toUpperCase(),
    level: getSafeStat(data.lifeTimeStats?.find(s => s.key === 'Level')?.value) || 0,
    kills: kills.toLocaleString(),
    matches: matches.toLocaleString(),
    wins: wins.toLocaleString(),
    kd: typeof kd === 'number' ? kd.toFixed(2) : '0.00',
    winRate: winRate + '%',
    score: score.toLocaleString(),
    playtime: playtimeHours > 0 ? playtimeHours + 'h' : Math.floor(playtime) + 'm',
    lastUpdated: new Date().toISOString(),
    source: 'FortniteTracker.com',
    raw: {
      solo: soloStats,
      duo: duoStats,
      squad: squadStats,
      current: currentSoloStats,
    },
  };
}

// Helper function to safely extract stat values
function getSafeStat(stat) {
  if (!stat) return null;
  if (typeof stat === 'object' && stat.value !== undefined) {
    return typeof stat.value === 'string' ? parseFloat(stat.value.replace(/,/g, '')) : stat.value;
  }
  return typeof stat === 'string' ? parseFloat(stat.replace(/,/g, '')) : stat;
}

// Main search endpoint
app.get('/api/search/:platform/:username', async (req, res) => {
  try {
    const { username, platform } = req.params;

    if (!username || username.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 2 characters',
      });
    }

    if (!PLATFORM_MAP[platform]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform. Use: pc, xbox, playstation, or mobile',
      });
    }

    console.log(`[API] Searching real FortniteTracker: ${username} on ${platform.toUpperCase()}`);

    const playerData = await fetchRealPlayerStats(username, platform);

    res.json({
      success: true,
      data: playerData,
      cached: getCachedData(`${username}-${platform}`) !== null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search API error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    apiKey: FORTNITE_TRACKER_API.apiKey ? 'configured' : 'missing',
    cache: {
      entries: apiCache.size,
      ttl: CACHE_TTL / 1000 + 's',
    },
  });
});

// Serve the HTML page with real API integration
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FortniteTracker - Real Player Stats</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --bg-primary: #0f1419;
                --bg-secondary: #1a1e2e;
                --bg-card: #1e2329;
                --text-primary: #ffffff;
                --text-secondary: #8b949e;
                --text-muted: #656d76;
                --accent-blue: #1f6feb;
                --accent-orange: #fb8500;
                --border: #21262d;
                --success: #238636;
                --warning: #9e6a03;
                --error: #da3633;
                --shadow: rgba(0, 0, 0, 0.5);
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: var(--bg-primary);
                color: var(--text-primary);
                line-height: 1.5;
                min-height: 100vh;
            }
            
            /* Header */
            .header {
                background: var(--bg-secondary);
                border-bottom: 1px solid var(--border);
                padding: 1rem 0;
                position: sticky;
                top: 0;
                z-index: 100;
                box-shadow: 0 1px 3px var(--shadow);
            }
            
            .nav-container {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 1.5rem;
            }
            
            .logo {
                font-size: 1.75rem;
                font-weight: 800;
                color: var(--accent-orange);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            /* Search Section */
            .search-section {
                background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-card) 100%);
                padding: 4rem 1.5rem;
                text-align: center;
                border-bottom: 1px solid var(--border);
            }
            
            .search-title {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
                color: var(--text-primary);
            }
            
            .search-subtitle {
                color: var(--text-secondary);
                margin-bottom: 3rem;
                font-size: 1.1rem;
            }
            
            .search-form {
                max-width: 600px;
                margin: 0 auto;
                position: relative;
            }
            
            .search-input {
                width: 100%;
                background: var(--bg-card);
                border: 2px solid var(--border);
                border-radius: 12px;
                padding: 1rem 1.25rem 1rem 3.5rem;
                font-size: 1.1rem;
                color: var(--text-primary);
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--accent-blue);
                box-shadow: 0 0 0 4px rgba(31, 111, 235, 0.1);
                transform: translateY(-2px);
            }
            
            .search-input::placeholder {
                color: var(--text-muted);
            }
            
            .search-icon {
                position: absolute;
                left: 1.25rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-muted);
                font-size: 1.25rem;
            }
            
            .platform-selector {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            }
            
            .platform-btn {
                background: var(--bg-card);
                border: 2px solid var(--border);
                color: var(--text-secondary);
                padding: 0.75rem 1.25rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.95rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .platform-btn:hover {
                border-color: var(--accent-blue);
                color: var(--text-primary);
                transform: translateY(-2px);
            }
            
            .platform-btn.active {
                background: var(--accent-blue);
                border-color: var(--accent-blue);
                color: white;
                transform: translateY(-2px);
            }
            
            /* Loading Bar */
            .loading-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: var(--bg-secondary);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .loading-bar.active {
                opacity: 1;
            }
            
            .loading-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-blue), var(--accent-orange));
                width: 0%;
                transition: width 0.4s ease;
                box-shadow: 0 0 10px var(--accent-blue);
            }
            
            .loading-info {
                position: fixed;
                top: 1.5rem;
                right: 1.5rem;
                background: var(--bg-card);
                border: 2px solid var(--border);
                border-radius: 12px;
                padding: 1rem 1.25rem;
                font-size: 0.9rem;
                color: var(--text-primary);
                z-index: 1001;
                opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 8px 24px var(--shadow);
                min-width: 200px;
            }
            
            .loading-info.active {
                opacity: 1;
                transform: scale(1.02);
            }
            
            .loading-percent {
                font-weight: 700;
                color: var(--accent-orange);
                font-size: 1.1rem;
            }
            
            /* Content */
            .main-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 3rem 1.5rem;
            }
            
            /* Player Card */
            .player-card {
                background: var(--bg-card);
                border: 2px solid var(--border);
                border-radius: 16px;
                padding: 2.5rem;
                margin-bottom: 2rem;
                box-shadow: 0 4px 12px var(--shadow);
                transition: all 0.3s ease;
            }
            
            .player-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px var(--shadow);
            }
            
            .player-header {
                display: flex;
                align-items: center;
                gap: 2rem;
                margin-bottom: 2.5rem;
                flex-wrap: wrap;
            }
            
            .player-avatar {
                width: 90px;
                height: 90px;
                background: linear-gradient(135deg, var(--accent-blue), var(--accent-orange));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                font-weight: 800;
                color: white;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
            }
            
            .player-info {
                flex: 1;
                min-width: 250px;
            }
            
            .player-name {
                font-size: 1.75rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex-wrap: wrap;
            }
            
            .live-badge {
                background: linear-gradient(45deg, var(--success), #16a34a);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .cached-badge {
                background: linear-gradient(45deg, var(--warning), #f97316);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .player-meta {
                color: var(--text-secondary);
                font-size: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
                margin-bottom: 0.5rem;
            }
            
            .player-platform {
                background: var(--bg-secondary);
                color: var(--accent-orange);
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
            }
            
            /* Stats Grid */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .stat-card {
                background: var(--bg-secondary);
                border: 2px solid var(--border);
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--accent-blue), var(--accent-orange));
            }
            
            .stat-card:hover {
                border-color: var(--accent-blue);
                transform: translateY(-4px);
                box-shadow: 0 8px 24px var(--shadow);
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: 800;
                color: var(--text-primary);
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .stat-label {
                color: var(--text-secondary);
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            /* Error States */
            .error-card {
                background: var(--bg-card);
                border: 2px solid var(--error);
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                color: var(--error);
            }
            
            .error-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }
            
            .error-message {
                font-size: 1rem;
                color: var(--text-secondary);
            }
            
            /* Success States */
            .success-card {
                background: var(--bg-card);
                border: 2px solid var(--success);
                border-radius: 12px;
                padding: 2rem;
                text-align: center;
                color: var(--success);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .search-section {
                    padding: 3rem 1rem;
                }
                
                .search-title {
                    font-size: 2rem;
                }
                
                .player-header {
                    text-align: center;
                    flex-direction: column;
                }
                
                .player-meta {
                    justify-content: center;
                }
                
                .platform-selector {
                    gap: 0.5rem;
                }
                
                .platform-btn {
                    padding: 0.6rem 1rem;
                    font-size: 0.85rem;
                }
            }
            
            /* Utilities */
            .fade-in {
                animation: fadeIn 0.6s ease-in-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .hidden {
                display: none !important;
            }
        </style>
    </head>
    <body>
        <!-- Loading Bar -->
        <div class="loading-bar" id="loadingBar">
            <div class="loading-fill" id="loadingFill"></div>
        </div>
        
        <div class="loading-info" id="loadingInfo">
            <div><span id="loadingText">Loading...</span></div>
            <div><span class="loading-percent" id="loadingPercent">0%</span></div>
        </div>
        
        <!-- Header -->
        <header class="header">
            <nav class="nav-container">
                <div class="logo">
                    🎮 FortniteTracker
                </div>
            </nav>
        </header>
        
        <!-- Search Section -->
        <section class="search-section">
            <h1 class="search-title">Real Fortnite Player Statistics</h1>
            <p class="search-subtitle">Search any Fortnite player and view their live statistics from FortniteTracker.com</p>
            
            <div class="search-form">
                <div style="position: relative;">
                    <span class="search-icon">🔍</span>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Enter Fortnite username..."
                        id="searchInput"
                        autocomplete="off"
                    >
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
            </div>
        </section>
        
        <!-- Main Content -->
        <main class="main-content">
            <div id="playerResults"></div>
        </main>
        
        <script>
            // Global state
            let currentPlatform = 'pc';
            let isSearching = false;
            let searchTimeout = null;
            
            // Loading bar controller
            class LoadingController {
                constructor() {
                    this.bar = document.getElementById('loadingBar');
                    this.fill = document.getElementById('loadingFill');
                    this.info = document.getElementById('loadingInfo');
                    this.text = document.getElementById('loadingText');
                    this.percent = document.getElementById('loadingPercent');
                    this.startTime = 0;
                }
                
                show(message = 'Loading...') {
                    this.startTime = Date.now();
                    this.bar.classList.add('active');
                    this.info.classList.add('active');
                    this.text.textContent = message;
                    this.updateProgress(0);
                }
                
                updateProgress(percentage, message) {
                    this.fill.style.width = percentage + '%';
                    this.percent.textContent = Math.round(percentage) + '%';
                    if (message) {
                        this.text.textContent = message;
                    }
                }
                
                hide() {
                    this.updateProgress(100, 'Complete!');
                    setTimeout(() => {
                        this.bar.classList.remove('active');
                        this.info.classList.remove('active');
                    }, 800);
                }
            }
            
            const loading = new LoadingController();
            
            // Platform selection
            function selectPlatform(platform) {
                currentPlatform = platform;
                document.querySelectorAll('.platform-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.platform === platform);
                });
                console.log('Platform selected:', platform.toUpperCase());
            }
            
            // Debounced search function
            function debouncedSearch() {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(() => {
                    searchPlayer();
                }, 300); // 300ms debounce
            }
            
            // Search functionality with real API integration
            async function searchPlayer() {
                if (isSearching) return;
                
                const query = document.getElementById('searchInput').value.trim();
                if (!query || query.length < 2) {
                    showError('Player Not Found', 'Please enter a username with at least 2 characters');
                    return;
                }
                
                isSearching = true;
                loading.show('Connecting to FortniteTracker...');
                
                try {
                    loading.updateProgress(20, 'Searching player database...');
                    
                    // Simulate connection time for better UX
                    await new Promise(resolve => setTimeout(resolve, 400));
                    loading.updateProgress(40, 'Fetching live statistics...');
                    
                    const response = await fetch(\`/api/search/\${currentPlatform}/\${encodeURIComponent(query)}\`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    loading.updateProgress(70, 'Processing player data...');
                    
                    const result = await response.json();
                    
                    loading.updateProgress(90, 'Rendering statistics...');
                    
                    if (result.success) {
                        displayPlayerData(result.data, result.cached);
                    } else {
                        showError('Player Not Found', result.error);
                    }
                    
                } catch (error) {
                    console.error('Search error:', error);
                    showError('Connection Error', 'Failed to connect to FortniteTracker. Please try again.');
                } finally {
                    isSearching = false;
                    loading.hide();
                }
            }
            
            // Display real player data
            function displayPlayerData(data, isCached = false) {
                const container = document.getElementById('playerResults');
                
                const badges = [];
                badges.push('<span class="live-badge">🔴 LIVE DATA</span>');
                if (isCached) {
                    badges.push('<span class="cached-badge">💾 CACHED</span>');
                }
                
                container.innerHTML = \`
                    <div class="player-card fade-in">
                        <div class="player-header">
                            <div class="player-avatar">\${data.username.charAt(0).toUpperCase()}</div>
                            <div class="player-info">
                                <div class="player-name">
                                    \${data.username}
                                    \${badges.join(' ')}
                                </div>
                                <div class="player-meta">
                                    <span class="player-platform">\${data.platformName}</span>
                                    <span>•</span>
                                    <span>Level \${data.level || 'Unknown'}</span>
                                </div>
                                <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
                                    Last Updated: \${new Date(data.lastUpdated).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        
                        <div class="stats-grid">
                            <div class="stat-card">
                                <span class="stat-value">\${data.wins}</span>
                                <span class="stat-label">Total Wins</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.kd}</span>
                                <span class="stat-label">K/D Ratio</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.winRate}</span>
                                <span class="stat-label">Win Rate</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.kills}</span>
                                <span class="stat-label">Total Kills</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.matches}</span>
                                <span class="stat-label">Matches Played</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.score}</span>
                                <span class="stat-label">Total Score</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-value">\${data.playtime}</span>
                                <span class="stat-label">Time Played</span>
                            </div>
                        </div>
                        
                        <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding-top: 1.5rem; border-top: 2px solid var(--border);">
                            📊 Data Source: <strong>\${data.source}</strong> • Platform: <strong>\${data.platformName}</strong>
                        </div>
                    </div>
                \`;
                
                console.log('✅ Displayed real player data for', data.username);
            }
            
            // Error handling
            function showError(title, message) {
                const container = document.getElementById('playerResults');
                container.innerHTML = \`
                    <div class="error-card fade-in">
                        <div class="error-title">\${title}</div>
                        <div class="error-message">\${message}</div>
                    </div>
                \`;
            }
            
            // Event listeners
            document.addEventListener('DOMContentLoaded', () => {
                const searchInput = document.getElementById('searchInput');
                
                // Search on Enter key
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        searchPlayer();
                    }
                });
                
                // Debounced search on input (optional)
                // searchInput.addEventListener('input', debouncedSearch);
                
                console.log('✅ FortniteTracker with real API integration ready!');
                console.log('🔗 Connected to FortniteTracker.com API');
            });
            
            // Make functions global
            window.selectPlatform = selectPlatform;
            window.searchPlayer = searchPlayer;
        </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 FortniteTracker with real API running at http://localhost:${port}`);
  console.log('🔗 Using FortniteTracker.com API for live player statistics');
  console.log('⚠️  Remember to set TRN_API_KEY environment variable');
});
