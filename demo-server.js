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
        <title>Fortnite API Demo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }
            .api-section {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }
            .endpoint {
                background: #e9ecef;
                padding: 10px;
                border-radius: 3px;
                font-family: monospace;
                margin: 10px 0;
            }
            .description {
                color: #666;
                margin: 10px 0;
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎮 Fortnite API Library</h1>
            
            <div class="warning">
                <strong>⚠️ Demo Note:</strong> This is a demonstration of the Fortnite API Node.js library. 
                To use the actual API functionality, you need to provide Epic Games credentials and tokens.
            </div>

            <div class="api-section">
                <h3>📊 Available API Endpoints</h3>
                <div class="description">This library provides access to various Fortnite data:</div>
                
                <div class="endpoint">GET /api/status - Check Fortnite server status</div>
                <div class="endpoint">GET /api/news - Get Fortnite news</div>
                <div class="endpoint">GET /api/stats/:username/:platform - Get player stats</div>
                <div class="endpoint">GET /api/leaderboard/:platform/:type - Get leaderboard</div>
            </div>

            <div class="api-section">
                <h3>🔧 Setup Requirements</h3>
                <div class="description">To use this API, you need:</div>
                <ul>
                    <li>Epic Games account credentials</li>
                    <li>Client Launcher Token</li>
                    <li>Fortnite Client Token</li>
                    <li>Two-factor authentication disabled</li>
                    <li>At least one Fortnite login</li>
                </ul>
            </div>

            <div class="api-section">
                <h3>📚 Usage Example</h3>
                <pre style="background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; overflow-x: auto;">
const Fortnite = require("fortnite-api");

let fortniteAPI = new Fortnite([
    "EMAIL_ACCOUNT",
    "PASSWORD", 
    "CLIENT_LAUNCHER_TOKEN",
    "FORTNITE_CLIENT_TOKEN"
]);

fortniteAPI.login().then(() => {
    // Get player stats
    fortniteAPI.getStatsBR("username", "pc", "weekly")
        .then(stats => console.log(stats))
        .catch(err => console.log(err));
});
                </pre>
            </div>

            <div class="api-section">
                <h3>🚀 Installation</h3>
                <div class="endpoint">npm install fortnite-api</div>
            </div>

            <div class="footer">
                <p>For more information, check the <a href="https://github.com/qlaffont/fortnite-api" target="_blank">GitHub repository</a></p>
                <p>Version: 3.4.0 | Author: Quentin Laffont</p>
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
