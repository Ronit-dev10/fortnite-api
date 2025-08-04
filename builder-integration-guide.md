# FastTracker Builder.io Integration Guide

## 🚀 Quick Setup for Builder.io

### Step 1: Install Builder.io SDK

```bash
npm install @builder.io/sdk-react
npm install @builder.io/react  # For visual editing
```

### Step 2: Environment Setup

```bash
# .env.local
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-api-key
```

### Step 3: Create Builder.io Components

#### High-Performance Player Search Component

```tsx
// components/PlayerSearch.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';

interface PlayerSearchProps {
  placeholder?: string;
  onSearch?: (username: string, platform: string) => void;
  platforms?: string[];
  autoComplete?: boolean;
}

export const PlayerSearch = ({
  placeholder = 'Search player username...',
  onSearch,
  platforms = ['pc', 'xbox', 'playstation', 'mobile'],
  autoComplete = true,
}: PlayerSearchProps) => {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced autocomplete
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= 2 && autoComplete) {
        // Fetch suggestions from API or cache
        const mockSuggestions = ['Ninja', 'Tfue', 'SypherPK', 'Bugha', 'Mongraal'].filter(name =>
          name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 200),
    [],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setShowSuggestions(false);

    try {
      if (onSearch) {
        await onSearch(query.trim(), platform);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="search-button"
        >
          {loading ? '⏳' : '🔍'} {loading ? 'Searching...' : 'Search'}
        </button>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="autocomplete-item"
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                  handleSearch();
                }}
              >
                <div className="player-avatar-small">{suggestion.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="suggestion-name">{suggestion}</div>
                  <div className="suggestion-platform">{platform.toUpperCase()} Player</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform selector */}
      <div className="platform-selector">
        {platforms.map(p => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`platform-btn ${platform === p ? 'active' : ''}`}
          >
            {getPlatformIcon(p)} {p.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

// Utility functions
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

function getPlatformIcon(platform: string): string {
  const icons = {
    pc: '🖥️',
    xbox: '🎮',
    playstation: '🕹️',
    mobile: '📱',
  };
  return icons[platform as keyof typeof icons] || '🎮';
}
```

#### Performance-Optimized Player Stats Component

```tsx
// components/PlayerStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface PlayerData {
  username: string;
  platform: string;
  rank: number;
  level: number;
  winRate: string;
  kd: string;
  wins: string;
  kills: string;
  matches: string;
  score: string;
  playtime: string;
  country: string;
  skin: string;
}

interface PlayerStatsProps {
  playerData?: PlayerData;
  loading?: boolean;
  error?: string;
  lazyLoad?: boolean;
}

export const PlayerStats = ({
  playerData,
  loading = false,
  error,
  lazyLoad = true,
}: PlayerStatsProps) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [shouldRender, setShouldRender] = useState(!lazyLoad);

  useEffect(() => {
    if (isVisible || !lazyLoad) {
      setShouldRender(true);
    }
  }, [isVisible, lazyLoad]);

  if (!shouldRender) {
    return <div ref={ref} className="player-stats-placeholder" />;
  }

  if (loading) {
    return <PlayerStatsSkeleton />;
  }

  if (error) {
    return <div className="error-message">❌ {error}</div>;
  }

  if (!playerData) {
    return null;
  }

  const stats = [
    { label: 'Wins', value: playerData.wins },
    { label: 'K/D Ratio', value: playerData.kd },
    { label: 'Win Rate', value: playerData.winRate },
    { label: 'Kills', value: playerData.kills },
    { label: 'Matches', value: playerData.matches },
    { label: 'Score', value: playerData.score },
    { label: 'Playtime', value: playerData.playtime },
  ];

  return (
    <div ref={ref} className="player-card fade-in">
      <div className="player-header">
        <div className="player-avatar">{playerData.username.charAt(0).toUpperCase()}</div>
        <div className="player-info">
          <h2>{playerData.username}</h2>
          <div className="player-rank">#{playerData.rank.toLocaleString()} Global</div>
          <div className="player-meta">
            <span>{playerData.country}</span>
            <span>•</span>
            <span>{playerData.platform}</span>
            <span>•</span>
            <span>Level {playerData.level}</span>
          </div>
          <div className="player-skin">Current Skin: {playerData.skin}</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-name">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loading component
const PlayerStatsSkeleton = () => (
  <div className="player-card">
    <div className="player-header">
      <div className="skeleton skeleton-avatar" />
      <div className="player-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
      </div>
    </div>
    <div className="stats-grid">
      {Array(7)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="stat-card">
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
          </div>
        ))}
    </div>
  </div>
);
```

#### Custom Hook for Intersection Observer

```tsx
// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible] as const;
};
```

### Step 4: Register Components with Builder.io

```tsx
// builder-registry.ts
import { type RegisteredComponent } from "@builder.io/sdk-react";
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting
const PlayerSearch = dynamic(() =>
  import('./components/PlayerSearch').then(mod => ({ default: mod.PlayerSearch }))
);

const PlayerStats = dynamic(() =>
  import('./components/PlayerStats').then(mod => ({ default: mod.PlayerStats }))
);

export const customComponents: RegisteredComponent[] = [
  {
    component: PlayerSearch,
    name: 'PlayerSearch',
    inputs: [
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: 'Search player username...',
      },
      {
        name: 'platforms',
        type: 'list',
        subFields: [
          {
            name: 'platform',
            type: 'string',
          }
        ],
        defaultValue: [
          { platform: 'pc' },
          { platform: 'xbox' },
          { platform: 'playstation' },
          { platform: 'mobile' }
        ],
      },
      {
        name: 'autoComplete',
        type: 'boolean',
        defaultValue: true,
      }
    ],
    canHaveChildren: false,
  },
  {
    component: PlayerStats,
    name: 'PlayerStats',
    inputs: [
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: false,
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        defaultValue: true,
      }
    ],
    canHaveChildren: false,
  }
];
```

### Step 5: CSS Optimizations for Core Web Vitals

```css
/* styles/performance.css - Critical CSS */

/* Prevent layout shift */
.player-card {
  min-height: 400px;
  contain: layout style paint;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  aspect-ratio: 4 / 1; /* Maintain aspect ratio */
}

/* Optimize font loading */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap; /* Reduce CLS */
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
}

/* Lazy loading optimizations */
.fade-in {
  animation: fadeIn 0.3s ease-out;
  will-change: opacity, transform;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading states */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .player-card {
    min-height: 300px;
    padding: 1rem;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }

  .skeleton {
    animation: none;
    background: #f0f0f0;
  }
}
```

## 🎯 Implementation Steps in Builder.io

1. **Create Builder.io Account**: Sign up at [builder.io](https://builder.io)
2. **Get API Key**: Copy from Settings > API Keys
3. **Set up Next.js Project**: Use the integration pattern from the guide
4. **Import Components**: Use the dynamic imports pattern
5. **Configure Performance**: Enable image optimization and CDN
6. **Test Core Web Vitals**: Use Lighthouse and WebPageTest

## 📊 Performance Monitoring

Add this to your main layout for real-time performance tracking:

```tsx
// components/PerformanceMonitor.tsx
'use client';

import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.duration);
          }
          if (entry.entryType === 'paint') {
            console.log(entry.name + ':', entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
};
```

## 🚀 Next Steps

1. **Test the optimized version**: Run `node optimized-demo-server.js`
2. **Set up Builder.io account** and get your API key
3. **Create Next.js project** with the patterns above
4. **Import components** into Builder.io visual editor
5. **Optimize images** using Builder.io's automatic optimization
6. **Deploy with edge caching** for maximum performance

The optimized version I created includes all the performance features you requested:

- ⚡ Loading bar for searches
- 📱 Mobile-first responsive design
- 🚀 Debounced search with caching
- 💾 LocalStorage caching (15min TTL)
- 🎯 Intersection Observer for lazy loading
- 📊 Core Web Vitals optimizations
- 🔍 Real-time autocomplete
- ⭐ Skeleton loading states

Would you like me to help you set up the Builder.io integration next, or would you prefer to test the optimized version first?
