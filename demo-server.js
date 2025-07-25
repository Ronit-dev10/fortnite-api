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
            }
            .nav-links {
                display: flex;
                gap: 2rem;
                list-style: none;
            }
            .nav-links a {
                color: #fff;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s;
            }
            .nav-links a:hover {
                color: #00d4ff;
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
                <div class="logo">Fortnite Central</div>
                <ul class="nav-links">
                    <li><a href="#stats">Stats</a></li>
                    <li><a href="#leaderboards">Leaderboards</a></li>
                    <li><a href="#weapons">Weapons</a></li>
                    <li><a href="#news">News</a></li>
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

            <section class="section" id="weapons">
                <h2 class="section-title">Weapon Database</h2>
                <div class="weapons-grid">
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-legendary">Legendary</div>
                        <h4>SCAR Assault Rifle</h4>
                        <p>Damage: 36 • Range: 300m</p>
                        <p>High damage, accurate assault rifle perfect for mid to long range combat.</p>
                    </div>
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-epic">Epic</div>
                        <h4>Pump Shotgun</h4>
                        <p>Damage: 110 • Range: 50m</p>
                        <p>High damage shotgun effective at close range. One-shot potential to the head.</p>
                    </div>
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-rare">Rare</div>
                        <h4>Hunting Rifle</h4>
                        <p>Damage: 90 • Range: 400m</p>
                        <p>High precision sniper rifle. Requires skill but offers massive damage potential.</p>
                    </div>
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-uncommon">Uncommon</div>
                        <h4>SMG</h4>
                        <p>Damage: 19 • Range: 150m</p>
                        <p>High fire rate weapon perfect for close combat and destroying structures.</p>
                    </div>
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-common">Common</div>
                        <h4>Pistol</h4>
                        <p>Damage: 26 • Range: 200m</p>
                        <p>Reliable sidearm with decent damage and accuracy. Good for early game.</p>
                    </div>
                    <div class="weapon-card">
                        <div class="weapon-rarity rarity-legendary">Legendary</div>
                        <h4>Rocket Launcher</h4>
                        <p>Damage: 121 • Range: 300m</p>
                        <p>Explosive weapon that deals massive area damage. Limited ammo.</p>
                    </div>
                </div>
            </section>

            <section class="section" id="news">
                <h2 class="section-title">Latest Fortnite News</h2>
                <div class="news-grid">
                    <div class="news-card">
                        <div class="news-image">🎮</div>
                        <div class="news-content">
                            <h3 class="news-title">Chapter 5 Season 1 Now Live</h3>
                            <p class="news-date">December 3, 2023</p>
                            <p>The new season brings fresh locations, weapons, and gameplay mechanics to the island.</p>
                        </div>
                    </div>
                    <div class="news-card">
                        <div class="news-image">🏆</div>
                        <div class="news-content">
                            <h3 class="news-title">FNCS Championship Results</h3>
                            <p class="news-date">November 28, 2023</p>
                            <p>Congratulations to all competitors in this season's Fortnite Championship Series.</p>
                        </div>
                    </div>
                    <div class="news-card">
                        <div class="news-image">🛒</div>
                        <div class="news-content">
                            <h3 class="news-title">Item Shop Update</h3>
                            <p class="news-date">Daily Updates</p>
                            <p>Check out today's featured items, skins, and limited-time offers in the item shop.</p>
                        </div>
                    </div>
                    <div class="news-card">
                        <div class="news-image">🎵</div>
                        <div class="news-content">
                            <h3 class="news-title">Concert Event Announced</h3>
                            <p class="news-date">November 25, 2023</p>
                            <p>Join millions of players for an exclusive virtual concert experience in Party Royale.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Platform Features</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-icon">📊</span>
                        <h3 class="feature-title">Advanced Statistics</h3>
                        <p class="feature-desc">Track detailed performance metrics including accuracy, damage per minute, building speed, and survival time across all game modes.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🎯</span>
                        <h3 class="feature-title">Performance Analytics</h3>
                        <p class="feature-desc">Analyze your gameplay patterns, identify strengths and weaknesses, and get personalized tips to improve your game.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">👥</span>
                        <h3 class="feature-title">Squad Tracking</h3>
                        <p class="feature-desc">Monitor your squad's combined performance, compare team statistics, and optimize your group strategy.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">📈</span>
                        <h3 class="feature-title">Progress Monitoring</h3>
                        <p class="feature-desc">Watch your improvement over time with detailed graphs showing skill progression and ranking changes.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🔔</span>
                        <h3 class="feature-title">Real-time Alerts</h3>
                        <p class="feature-desc">Get notified about new seasons, events, item shop updates, and when your friends are online.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🌍</span>
                        <h3 class="feature-title">Global Rankings</h3>
                        <p class="feature-desc">See how you rank against players worldwide and in your region across different game modes and time periods.</p>
                    </div>
                </div>
            </section>
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
