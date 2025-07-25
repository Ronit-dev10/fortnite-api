const express = require('express');
const FortniteApi = require('./index.js');

const app = express();
const port = process.env.PORT || 3000;

// Serve static HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fortnite API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                max-width: 900px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .title {
                font-size: 3rem;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #666;
                font-size: 1.2rem;
            }
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 30px;
                margin: 40px 0;
            }
            .feature-card {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                text-align: center;
                transition: transform 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 20px;
                display: block;
            }
            .feature-title {
                font-size: 1.3rem;
                color: #333;
                margin-bottom: 15px;
                font-weight: 600;
            }
            .feature-desc {
                color: #666;
                line-height: 1.6;
            }
            .stats-section {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 40px;
                border-radius: 15px;
                margin: 40px 0;
                text-align: center;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 30px;
                margin-top: 30px;
            }
            .stat-item {
                text-align: center;
            }
            .stat-number {
                font-size: 2.5rem;
                font-weight: bold;
                display: block;
            }
            .stat-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            .cta-section {
                text-align: center;
                margin-top: 40px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 40px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                color: #888;
                font-size: 0.9rem;
            }
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">Fortnite API</h1>
                <p class="subtitle">Professional Node.js library for Fortnite data integration</p>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <span class="feature-icon">📊</span>
                    <h3 class="feature-title">Player Statistics</h3>
                    <p class="feature-desc">Access comprehensive Battle Royale stats including wins, kills, K/D ratios, and match history across all platforms.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">📰</span>
                    <h3 class="feature-title">Game News</h3>
                    <p class="feature-desc">Stay updated with the latest Fortnite news, announcements, and in-game events directly from Epic Games.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🏆</span>
                    <h3 class="feature-title">Leaderboards</h3>
                    <p class="feature-desc">Retrieve global leaderboards for Solo, Duo, and Squad modes across PC, PlayStation, and Xbox platforms.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🛒</span>
                    <h3 class="feature-title">Item Shop</h3>
                    <p class="feature-desc">Access current item shop data including featured items, daily items, and pricing information.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">⚡</span>
                    <h3 class="feature-title">Server Status</h3>
                    <p class="feature-desc">Monitor Fortnite server status and availability to ensure optimal user experience.</p>
                </div>

                <div class="feature-card">
                    <span class="feature-icon">🔍</span>
                    <h3 class="feature-title">Player Lookup</h3>
                    <p class="feature-desc">Search and retrieve player information by username or ID across all supported platforms.</p>
                </div>
            </div>

            <div class="stats-section">
                <h2>Trusted by Developers Worldwide</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">3.4.0</span>
                        <span class="stat-label">Latest Version</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">10+</span>
                        <span class="stat-label">API Endpoints</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">3</span>
                        <span class="stat-label">Platforms Supported</span>
                    </div>
                </div>
            </div>

            <div class="cta-section">
                <a href="https://github.com/qlaffont/fortnite-api" target="_blank" class="cta-button">
                    View Documentation
                </a>
            </div>

            <div class="footer">
                <p>Created by <a href="https://github.com/qlaffont" target="_blank">Quentin Laffont</a> | MIT License</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// API endpoints for demonstration (these would require actual credentials to work)
app.get('/api/status', (req, res) => {
  res.json({
    message: "This endpoint would check Fortnite server status",
    note: "Requires authentication with Epic Games credentials",
    method: "checkFortniteStatus()"
  });
});

app.get('/api/news', (req, res) => {
  res.json({
    message: "This endpoint would fetch Fortnite news",
    note: "Requires authentication with Epic Games credentials", 
    method: "getFortniteNews(lang)",
    example: "fortniteAPI.getFortniteNews('en')"
  });
});

app.get('/api/stats/:username/:platform', (req, res) => {
  const { username, platform } = req.params;
  res.json({
    message: `This endpoint would fetch stats for ${username} on ${platform}`,
    note: "Requires authentication with Epic Games credentials",
    method: "getStatsBR(username, platform, timeWindow)",
    example: `fortniteAPI.getStatsBR('${username}', '${platform}', 'weekly')`
  });
});

app.get('/api/leaderboard/:platform/:type', (req, res) => {
  const { platform, type } = req.params;
  res.json({
    message: `This endpoint would fetch ${type} leaderboard for ${platform}`,
    note: "Requires authentication with Epic Games credentials",
    method: "getScoreLeaderBoard(platform, type)",
    example: `fortniteAPI.getScoreLeaderBoard('${platform}', FortniteApi.${type.toUpperCase()})`
  });
});

app.listen(port, () => {
  console.log(`Fortnite API Demo Server running at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port} to see the demo`);
});
