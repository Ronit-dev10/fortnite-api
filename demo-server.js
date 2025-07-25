const express = require('express');
const FortniteApi = require('./index.js');

const app = express();
const port = process.env.PORT || 3000;

// Mock player database for search functionality
const playerDatabase = [
    { username: "free refresh kid", rank: 1, winRate: "99%", kd: "12.4", wins: 2847, kills: 34567, matches: 2875, platform: "PC", country: "FR", skin: "Renegade Raider" },
    { username: "free storm kids", rank: 2, winRate: "99%", kd: "11.8", wins: 2693, kills: 31734, matches: 2721, platform: "PC", country: "FR", skin: "Black Knight" },
    { username: "Twitch matthew1x", rank: 3, winRate: "99%", kd: "13.2", wins: 2541, kills: 33542, matches: 2565, platform: "PC", country: "US", skin: "Skull Trooper" },
    { username: "pliesfv twitch", rank: 4, winRate: "99%", kd: "10.9", wins: 2387, kills: 26019, matches: 2410, platform: "PC", country: "US", skin: "Galaxy" },
    { username: "Twitch Perkcules", rank: 5, winRate: "88%", kd: "12.7", wins: 2234, kills: 28402, matches: 2540, platform: "PC", country: "US", skin: "Ghoul Trooper" },
    { username: "Ninja", rank: 6, winRate: "85%", kd: "8.9", wins: 2100, kills: 18690, matches: 2470, platform: "PC", country: "US", skin: "Icon Series" },
    { username: "Tfue", rank: 7, winRate: "82%", kd: "9.5", wins: 1987, kills: 18876, matches: 2425, platform: "PC", country: "US", skin: "Crystal" },
    { username: "SypherPK", rank: 8, winRate: "79%", kd: "7.8", wins: 1876, kills: 14632, matches: 2373, platform: "PC", country: "US", skin: "Aura" },
    { username: "Bugha", rank: 9, winRate: "88%", kd: "11.2", wins: 1756, kills: 19664, matches: 1995, platform: "PC", country: "US", skin: "World Cup" },
    { username: "Mongraal", rank: 10, winRate: "84%", kd: "9.7", wins: 1689, kills: 16383, matches: 2010, platform: "PC", country: "UK", skin: "Elite Agent" }
];

// Reload players data (different from ranked players)
const reloadPlayers = [
    { username: "ReloadKing_TTV", rank: 1, avgReloadTime: "0.8s", reloadAccuracy: "98%", fastReloads: 15670, country: "US", skin: "John Wick" },
    { username: "QuickClip_Pro", rank: 2, avgReloadTime: "0.9s", reloadAccuracy: "97%", fastReloads: 14892, country: "CA", skin: "The Reaper" },
    { username: "SpeedReloader", rank: 3, avgReloadTime: "0.9s", reloadAccuracy: "96%", fastReloads: 14203, country: "UK", skin: "Omega" },
    { username: "InstantAmmo_YT", rank: 4, avgReloadTime: "1.0s", reloadAccuracy: "98%", fastReloads: 13945, country: "DE", skin: "Black Knight" },
    { username: "ReloadMaster", rank: 5, avgReloadTime: "1.0s", reloadAccuracy: "95%", fastReloads: 13567, country: "FR", skin: "Galaxy" }
    // ... continuing with 95 more players
];

// Generate more reload players
for (let i = 6; i <= 100; i++) {
    reloadPlayers.push({
        username: `ReloadPro${i}_${Math.random().toString(36).substr(2, 5)}`,
        rank: i,
        avgReloadTime: `${(0.8 + Math.random() * 0.8).toFixed(1)}s`,
        reloadAccuracy: `${(85 + Math.random() * 13).toFixed(0)}%`,
        fastReloads: Math.floor(13000 - (i * 120) + Math.random() * 500),
        country: ["US", "CA", "UK", "DE", "FR", "JP", "AU", "BR", "MX", "KR"][Math.floor(Math.random() * 10)],
        skin: ["Crystal", "Aura", "Dynamo", "Superhero", "Driver", "Og Defaults", "Fishstick", "Peely", "Midas", "Kit"][Math.floor(Math.random() * 10)]
    });
}

// Serve static HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fortnite Central - Complete Stats & Info Hub</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #0a0e1a;
                color: #fff;
                line-height: 1.6;
            }
            .navbar {
                background: rgba(10, 14, 26, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 1rem 0;
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
            }
            .nav-container {
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2rem;
            }
            .logo {
                font-size: 1.8rem;
                font-weight: 800;
                background: linear-gradient(45deg, #00d4ff, #ff6b6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                cursor: pointer;
            }
            .main-nav {
                display: flex;
                gap: 1rem;
                list-style: none;
            }
            .tab-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #e2e8f0;
                padding: 0.7rem 1.2rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                font-size: 0.875rem;
                letter-spacing: 0.025em;
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
            }
            .tab-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.5s ease;
            }
            .tab-btn:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(0, 212, 255, 0.5);
                color: #00d4ff;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .tab-btn:hover::before {
                left: 100%;
            }
            .tab-btn.active {
                background: linear-gradient(135deg, #0ea5e9, #06b6d4);
                border-color: #0ea5e9;
                color: #ffffff;
                box-shadow: 0 4px 16px rgba(14, 165, 233, 0.25);
                transform: translateY(-1px);
            }
            .tab-btn.active::before {
                display: none;
            }
            .tab-content {
                display: none;
                animation: fadeIn 0.5s ease-in-out;
            }
            .tab-content.active {
                display: block;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .search-section {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border-radius: 20px;
                padding: 2rem;
                margin: 2rem 0;
                text-align: center;
            }
            .player-search {
                display: flex;
                gap: 1rem;
                max-width: 600px;
                margin: 1rem auto;
                flex-wrap: wrap;
                justify-content: center;
            }
            .search-input {
                flex: 1;
                min-width: 300px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                padding: 1rem 1.5rem;
                color: #fff;
                font-size: 1rem;
            }
            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            .search-btn {
                background: linear-gradient(135deg, #0ea5e9, #06b6d4);
                border: none;
                color: #ffffff;
                padding: 0.875rem 1.75rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.875rem;
                letter-spacing: 0.025em;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
            }
            .search-btn:hover {
                background: linear-gradient(135deg, #0284c7, #0891b2);
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
            }
            .search-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
            }
            .player-result {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                margin: 2rem auto;
                max-width: 800px;
                display: none;
            }
            .player-result.show {
                display: block;
                animation: slideUp 0.5s ease-out;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
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
                background: linear-gradient(135deg, #00d4ff, #0ea5e9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
            }
            .player-info h3 {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            .player-rank {
                color: #ffd700;
                font-size: 1.2rem;
                font-weight: 600;
            }
            .player-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
            }
            .player-stat {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 1.5rem;
                text-align: center;
            }
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                color: #00d4ff;
                display: block;
                margin-bottom: 0.5rem;
            }
            .stat-name {
                color: #a0a9c0;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .player-meta {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0.5rem 0;
                color: #a0a9c0;
                font-size: 0.9rem;
            }
            .separator {
                color: #64748b;
            }
            .player-level {
                color: #00d4ff;
                font-weight: 600;
                font-size: 1rem;
                margin-top: 0.5rem;
            }
            .stats-section {
                margin: 2rem 0;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .stats-title {
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: #fff;
                border-bottom: 2px solid rgba(0, 212, 255, 0.3);
                padding-bottom: 0.5rem;
            }
            .player-stat.highlight {
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid rgba(0, 212, 255, 0.2);
            }
            .mode-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            .mode-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 10px;
                padding: 1.5rem;
                transition: all 0.3s ease;
            }
            .mode-card:hover {
                border-color: rgba(0, 212, 255, 0.3);
                transform: translateY(-2px);
            }
            .mode-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }
            .mode-icon {
                font-size: 1.5rem;
            }
            .mode-header h5 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #fff;
                margin: 0;
            }
            .mode-stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            .mode-stat {
                text-align: center;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            .mode-value {
                display: block;
                font-size: 1.25rem;
                font-weight: 700;
                color: #00d4ff;
                margin-bottom: 0.25rem;
            }
            .mode-label {
                font-size: 0.75rem;
                color: #a0a9c0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .recent-matches {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 0.75rem;
            }
            .match-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .match-card.win {
                border-color: #22c55e;
                background: rgba(34, 197, 94, 0.1);
            }
            .match-card.top5 {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }
            .match-placement {
                font-size: 1.1rem;
                font-weight: 700;
                margin-bottom: 0.25rem;
            }
            .match-card.win .match-placement {
                color: #22c55e;
            }
            .match-card.top5 .match-placement {
                color: #f59e0b;
            }
            .match-kills {
                font-size: 0.9rem;
                color: #a0a9c0;
            }
            .season-stats {
                space-y: 1.5rem;
            }
            .progress-item {
                margin-bottom: 1.5rem;
            }
            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            .progress-bar {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                height: 8px;
                overflow: hidden;
            }
            .progress-fill {
                background: linear-gradient(90deg, #00d4ff, #0ea5e9);
                height: 100%;
                border-radius: 10px;
                transition: width 0.5s ease;
            }
            .season-stat-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
            }
            .season-stat {
                text-align: center;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            .season-value {
                display: block;
                font-size: 1.4rem;
                font-weight: 700;
                color: #00d4ff;
                margin-bottom: 0.25rem;
            }
            .season-label {
                font-size: 0.8rem;
                color: #a0a9c0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .hero {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8rem 2rem 4rem;
                text-align: center;
                margin-top: 80px;
            }
            .hero-content {
                max-width: 800px;
                margin: 0 auto;
            }
            .hero h1 {
                font-size: 4rem;
                font-weight: 900;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, #e0e7ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .hero-subtitle {
                font-size: 1.5rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            .search-bar {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                padding: 1rem 2rem;
                font-size: 1.1rem;
                color: #fff;
                width: 100%;
                max-width: 500px;
                margin: 0 auto;
                backdrop-filter: blur(10px);
            }
            .search-bar::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 2rem;
            }
            .section {
                padding: 4rem 0;
            }
            .section-title {
                font-size: 2.5rem;
                font-weight: 800;
                text-align: center;
                margin-bottom: 3rem;
                background: linear-gradient(45deg, #00d4ff, #ff6b6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
            }
            .stat-card {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                transition: transform 0.3s ease;
            }
            .stat-card:hover {
                transform: translateY(-5px);
            }
            .stat-number {
                font-size: 3rem;
                font-weight: 900;
                color: #00d4ff;
                display: block;
                margin-bottom: 0.5rem;
            }
            .stat-label {
                color: #a0a9c0;
                font-size: 1rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
            }
            .feature-card {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2.5rem;
                transition: all 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
                border-color: #00d4ff;
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 1.5rem;
                display: block;
            }
            .feature-title {
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: #fff;
            }
            .feature-desc {
                color: #a0a9c0;
                line-height: 1.8;
            }
            .modes-section {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border-radius: 30px;
                padding: 3rem;
                margin: 4rem 0;
            }
            .modes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }
            .mode-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
            }
            .mode-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                display: block;
            }
            .leaderboard-section {
                background: #111827;
                border-radius: 20px;
                padding: 3rem;
                margin: 3rem 0;
            }
            .leaderboard-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 2rem;
            }
            .leaderboard-table th,
            .leaderboard-table td {
                padding: 1rem;
                text-align: left;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .leaderboard-table th {
                background: rgba(0, 212, 255, 0.1);
                color: #00d4ff;
                font-weight: 600;
            }
            .rank {
                color: #ffd700;
                font-weight: 700;
            }
            .division-unreal {
                background: linear-gradient(135deg, #b83dfa, #d946ef, #ec4899);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 0 10px rgba(184, 61, 250, 0.3);
            }
            .top-3-row {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
                border: 2px solid transparent;
                border-image: linear-gradient(135deg, #ffd700, #ffed4e) 1;
                position: relative;
            }
            .top-3-row::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
            }
            .top-1 {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
                border-image: linear-gradient(135deg, #ffd700, #ffed4e) 1;
            }
            .top-1::before {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            }
            .top-2 {
                background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.08));
                border-image: linear-gradient(135deg, #c0c0c0, #e5e5e5) 1;
            }
            .top-2::before {
                background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
            }
            .top-3 {
                background: linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.08));
                border-image: linear-gradient(135deg, #cd7f32, #deb887) 1;
            }
            .top-3::before {
                background: linear-gradient(135deg, #cd7f32, #deb887);
            }
            .player-skin {
                font-size: 0.8rem;
                color: #a0a9c0;
                font-style: italic;
            }
            .leaderboard-scroll {
                max-height: 600px;
                overflow-y: auto;
                border-radius: 10px;
            }
            .leaderboard-scroll::-webkit-scrollbar {
                width: 8px;
            }
            .leaderboard-scroll::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            .leaderboard-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #b83dfa, #d946ef);
                border-radius: 4px;
            }
            .section-nav {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            .nav-btn {
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: #e2e8f0;
                padding: 0.6rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                font-size: 0.8rem;
                letter-spacing: 0.025em;
                backdrop-filter: blur(10px);
            }
            .nav-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(0, 212, 255, 0.4);
                color: #00d4ff;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .nav-btn.active {
                background: linear-gradient(135deg, #0ea5e9, #06b6d4);
                border-color: #0ea5e9;
                color: #ffffff;
                box-shadow: 0 2px 12px rgba(14, 165, 233, 0.25);
            }
            .weapon-stats {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            .stat {
                background: rgba(0, 212, 255, 0.1);
                color: #00d4ff;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            .tier-s {
                border: 2px solid #00d4ff;
                box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
            }
            .tier-mythic {
                border: 2px solid #b83dfa;
                box-shadow: 0 0 20px rgba(184, 61, 250, 0.2);
            }
            .tier-utility {
                border: 2px solid #22c55e;
                box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
            }
            .tier-declined {
                border: 2px solid #6b7280;
                opacity: 0.7;
            }
            .news-badge {
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
                margin-bottom: 0.5rem;
            }
            .news-card.featured {
                border: 2px solid #ffd700;
                box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
            }
            .news-tags {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            .tag {
                background: rgba(0, 212, 255, 0.2);
                color: #00d4ff;
                padding: 0.2rem 0.6rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 500;
            }
            .rarity-mythic {
                background: linear-gradient(135deg, #b83dfa, #d946ef);
                box-shadow: 0 0 15px rgba(184, 61, 250, 0.4);
            }
            .weapons-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-top: 2rem;
            }
            .weapon-card {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                text-align: center;
            }
            .weapon-rarity {
                display: inline-block;
                padding: 0.3rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            .rarity-legendary { background: #ff8c00; }
            .rarity-epic { background: #9d4edd; }
            .rarity-rare { background: #3b82f6; }
            .rarity-uncommon { background: #22c55e; }
            .rarity-common { background: #6b7280; }
            .news-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }
            .news-card {
                background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                overflow: hidden;
                transition: transform 0.3s ease;
            }
            .news-card:hover {
                transform: translateY(-5px);
            }
            .news-image {
                height: 200px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            }
            .news-content {
                padding: 2rem;
            }
            .news-title {
                font-size: 1.3rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }
            .news-date {
                color: #a0a9c0;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }
            .footer {
                background: #111827;
                padding: 3rem 0;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            .footer-links a {
                color: #a0a9c0;
                text-decoration: none;
                transition: color 0.3s;
            }
            .footer-links a:hover {
                color: #00d4ff;
            }
        </style>
    </head>
    <body>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo" onclick="showTab('home')">Fortnite Central</div>
                <ul class="main-nav">
                    <li><button class="tab-btn active" onclick="showTab('home')">Home</button></li>
                    <li><button class="tab-btn" onclick="showTab('search')">Player Search</button></li>
                    <li><button class="tab-btn" onclick="showTab('leaderboards')">Leaderboards</button></li>
                    <li><button class="tab-btn" onclick="showTab('reload-players')">Reload Players</button></li>
                    <li><button class="tab-btn" onclick="showTab('weapons')">Weapons</button></li>
                    <li><button class="tab-btn" onclick="showTab('news')">News</button></li>
                </ul>
            </div>
        </nav>

        <section class="hero">
            <div class="hero-content">
                <h1>Fortnite Central</h1>
                <p class="hero-subtitle">The ultimate hub for Fortnite stats, leaderboards, and game data</p>
                <input type="text" class="search-bar" placeholder="Search player stats, leaderboards, or game info...">
            </div>
        </section>

        <div class="container">
            <!-- Home Tab -->
            <div id="home-tab" class="tab-content active">
                <section class="section" id="stats">
                <h2 class="section-title">Live Game Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number">400M+</span>
                        <span class="stat-label">Total Players</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">85M</span>
                        <span class="stat-label">Monthly Active</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">24/7</span>
                        <span class="stat-label">Server Uptime</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">150+</span>
                        <span class="stat-label">Countries</span>
                    </div>
                </div>

                <div class="modes-section">
                    <h3 class="section-title">Game Modes</h3>
                    <div class="modes-grid">
                        <div class="mode-card">
                            <span class="mode-icon">👤</span>
                            <h4>Battle Royale Solo</h4>
                            <p>100 players compete alone for Victory Royale. Test your individual skills against the storm and other players.</p>
                        </div>
                        <div class="mode-card">
                            <span class="mode-icon">👥</span>
                            <h4>Battle Royale Duos</h4>
                            <p>Team up with a friend in this 50-team competition. Communication and teamwork are key to victory.</p>
                        </div>
                        <div class="mode-card">
                            <span class="mode-icon">👨‍👩‍👧‍👦</span>
                            <h4>Battle Royale Squads</h4>
                            <p>Form a squad of up to 4 players. Coordinate strategies and revive teammates to achieve Victory Royale.</p>
                        </div>
                        <div class="mode-card">
                            <span class="mode-icon">🏗️</span>
                            <h4>Creative Mode</h4>
                            <p>Build, play, and share your own custom islands. Unlimited creativity with building tools and game mechanics.</p>
                        </div>
                        <div class="mode-card">
                            <span class="mode-icon">🛡️</span>
                            <h4>Save the World</h4>
                            <p>Cooperative PvE campaign where players fight zombie-like creatures called Husks to save survivors.</p>
                        </div>
                        <div class="mode-card">
                            <span class="mode-icon">🎵</span>
                            <h4>Party Royale</h4>
                            <p>Social space with no combat. Attend concerts, watch movies, and hangout with friends in this peaceful zone.</p>
                        </div>
                    </div>
                </div>
            </section>
            </div>

            <!-- Player Search Tab -->
            <div id="search-tab" class="tab-content">
                <section class="section">
                    <h2 class="section-title">Player Search & Stats</h2>

                    <div class="search-section">
                        <h3>Search Any Player</h3>
                        <p>Enter a player's username to view their detailed statistics and performance data</p>
                        <div class="player-search">
                            <input type="text" class="search-input" placeholder="Enter player username..." id="player-search-input">
                            <button class="search-btn" onclick="searchPlayer()">🔍 Search Player</button>
                        </div>
                    </div>

                    <div id="player-result" class="player-result">
                        <div class="player-header">
                            <div class="player-avatar" id="player-avatar">?</div>
                            <div class="player-info">
                                <h3 id="player-name">Player Name</h3>
                                <div class="player-rank" id="player-rank">#1 Global</div>
                                <div class="player-meta">
                                    <span id="player-country">🇺🇸 United States</span>
                                    <span class="separator">•</span>
                                    <span id="player-platform">PC</span>
                                    <span class="separator">•</span>
                                    <span id="player-skin">Renegade Raider</span>
                                </div>
                                <div class="player-level">Level <span id="player-level">387</span></div>
                            </div>
                        </div>

                        <!-- Overall Stats -->
                        <div class="stats-section">
                            <h4 class="stats-title">Overall Statistics</h4>
                            <div class="player-stats-grid">
                                <div class="player-stat highlight">
                                    <span class="stat-value" id="player-wins">0</span>
                                    <span class="stat-name">Wins</span>
                                </div>
                                <div class="player-stat highlight">
                                    <span class="stat-value" id="player-kd">0.0</span>
                                    <span class="stat-name">K/D Ratio</span>
                                </div>
                                <div class="player-stat highlight">
                                    <span class="stat-value" id="player-winrate">0%</span>
                                    <span class="stat-name">Win Rate</span>
                                </div>
                                <div class="player-stat">
                                    <span class="stat-value" id="player-kills">0</span>
                                    <span class="stat-name">Kills</span>
                                </div>
                                <div class="player-stat">
                                    <span class="stat-value" id="player-matches">0</span>
                                    <span class="stat-name">Matches</span>
                                </div>
                                <div class="player-stat">
                                    <span class="stat-value" id="player-kpm">0.0</span>
                                    <span class="stat-name">Kills/Match</span>
                                </div>
                                <div class="player-stat">
                                    <span class="stat-value" id="player-score">0</span>
                                    <span class="stat-name">Score</span>
                                </div>
                                <div class="player-stat">
                                    <span class="stat-value" id="player-playtime">0h</span>
                                    <span class="stat-name">Playtime</span>
                                </div>
                            </div>
                        </div>

                        <!-- Game Mode Stats -->
                        <div class="stats-section">
                            <h4 class="stats-title">Game Mode Breakdown</h4>
                            <div class="mode-stats">
                                <div class="mode-card">
                                    <div class="mode-header">
                                        <span class="mode-icon">👤</span>
                                        <h5>Solo</h5>
                                    </div>
                                    <div class="mode-stats-grid">
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-wins">0</span>
                                            <span class="mode-label">Wins</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-kd">0.0</span>
                                            <span class="mode-label">K/D</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-winrate">0%</span>
                                            <span class="mode-label">Win%</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-kills">0</span>
                                            <span class="mode-label">Kills</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-matches">0</span>
                                            <span class="mode-label">Matches</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="solo-top10">0</span>
                                            <span class="mode-label">Top 10</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mode-card">
                                    <div class="mode-header">
                                        <span class="mode-icon">👥</span>
                                        <h5>Duo</h5>
                                    </div>
                                    <div class="mode-stats-grid">
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-wins">0</span>
                                            <span class="mode-label">Wins</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-kd">0.0</span>
                                            <span class="mode-label">K/D</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-winrate">0%</span>
                                            <span class="mode-label">Win%</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-kills">0</span>
                                            <span class="mode-label">Kills</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-matches">0</span>
                                            <span class="mode-label">Matches</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="duo-top5">0</span>
                                            <span class="mode-label">Top 5</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mode-card">
                                    <div class="mode-header">
                                        <span class="mode-icon">👨‍👩‍👧‍👦</span>
                                        <h5>Squad</h5>
                                    </div>
                                    <div class="mode-stats-grid">
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-wins">0</span>
                                            <span class="mode-label">Wins</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-kd">0.0</span>
                                            <span class="mode-label">K/D</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-winrate">0%</span>
                                            <span class="mode-label">Win%</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-kills">0</span>
                                            <span class="mode-label">Kills</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-matches">0</span>
                                            <span class="mode-label">Matches</span>
                                        </div>
                                        <div class="mode-stat">
                                            <span class="mode-value" id="squad-top3">0</span>
                                            <span class="mode-label">Top 3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Performance -->
                        <div class="stats-section">
                            <h4 class="stats-title">Recent Performance (Last 10 Matches)</h4>
                            <div class="recent-matches" id="recent-matches">
                                <!-- Recent matches will be populated by JavaScript -->
                            </div>
                        </div>

                        <!-- Season Progress -->
                        <div class="stats-section">
                            <h4 class="stats-title">Chapter 6 Season 3 Progress</h4>
                            <div class="season-stats">
                                <div class="progress-item">
                                    <div class="progress-header">
                                        <span>Battle Pass Tier</span>
                                        <span id="bp-tier">87 / 100</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="bp-progress" style="width: 87%"></div>
                                    </div>
                                </div>
                                <div class="season-stat-grid">
                                    <div class="season-stat">
                                        <span class="season-value" id="season-xp">1,247,830</span>
                                        <span class="season-label">Season XP</span>
                                    </div>
                                    <div class="season-stat">
                                        <span class="season-value" id="season-wins">47</span>
                                        <span class="season-label">Season Wins</span>
                                    </div>
                                    <div class="season-stat">
                                        <span class="season-value" id="season-kills">1,234</span>
                                        <span class="season-label">Season Kills</span>
                                    </div>
                                    <div class="season-stat">
                                        <span class="season-value" id="season-placement">Top 12%</span>
                                        <span class="season-label">Avg Placement</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Leaderboards Tab -->
            <div id="leaderboards-tab" class="tab-content">
                <section class="section" id="leaderboards">
                <h2 class="section-title">Global Leaderboards</h2>
                <div class="leaderboard-section">
                    <h3>Top 100 Ranked Players - Unreal Division</h3>
                    <div class="leaderboard-scroll">
                        <table class="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Country</th>
                                    <th>Division</th>
                                    <th>Win Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="top-3-row top-1">
                                    <td class="rank">👑 #1</td>
                                    <td><strong>free refresh kid</strong><br><span class="player-skin">Using: Renegade Raider</span></td>
                                    <td>🇫🇷 FR</td>
                                    <td><span class="division-unreal">Unreal</span></td>
                                    <td><strong>99%</strong></td>
                                </tr>
                                <tr class="top-3-row top-2">
                                    <td class="rank">🥈 #2</td>
                                    <td><strong>free storm kids</strong><br><span class="player-skin">Using: Black Knight</span></td>
                                    <td>🇫🇷 FR</td>
                                    <td><span class="division-unreal">Unreal</span></td>
                                    <td><strong>99%</strong></td>
                                </tr>
                                <tr class="top-3-row top-3">
                                    <td class="rank">🥉 #3</td>
                                    <td><strong>Twitch matthew1x</strong><br><span class="player-skin">Using: Skull Trooper</span></td>
                                    <td>🇺🇸 US</td>
                                    <td><span class="division-unreal">Unreal</span></td>
                                    <td><strong>99%</strong></td>
                                </tr>
                                <tr><td class="rank">#4</td><td>pliesfv twitch<br><span class="player-skin">Using: Galaxy</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>99%</td></tr>
                                <tr><td class="rank">#5</td><td>Twitch Perkcules<br><span class="player-skin">Using: Ghoul Trooper</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>88%</td></tr>
                                <tr><td class="rank">#6</td><td>twitch zupamk<br><span class="player-skin">Using: John Wick</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>87%</td></tr>
                                <tr><td class="rank">#7</td><td>Poručík Ghoustl<br><span class="player-skin">Using: Omega</span></td><td>🇨🇿 CZ</td><td><span class="division-unreal">Unreal</span></td><td>86%</td></tr>
                                <tr><td class="rank">#8</td><td>аhsul1<br><span class="player-skin">Using: Fishstick</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>84%</td></tr>
                                <tr><td class="rank">#9</td><td>twtch 2xwasheyyǃ<br><span class="player-skin">Using: Travis Scott</span></td><td>🇨🇦 CA</td><td><span class="division-unreal">Unreal</span></td><td>84%</td></tr>
                                <tr><td class="rank">#10</td><td>200IQ simo<br><span class="player-skin">Using: Peely</span></td><td>🇫🇮 FI</td><td><span class="division-unreal">Unreal</span></td><td>83%</td></tr>
                                <tr><td class="rank">#11</td><td>200IQ spark<br><span class="player-skin">Using: Crystal</span></td><td>🇫🇮 FI</td><td><span class="division-unreal">Unreal</span></td><td>83%</td></tr>
                                <tr><td class="rank">#12</td><td>Wendiger Schmali<br><span class="player-skin">Using: Aura</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>81%</td></tr>
                                <tr><td class="rank">#13</td><td>Twitch Zensita<br><span class="player-skin">Using: Wonder Woman</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>81%</td></tr>
                                <tr><td class="rank">#14</td><td>twitch freeswag<br><span class="player-skin">Using: Midas</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>80%</td></tr>
                                <tr><td class="rank">#15</td><td>Scorcﱞh<br><span class="player-skin">Using: Drift</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>78%</td></tr>
                                <tr><td class="rank">#16</td><td>npc oo oo ah ah<br><span class="player-skin">Using: Marshmello</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>78%</td></tr>
                                <tr><td class="rank">#17</td><td>Daywalker.36<br><span class="player-skin">Using: Lynx</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>77%</td></tr>
                                <tr><td class="rank">#18</td><td>bﱞοﱞt<br><span class="player-skin">Using: Ragnarok</span></td><td>🇨🇺 CU</td><td><span class="division-unreal">Unreal</span></td><td>76%</td></tr>
                                <tr><td class="rank">#19</td><td>Monto Gold7<br><span class="player-skin">Using: Ice King</span></td><td>🇷🇺 RU</td><td><span class="division-unreal">Unreal</span></td><td>75%</td></tr>
                                <tr><td class="rank">#20</td><td>TTV 313CRYPTIC<br><span class="player-skin">Using: Ninja</span></td><td>🇨🇦 CA</td><td><span class="division-unreal">Unreal</span></td><td>74%</td></tr>
                                <tr><td class="rank">#21</td><td>krux 7<br><span class="player-skin">Using: Luxe</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>74%</td></tr>
                                <tr><td class="rank">#22</td><td>Drﱞake.<br><span class="player-skin">Using: Hybrid</span></td><td>🇫🇲 FM</td><td><span class="division-unreal">Unreal</span></td><td>73%</td></tr>
                                <tr><td class="rank">#23</td><td>Bonnіe Blue<br><span class="player-skin">Using: Vendetta</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>73%</td></tr>
                                <tr><td class="rank">#24</td><td>TIKTOK KIS CHANY<br><span class="player-skin">Using: Catalyst</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>71%</td></tr>
                                <tr><td class="rank">#25</td><td>Emboar 18<br><span class="player-skin">Using: X-Lord</span></td><td>🇺🇦 UA</td><td><span class="division-unreal">Unreal</span></td><td>71%</td></tr>
                                <tr><td class="rank">#26</td><td>ǃloco<br><span class="player-skin">Using: Ultima Knight</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>71%</td></tr>
                                <tr><td class="rank">#27</td><td>PTH zaytox<br><span class="player-skin">Using: Sparkle Supreme</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>71%</td></tr>
                                <tr><td class="rank">#28</td><td>BabyChief 代<br><span class="player-skin">Using: 8-Ball vs Scratch</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>71%</td></tr>
                                <tr><td class="rank">#29</td><td>Pandore GaLaK<br><span class="player-skin">Using: Fusion</span></td><td>🇫🇷 FR</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#30</td><td>yes THAT godie<br><span class="player-skin">Using: Journey vs Hazard</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#31</td><td>ℭreature<br><span class="player-skin">Using: Remedy vs Toxin</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#32</td><td>tiktokぴーたーらぜりで検索<br><span class="player-skin">Using: Sorana</span></td><td>🇯🇵 JP</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#33</td><td>185 guruu<br><span class="player-skin">Using: Rippley vs Sludge</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#34</td><td>AG ZyuPK 23<br><span class="player-skin">Using: Turk vs Riptide</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>70%</td></tr>
                                <tr><td class="rank">#35</td><td>twitch ethannmk<br><span class="player-skin">Using: Cameo vs Chic</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>69%</td></tr>
                                <tr><td class="rank">#36</td><td>twitch yjzz_<br><span class="player-skin">Using: Skye</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>69%</td></tr>
                                <tr><td class="rank">#37</td><td>Twitch irlsnax<br><span class="player-skin">Using: Meowscles</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>68%</td></tr>
                                <tr><td class="rank">#38</td><td>hоwly666<br><span class="player-skin">Using: Agent Peely</span></td><td>🇷🇺 RU</td><td><span class="division-unreal">Unreal</span></td><td>68%</td></tr>
                                <tr><td class="rank">#39</td><td>Claire まろもちch<br><span class="player-skin">Using: Brutus</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#40</td><td>CHUGGINGTON ﾃ<br><span class="player-skin">Using: TNTina</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#41</td><td>DIE OKTONAUTEN<br><span class="player-skin">Using: Midas</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#42</td><td>motionfv<br><span class="player-skin">Using: Maya</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#43</td><td>M8 Mаlibucа<br><span class="player-skin">Using: Deadpool</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#44</td><td>Twitch Happyfnrr<br><span class="player-skin">Using: Kit</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#45</td><td>M8 Pоlloǃ<br><span class="player-skin">Using: Jules</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#46</td><td>Twitch Surprise<br><span class="player-skin">Using: Ocean</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#47</td><td>Mr. Lunoxs<br><span class="player-skin">Using: Fade</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#48</td><td>Solarу Kurama<br><span class="player-skin">Using: Siona</span></td><td>🇫🇷 FR</td><td><span class="division-unreal">Unreal</span></td><td>67%</td></tr>
                                <tr><td class="rank">#49</td><td>twitch keroxr1x<br><span class="player-skin">Using: Eternal Knight</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#50</td><td>220W SaNyaGoD-<br><span class="player-skin">Using: Thor</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#51</td><td>Twitch Coltin1x<br><span class="player-skin">Using: She-Hulk</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#52</td><td>bigmuffin555<br><span class="player-skin">Using: Groot</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#53</td><td>sкі.<br><span class="player-skin">Using: Storm</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#54</td><td>ВКǃ<br><span class="player-skin">Using: Doctor Doom</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#55</td><td>deviantǃ<br><span class="player-skin">Using: Mystique</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#56</td><td>TRKF DANDEPUZO<br><span class="player-skin">Using: Iron Man</span></td><td>🇷🇺 RU</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#57</td><td>Sinister Polzt<br><span class="player-skin">Using: Wolverine</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#58</td><td>Twitch T1nman21<br><span class="player-skin">Using: Mancake</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#59</td><td>untalented 4jp<br><span class="player-skin">Using: Kondor</span></td><td>🇯🇵 JP</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#60</td><td>0fkq<br><span class="player-skin">Using: Lexa</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#61</td><td>Nadporučík Vagy<br><span class="player-skin">Using: Reese</span></td><td>🇨🇿 CZ</td><td><span class="division-unreal">Unreal</span></td><td>66%</td></tr>
                                <tr><td class="rank">#62</td><td>Accused.Qertzzo<br><span class="player-skin">Using: The Mandalorian</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#63</td><td>DТ Rise<br><span class="player-skin">Using: Menace</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#64</td><td>Podporučík Riol<br><span class="player-skin">Using: Agent Jones</span></td><td>🇸🇰 SK</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#65</td><td>fقne spقidar<br><span class="player-skin">Using: The Visitor</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#66</td><td>rezotoǃ<br><span class="player-skin">Using: The Scientist</span></td><td>🇷🇺 RU</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#67</td><td>999 Explaint<br><span class="player-skin">Using: The Paradigm</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#68</td><td>FA_MisterX<br><span class="player-skin">Using: Foundation</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#69</td><td>CYC ZukeyAim<br><span class="player-skin">Using: Raz</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#70</td><td>E-Girl Batchii<br><span class="player-skin">Using: Lara Croft</span></td><td>🇨🇦 CA</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#71</td><td>NGS ゆずかなChannel<br><span class="player-skin">Using: Raven</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#72</td><td>250aim<br><span class="player-skin">Using: Tarana</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>65%</td></tr>
                                <tr><td class="rank">#73</td><td>MEM CRIPPER 12<br><span class="player-skin">Using: Cluck</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#74</td><td>tuhronto ʕᵒᴥᵒʔ<br><span class="player-skin">Using: Kymera</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#75</td><td>Orangeе<br><span class="player-skin">Using: Guggimon</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#76</td><td>motionsick cam<br><span class="player-skin">Using: Sunny</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#77</td><td>Twitch Tyrionbtw<br><span class="player-skin">Using: Zyg</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#78</td><td>xps chipzǃǃ ÿÿÿÿ<br><span class="player-skin">Using: Slone</span></td><td>🇬🇧 GB</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#79</td><td>EOZ 0eht<br><span class="player-skin">Using: Charlotte</span></td><td>🇫🇷 FR</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#80</td><td>Toizee .<br><span class="player-skin">Using: Kor</span></td><td>🇱🇻 LV</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#81</td><td>Quality 5<br><span class="player-skin">Using: J.B. Chimpanski</span></td><td>🇩🇪 DE</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#82</td><td>Tiktok Gavzzxᵗᵗᵛ<br><span class="player-skin">Using: Fabio Sparklemane</span></td><td>🇻🇮 VI</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#83</td><td>tyt voidianaǃ<br><span class="player-skin">Using: Torin</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#84</td><td>phwim<br><span class="player-skin">Using: Dark Jonesy</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#85</td><td>chacalGOTY 7<br><span class="player-skin">Using: Ariana Grande</span></td><td>🇧🇷 BR</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#86</td><td>Xezi On Kick<br><span class="player-skin">Using: Carnage</span></td><td>🇬🇹 GT</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#87</td><td>ǃ Egy Kub1x ǃ<br><span class="player-skin">Using: Venom</span></td><td>🇨🇿 CZ</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#88</td><td>G8 Eltensy<br><span class="player-skin">Using: The Foundation</span></td><td>🇺🇦 UA</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#89</td><td>axrtiy<br><span class="player-skin">Using: Spider-Man</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#90</td><td>Twitch PapaSuun<br><span class="player-skin">Using: Marcus Fenix</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#91</td><td>falcon tаyso<br><span class="player-skin">Using: Kait Diaz</span></td><td>🇷🇸 RS</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#92</td><td>Twitch Swаy6k<br><span class="player-skin">Using: The Rock</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#93</td><td>M8 MarіusCОW<br><span class="player-skin">Using: Haven</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#94</td><td>2AM Zenon<br><span class="player-skin">Using: Ronin</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>64%</td></tr>
                                <tr><td class="rank">#95</td><td>paranoid andrоid<br><span class="player-skin">Using: Gunnar</span></td><td>🇺🇸 US</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                                <tr><td class="rank">#96</td><td>156 TURTL3 JO<br><span class="player-skin">Using: Stormfarer</span></td><td>🇷🇴 RO</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                                <tr><td class="rank">#97</td><td>ノノチ<br><span class="player-skin">Using: The Imagined</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                                <tr><td class="rank">#98</td><td>Twitch 7Zyrox7<br><span class="player-skin">Using: Tsuki 2.0</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                                <tr><td class="rank">#99</td><td>twitter masnfn6<br><span class="player-skin">Using: Kiara K.O.</span></td><td>🇸🇪 SE</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                                <tr><td class="rank">#100</td><td>Twitch-xjoaxyf<br><span class="player-skin">Using: Adira</span></td><td>🌍</td><td><span class="division-unreal">Unreal</span></td><td>63%</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            </div>

            <!-- Reload Players Tab -->
            <div id="reload-players-tab" class="tab-content">
                <section class="section">
                    <h2 class="section-title">Top 100 Reload Players</h2>
                    <p style="text-align: center; color: #a0a9c0; margin-bottom: 2rem;">Players ranked by reload speed, accuracy, and consistency</p>

                    <div class="leaderboard-section">
                        <h3>Fastest Reload Masters</h3>
                        <div class="leaderboard-scroll">
                            <table class="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Player</th>
                                        <th>Country</th>
                                        <th>Avg Reload Time</th>
                                        <th>Reload Accuracy</th>
                                        <th>Fast Reloads</th>
                                    </tr>
                                </thead>
                                <tbody id="reload-leaderboard">
                                    <tr class="top-3-row top-1">
                                        <td class="rank">👑 #1</td>
                                        <td><strong>ReloadKing_TTV</strong><br><span class="player-skin">Using: John Wick</span></td>
                                        <td>🇺🇸 US</td>
                                        <td><strong>0.8s</strong></td>
                                        <td><strong>98%</strong></td>
                                        <td><strong>15,670</strong></td>
                                    </tr>
                                    <tr class="top-3-row top-2">
                                        <td class="rank">🥈 #2</td>
                                        <td><strong>QuickClip_Pro</strong><br><span class="player-skin">Using: The Reaper</span></td>
                                        <td>🇨🇦 CA</td>
                                        <td><strong>0.9s</strong></td>
                                        <td><strong>97%</strong></td>
                                        <td><strong>14,892</strong></td>
                                    </tr>
                                    <tr class="top-3-row top-3">
                                        <td class="rank">🥉 #3</td>
                                        <td><strong>SpeedReloader</strong><br><span class="player-skin">Using: Omega</span></td>
                                        <td>🇬🇧 UK</td>
                                        <td><strong>0.9s</strong></td>
                                        <td><strong>96%</strong></td>
                                        <td><strong>14,203</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style="text-align: center; margin-top: 2rem;">
                            <button class="search-btn" onclick="loadAllReloadPlayers()">Load Full Top 100 Reload Rankings</button>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Weapons Tab -->
            <div id="weapons-tab" class="tab-content">
                <section class="section" id="weapons">
                <h2 class="section-title">Chapter 6 Season 3 - Galactic Battle Weapons</h2>

                <div class="section-nav">
                    <button class="nav-btn active" data-category="all">All Weapons</button>
                    <button class="nav-btn" data-category="s-tier">S-Tier Meta</button>
                    <button class="nav-btn" data-category="mythic">Mythic</button>
                    <button class="nav-btn" data-category="utility">Utility Items</button>
                </div>

                <div class="weapons-grid" id="weapons-container">
                    <div class="weapon-card tier-s" data-category="s-tier">
                        <div class="weapon-rarity rarity-mythic">S-Tier</div>
                        <h4>🔫 Spire Rifle</h4>
                        <p>DPS: 165 • Range: 350m • Magazine: 30</p>
                        <p>Versatile mid-to-long range weapon with tight bullet spread. Perfect for competitive play.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 33</span>
                            <span class="stat">Fire Rate: 5.0</span>
                            <span class="stat">Reload: 2.3s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-s" data-category="s-tier">
                        <div class="weapon-rarity rarity-legendary">S-Tier</div>
                        <h4>💥 Sentinel Pump Shotgun</h4>
                        <p>DPS: 180 • Range: 40m • Magazine: 8</p>
                        <p>High damage close-quarters weapon. Rewards precise aim with devastating potential.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 120</span>
                            <span class="stat">Fire Rate: 1.5</span>
                            <span class="stat">Reload: 1.8s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-s" data-category="s-tier">
                        <div class="weapon-rarity rarity-epic">S-Tier</div>
                        <h4>🔫 Killswitch Revolvers</h4>
                        <p>DPS: 192 • Range: 200m • Magazine: 12</p>
                        <p>Dual-wield pistols with rapid burst damage and quick ADS. Perfect for skilled players.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 48</span>
                            <span class="stat">Fire Rate: 4.0</span>
                            <span class="stat">Reload: 2.1s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-s" data-category="s-tier">
                        <div class="weapon-rarity rarity-legendary">S-Tier</div>
                        <h4>⚡ Veiled Precision SMG</h4>
                        <p>DPS: 204 • Range: 100m • Magazine: 35</p>
                        <p>Tight hip-fire accuracy with high fire rate. Dominates close-range engagements.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 17</span>
                            <span class="stat">Fire Rate: 12.0</span>
                            <span class="stat">Reload: 1.5s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-mythic" data-category="mythic">
                        <div class="weapon-rarity rarity-mythic">Mythic</div>
                        <h4>⭐ Enhanced A280-CFE Blaster</h4>
                        <p>DPS: 148.75 • Range: 400m • Magazine: 25</p>
                        <p>Star Wars themed mythic blaster with scope for long-range dominance.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 42</span>
                            <span class="stat">Fire Rate: 3.5</span>
                            <span class="stat">Reload: 2.8s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-mythic" data-category="mythic">
                        <div class="weapon-rarity rarity-mythic">Mythic</div>
                        <h4>⭐ Enhanced IQA-11 Marksman</h4>
                        <p>DPS: 140 • Range: 500m • Magazine: 10</p>
                        <p>High-damage sniper blaster for precise long-range eliminations.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 70</span>
                            <span class="stat">Fire Rate: 2.0</span>
                            <span class="stat">Reload: 3.2s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-mythic" data-category="mythic">
                        <div class="weapon-rarity rarity-mythic">Mythic</div>
                        <h4>⚔️ Lightsaber</h4>
                        <p>Damage: 150 • Range: Melee • Special: Force Powers</p>
                        <p>Iconic Star Wars weapon with block ability and Force-enhanced mobility.</p>
                        <div class="weapon-stats">
                            <span class="stat">Melee: 150</span>
                            <span class="stat">Block: 100%</span>
                            <span class="stat">Force Jump: ∞</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-utility" data-category="utility">
                        <div class="weapon-rarity rarity-epic">Utility</div>
                        <h4>👁️ Tracking Visor</h4>
                        <p>Duration: 8s • Range: 100m • Cooldown: 25s</p>
                        <p>Scans and highlights enemies through walls. Essential for strategic gameplay.</p>
                        <div class="weapon-stats">
                            <span class="stat">Scan Range: 100m</span>
                            <span class="stat">Duration: 8s</span>
                            <span class="stat">Uses: 3</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-utility" data-category="utility">
                        <div class="weapon-rarity rarity-rare">Utility</div>
                        <h4>🎵 Bass Boost Gloves</h4>
                        <p>Damage: 75 • Range: 15m • Cooldown: 8s</p>
                        <p>Shockwave attacks that knock back enemies and provide mobility boosts.</p>
                        <div class="weapon-stats">
                            <span class="stat">Shockwave: 75</span>
                            <span class="stat">Knockback: High</span>
                            <span class="stat">Mobility: +50%</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-declined" data-category="all">
                        <div class="weapon-rarity rarity-uncommon">C-Tier</div>
                        <h4>📉 Havoc Suppressed AR</h4>
                        <p>DPS: 132 • Range: 250m • Magazine: 30</p>
                        <p>Inconsistent performance and slow reload have dropped this from meta.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 24</span>
                            <span class="stat">Fire Rate: 5.5</span>
                            <span class="stat">Reload: 3.1s</span>
                        </div>
                    </div>

                    <div class="weapon-card tier-declined" data-category="all">
                        <div class="weapon-rarity rarity-rare">C-Tier</div>
                        <h4>📉 Hammer Pump Shotgun</h4>
                        <p>DPS: 95 • Range: 35m • Magazine: 6</p>
                        <p>High damage potential but slow reload makes it unfavorable in current meta.</p>
                        <div class="weapon-stats">
                            <span class="stat">Damage: 95</span>
                            <span class="stat">Fire Rate: 1.0</span>
                            <span class="stat">Reload: 4.2s</span>
                        </div>
                    </div>
                </div>
            </section>
            </div>

            <!-- News Tab -->
            <div id="news-tab" class="tab-content">
                <section class="section" id="news">
                <h2 class="section-title">Latest Fortnite News & Updates</h2>

                <div class="section-nav">
                    <button class="nav-btn active" data-category="all">All News</button>
                    <button class="nav-btn" data-category="updates">Game Updates</button>
                    <button class="nav-btn" data-category="events">Events</button>
                    <button class="nav-btn" data-category="collaborations">Collaborations</button>
                </div>

                <div class="news-grid" id="news-container">
                    <div class="news-card featured" data-category="updates">
                        <div class="news-image">⭐</div>
                        <div class="news-content">
                            <div class="news-badge">FEATURED</div>
                            <h3 class="news-title">Chapter 6 Season 3: Galactic Battle</h3>
                            <p class="news-date">July 25, 2025</p>
                            <p>Star Wars takes over Fortnite with lightsabers, Force powers, and epic galactic combat. Experience the ultimate crossover event!</p>
                            <div class="news-tags">
                                <span class="tag">Star Wars</span>
                                <span class="tag">New Season</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">🎵</div>
                        <div class="news-content">
                            <h3 class="news-title">Sabrina Carpenter Fortnite Festival</h3>
                            <p class="news-date">April 7, 2025</p>
                            <p>Sabrina Carpenter headlines Fortnite Festival Season 8 with exclusive performances and unlockable content.</p>
                            <div class="news-tags">
                                <span class="tag">Music</span>
                                <span class="tag">Festival</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">🎭</div>
                        <div class="news-content">
                            <h3 class="news-title">Adventure Time Collaboration</h3>
                            <p class="news-date">April 10, 2025</p>
                            <p>Finn, Jake, Princess Bubblegum, and Marceline join the battle! Mathematical skins now available.</p>
                            <div class="news-tags">
                                <span class="tag">Adventure Time</span>
                                <span class="tag">Skins</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">🥊</div>
                        <div class="news-content">
                            <h3 class="news-title">WWE Superstars Join Fortnite</h3>
                            <p class="news-date">April 17, 2025</p>
                            <p>The Undertaker and Cody Rhodes bring WWE action to the island with signature moves and entrances.</p>
                            <div class="news-tags">
                                <span class="tag">WWE</span>
                                <span class="tag">Wrestlers</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="events">
                        <div class="news-image">🦖</div>
                        <div class="news-content">
                            <h3 class="news-title">Godzilla Stomps Into Fortnite</h3>
                            <p class="news-date">January 13, 2025</p>
                            <p>The King of Monsters brings destruction and chaos. Face off against or become the legendary kaiju!</p>
                            <div class="news-tags">
                                <span class="tag">Godzilla</span>
                                <span class="tag">Kaiju</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="events">
                        <div class="news-image">🏙️</div>
                        <div class="news-content">
                            <h3 class="news-title">Crime City Event</h3>
                            <p class="news-date">February 12, 2025</p>
                            <p>Navigate the dangerous streets of Crime City with new challenges, locations, and criminal activities.</p>
                            <div class="news-tags">
                                <span class="tag">Crime City</span>
                                <span class="tag">Urban</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">⚔️</div>
                        <div class="news-content">
                            <h3 class="news-title">Mortal Kombat Fatality</h3>
                            <p class="news-date">February 17, 2025</p>
                            <p>Iconic fighters from Mortal Kombat enter the arena with brutal finishing moves and classic costumes.</p>
                            <div class="news-tags">
                                <span class="tag">Mortal Kombat</span>
                                <span class="tag">Fighting</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">🚀</div>
                        <div class="news-content">
                            <h3 class="news-title">Cowboy Bebop Space Cowboys</h3>
                            <p class="news-date">February 21, 2025</p>
                            <p>See you space cowboy! Spike Spiegel and crew bring their bounty hunting skills to the battle royale.</p>
                            <div class="news-tags">
                                <span class="tag">Cowboy Bebop</span>
                                <span class="tag">Anime</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="collaborations">
                        <div class="news-image">⚾</div>
                        <div class="news-content">
                            <h3 class="news-title">Shohei Ohtani MLB Debut</h3>
                            <p class="news-date">March 11, 2025</p>
                            <p>The first MLB player joins Fortnite! Experience baseball-themed content and home run celebrations.</p>
                            <div class="news-tags">
                                <span class="tag">MLB</span>
                                <span class="tag">Baseball</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="updates">
                        <div class="news-image">🤖</div>
                        <div class="news-content">
                            <h3 class="news-title">AI-Enhanced Darth Vader Voice</h3>
                            <p class="news-date">May 16, 2025</p>
                            <p>Disney and Epic Games use AI to bring James Earl Jones' iconic voice to Darth Vader in-game.</p>
                            <div class="news-tags">
                                <span class="tag">AI Technology</span>
                                <span class="tag">Star Wars</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="updates">
                        <div class="news-image">🏆</div>
                        <div class="news-content">
                            <h3 class="news-title">FNCS Chapter 6 Season 3</h3>
                            <p class="news-date">Live Now</p>
                            <p>The most competitive season yet! $1M prize pool for the Galactic Battle Championship Series.</p>
                            <div class="news-tags">
                                <span class="tag">Competitive</span>
                                <span class="tag">Esports</span>
                            </div>
                        </div>
                    </div>

                    <div class="news-card" data-category="updates">
                        <div class="news-image">🛒</div>
                        <div class="news-content">
                            <h3 class="news-title">Item Shop Daily Rotation</h3>
                            <p class="news-date">Updated Daily</p>
                            <p>New galactic-themed items, Star Wars cosmetics, and exclusive collaboration skins refresh every 24 hours.</p>
                            <div class="news-tags">
                                <span class="tag">Item Shop</span>
                                <span class="tag">Cosmetics</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">API Documentation</a>
                    <a href="#">Support</a>
                    <a href="#">Contact</a>
                </div>
                <p>&copy; 2023 Fortnite Central. All rights reserved. Not affiliated with Epic Games.</p>
            </div>
        </footer>

        <script>
            // Enhanced player database for comprehensive search
            const playerDatabase = [
                {
                    username: "free refresh kid", rank: 1, winRate: "99%", kd: "12.4", wins: 2847, kills: 34567, matches: 2875,
                    platform: "PC", country: "🇫🇷 FR", skin: "Renegade Raider", level: 387, score: 14567890, playtime: "2,847h",
                    solo: { wins: 1247, kills: 15234, matches: 1289, kd: 13.2, winRate: "96.7%", top10: 1267 },
                    duo: { wins: 834, kills: 10567, matches: 867, kd: 12.8, winRate: "96.2%", top5: 856 },
                    squad: { wins: 766, kills: 8766, matches: 789, kd: 11.9, winRate: "97.1%", top3: 778 },
                    season: { xp: 1247830, wins: 47, kills: 1234, placement: "Top 1%", bpTier: 87 }
                },
                {
                    username: "free storm kids", rank: 2, winRate: "99%", kd: "11.8", wins: 2693, kills: 31734, matches: 2721,
                    platform: "PC", country: "🇫🇷 FR", skin: "Black Knight", level: 374, score: 13456789, playtime: "2,693h",
                    solo: { wins: 1156, kills: 14123, matches: 1178, kd: 12.8, winRate: "98.1%", top10: 1167 },
                    duo: { wins: 789, kills: 9876, matches: 812, kd: 12.1, winRate: "97.2%", top5: 801 },
                    squad: { wins: 748, kills: 7735, matches: 731, kd: 10.9, winRate: "102.3%", top3: 729 },
                    season: { xp: 1189456, wins: 44, kills: 1156, placement: "Top 1%", bpTier: 83 }
                },
                {
                    username: "Twitch matthew1x", rank: 3, winRate: "99%", kd: "13.2", wins: 2541, kills: 33542, matches: 2565,
                    platform: "PC", country: "🇺🇸 US", skin: "Skull Trooper", level: 361, score: 12876543, playtime: "2,541h",
                    solo: { wins: 1098, kills: 15876, matches: 1123, kd: 14.1, winRate: "97.8%", top10: 1112 },
                    duo: { wins: 743, kills: 9234, matches: 756, kd: 12.6, winRate: "98.3%", top5: 751 },
                    squad: { wins: 700, kills: 8432, matches: 686, kd: 12.9, winRate: "102.0%", top3: 684 },
                    season: { xp: 1345678, wins: 52, kills: 1387, placement: "Top 1%", bpTier: 91 }
                },
                {
                    username: "Ninja", rank: 6, winRate: "85%", kd: "8.9", wins: 2100, kills: 18690, matches: 2470,
                    platform: "PC", country: "🇺🇸 US", skin: "Icon Series", level: 342, score: 9876543, playtime: "2,100h",
                    solo: { wins: 892, kills: 7956, matches: 1056, kd: 7.9, winRate: "84.5%", top10: 978 },
                    duo: { wins: 634, kills: 5723, matches: 734, kd: 8.2, winRate: "86.4%", top5: 678 },
                    squad: { wins: 574, kills: 5011, matches: 680, kd: 9.7, winRate: "84.4%", top3: 612 },
                    season: { xp: 987654, wins: 34, kills: 892, placement: "Top 3%", bpTier: 76 }
                },
                {
                    username: "Tfue", rank: 7, winRate: "82%", kd: "9.5", wins: 1987, kills: 18876, matches: 2425,
                    platform: "PC", country: "🇺🇸 US", skin: "Crystal", level: 329, score: 8765432, playtime: "1,987h",
                    solo: { wins: 834, kills: 8234, matches: 1023, kd: 8.9, winRate: "81.5%", top10: 912 },
                    duo: { wins: 623, kills: 5891, matches: 743, kd: 9.2, winRate: "83.8%", top5: 678 },
                    squad: { wins: 530, kills: 4751, matches: 659, kd: 10.4, winRate: "80.4%", top3: 589 },
                    season: { xp: 876543, wins: 29, kills: 743, placement: "Top 5%", bpTier: 68 }
                },
                {
                    username: "SypherPK", rank: 8, winRate: "79%", kd: "7.8", wins: 1876, kills: 14632, matches: 2373,
                    platform: "PC", country: "🇺🇸 US", skin: "Aura", level: 318, score: 7654321, playtime: "1,876h",
                    solo: { wins: 723, kills: 5987, matches: 934, kd: 7.2, winRate: "77.4%", top10: 834 },
                    duo: { wins: 589, kills: 4521, matches: 743, kd: 7.8, winRate: "79.3%", top5: 656 },
                    squad: { wins: 564, kills: 4124, matches: 696, kd: 8.4, winRate: "81.0%", top3: 612 },
                    season: { xp: 765432, wins: 31, kills: 678, placement: "Top 7%", bpTier: 72 }
                }
            ];

            // Tab switching functionality
            function showTab(tabName) {
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });

                // Remove active class from all tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Show selected tab
                document.getElementById(tabName + '-tab').classList.add('active');

                // Add active class to clicked button
                event.target.classList.add('active');
            }

            // Player search functionality
            function searchPlayer() {
                const searchInput = document.getElementById('player-search-input');
                const username = searchInput.value.trim().toLowerCase();
                const resultDiv = document.getElementById('player-result');

                if (!username) {
                    alert('Please enter a player username');
                    return;
                }

                // Search for player
                const player = playerDatabase.find(p => p.username.toLowerCase().includes(username));

                if (player) {
                    // Update player result display
                    document.getElementById('player-avatar').textContent = player.username.charAt(0).toUpperCase();
                    document.getElementById('player-name').textContent = player.username;
                    document.getElementById('player-rank').textContent = '#' + player.rank + ' Global';
                    document.getElementById('player-country').textContent = player.country;
                    document.getElementById('player-skin').textContent = 'Using: ' + player.skin;
                    document.getElementById('player-wins').textContent = player.wins.toLocaleString();
                    document.getElementById('player-kd').textContent = player.kd;
                    document.getElementById('player-winrate').textContent = player.winRate;
                    document.getElementById('player-kills').textContent = player.kills.toLocaleString();
                    document.getElementById('player-matches').textContent = player.matches.toLocaleString();
                    document.getElementById('player-platform').textContent = player.platform;

                    resultDiv.classList.add('show');
                } else {
                    alert('Player not found. Try searching for: Ninja, Tfue, SypherPK, Bugha, or Mongraal');
                }
            }

            // Load all reload players
            function loadAllReloadPlayers() {
                const tbody = document.getElementById('reload-leaderboard');
                const countries = ["🇺🇸 US", "🇨🇦 CA", "🇬🇧 UK", "🇩🇪 DE", "🇫🇷 FR", "🇯🇵 JP", "🇦🇺 AU", "🇧🇷 BR", "🇲🇽 MX", "🇰🇷 KR"];
                const skins = ["Crystal", "Aura", "Dynamo", "Superhero", "Driver", "OG Default", "Fishstick", "Peely", "Midas", "Kit"];

                // Clear existing rows except top 3
                const existingRows = tbody.querySelectorAll('tr');
                for (let i = 3; i < existingRows.length; i++) {
                    existingRows[i].remove();
                }

                // Add remaining 97 players
                for (let i = 4; i <= 100; i++) {
                    const row = document.createElement('tr');
                    const username = 'ReloadPro' + i + '_' + Math.random().toString(36).substr(2, 5);
                    const avgTime = (0.8 + Math.random() * 0.8).toFixed(1) + 's';
                    const accuracy = (85 + Math.random() * 13).toFixed(0) + '%';
                    const fastReloads = Math.floor(13000 - (i * 120) + Math.random() * 500).toLocaleString();
                    const country = countries[Math.floor(Math.random() * countries.length)];
                    const skin = skins[Math.floor(Math.random() * skins.length)];

                    row.innerHTML = \`
                        <td class="rank">#\${i}</td>
                        <td>\${username}<br><span class="player-skin">Using: \${skin}</span></td>
                        <td>\${country}</td>
                        <td>\${avgTime}</td>
                        <td>\${accuracy}</td>
                        <td>\${fastReloads}</td>
                    \`;
                    tbody.appendChild(row);
                }

                event.target.style.display = 'none';
            }

            // Enter key support for search
            document.addEventListener('DOMContentLoaded', function() {
                const searchInput = document.getElementById('player-search-input');
                if (searchInput) {
                    searchInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            searchPlayer();
                        }
                    });
                }

                // Weapons filtering
                const weaponBtns = document.querySelectorAll('#weapons .nav-btn');
                const weaponCards = document.querySelectorAll('#weapons-container .weapon-card');

                weaponBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const category = btn.getAttribute('data-category');

                        // Update active button
                        weaponBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        // Filter weapons
                        weaponCards.forEach(card => {
                            if (category === 'all' || card.getAttribute('data-category') === category || card.classList.contains('tier-' + category.replace('-tier', ''))) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, 50);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        });
                    });
                });

                // News filtering
                const newsBtns = document.querySelectorAll('#news .nav-btn');
                const newsCards = document.querySelectorAll('#news-container .news-card');

                newsBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const category = btn.getAttribute('data-category');

                        // Update active button
                        newsBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        // Filter news
                        newsCards.forEach(card => {
                            if (category === 'all' || card.getAttribute('data-category') === category) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, 50);
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        });
                    });
                });

                // Add transition styles to cards
                if (weaponCards.length && newsCards.length) {
                    [...weaponCards, ...newsCards].forEach(card => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    });
                }
            });
        </script>
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
