export interface PageLog {
  page: string;
  timeSpent: number; // in seconds
  enteredAt: string;
}

let activeSessionToken = sessionStorage.getItem('portfolio_session_token') || '';
let activeVisitorId = localStorage.getItem('portfolio_visitor_id') || '';
let pageLogs: PageLog[] = [];
let currentPageStart = Date.now();
let totalStart = Date.now();

// Track overall traffic origins
function getTrafficSource(): string {
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  if (referrer.includes('google.com') || referrer.includes('bing.com') || referrer.includes('yahoo.com')) {
    return 'search';
  }
  if (referrer.includes('facebook.com') || referrer.includes('twitter.com') || referrer.includes('linkedin.com') || referrer.includes('instagram.com') || referrer.includes('t.co')) {
    return 'social';
  }
  return 'referral';
}

/**
 * Log visual page entries dynamically
 */
export function trackPageTransition(newPageName: string) {
  const now = Date.now();
  const secondsSpent = Math.round((now - currentPageStart) / 1000);
  
  // Update time for previous page if exists
  if (pageLogs.length > 0) {
    pageLogs[pageLogs.length - 1].timeSpent += secondsSpent;
  }

  // Record new page target
  pageLogs.push({
    page: newPageName,
    timeSpent: 0,
    enteredAt: new Date().toISOString()
  });

  currentPageStart = now;
  syncSessionUpdate();
}

/**
 * Transmit heartbeat records to Express backend API
 */
async function syncSessionUpdate(finalExit = false) {
  if (!activeSessionToken) return;

  const now = Date.now();
  const currentSeconds = Math.round((now - currentPageStart) / 1000);

  // Accumulate time on current view immediately
  if (pageLogs.length > 0) {
    pageLogs[pageLogs.length - 1].timeSpent += currentSeconds;
    currentPageStart = now; // Reset page load pivot
  }

  const duration = Math.round((now - totalStart) / 1000);

  const payload = {
    sessionToken: activeSessionToken,
    duration,
    pagesVisited: pageLogs,
    exitTime: finalExit ? new Date().toISOString() : undefined
  };

  try {
    // Keep Beacon alive or submit standard sync
    if (finalExit && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/update-session', blob);
    } else {
      await fetch('/api/update-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.warn('⚡ Tracker sync failed (expected offline/sandbox fallback):', error);
  }
}

/**
 * Configure global listeners (visibility change, exit intent, focus boundaries)
 */
export async function initializeTracker(initialSection: string) {
  const isReturning = localStorage.getItem('portfolio_visitor_exists') === 'true';
  localStorage.setItem('portfolio_visitor_exists', 'true');

  const trafficSource = getTrafficSource();

  // Create starting state logs
  pageLogs.push({
    page: initialSection,
    timeSpent: 0,
    enteredAt: new Date().toISOString()
  });

  try {
    const res = await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isReturning,
        trafficSource,
        sessionToken: activeSessionToken || undefined,
        visitorId: activeVisitorId || undefined
      })
    });

    if (res.ok) {
      const data = await res.json();
      activeSessionToken = data.sessionToken;
      activeVisitorId = data.visitorId;

      sessionStorage.setItem('portfolio_session_token', data.sessionToken);
      localStorage.setItem('portfolio_visitor_id', data.visitorId);
    }
  } catch (err) {
    console.warn('⚠️ Tracker could not start online collection. Sandbox records active.');
    // Generate transient mock tokens to guarantee UI doesn't crash
    if (!activeSessionToken) {
      activeSessionToken = 'mock_sess_' + Math.random().toString(36).substr(2, 9);
      activeVisitorId = 'mock_vis_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('portfolio_session_token', activeSessionToken);
    }
  }

  // 1. Tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      syncSessionUpdate();
    } else {
      // User returned, reset page segment timestamp
      currentPageStart = Date.now();
    }
  });

  // 2. Unload boundaries
  window.addEventListener('beforeunload', () => {
    syncSessionUpdate(true);
  });

  // 3. Heartbeat cycle (every 15 seconds) to handle active navigation stability
  setInterval(() => {
    syncSessionUpdate();
  }, 15000);
}
