'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaSignOutAlt, FaHome } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import Link from 'next/link';
import Script from 'next/script';

interface User {
  email: string;
  name: string;
  picture: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: { theme: string; size: string; width: number; shape: string }
          ) => void;
        };
      };
    };
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Check existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Authentication failed. Only kkamalesh117@gmail.com is allowed.');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Google Sign-In when GSI script is loaded
  useEffect(() => {
    if (!gsiLoaded || !googleClientId || user) return;

    const initializeGsi = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });

        const buttonDiv = document.getElementById('google-signin-button');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: 'filled_black',
            size: 'large',
            width: 300,
            shape: 'pill',
          });
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeGsi, 100);
    return () => clearTimeout(timer);
  }, [gsiLoaded, googleClientId, user, handleCredentialResponse]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-white/50 font-mono text-sm">Loading...</div>
      </div>
    );
  }

  // Login page
  if (!user) {
    return (
      <>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setGsiLoaded(true)}
        />
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center mx-auto mb-6">
              <HiShieldCheck className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/40 text-sm mb-8">
              Sign in with Google to access the CMS dashboard.
              <br />
              <span className="text-white/20 text-xs">Restricted to authorized email only.</span>
            </p>

            {!googleClientId ? (
              <div className="text-white/30 text-sm p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="mb-2">Google OAuth is not configured.</p>
                <p className="text-xs text-white/20">
                  Set <code className="text-[#06b6d4]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> environment variable with your Google OAuth 2.0 Client ID.
                </p>
              </div>
            ) : (
              <div id="google-signin-button" className="flex justify-center" />
            )}

            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mt-8 transition-colors"
            >
              <FaHome /> Back to Portfolio
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Admin header */}
      <header className="border-b border-white/5 bg-[#09090b]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-semibold text-white/90">
              CMS <span className="text-[#06b6d4]">Dashboard</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-sm text-white/60 hidden sm:inline">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
              aria-label="Sign out"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h1>
          <p className="text-white/40">Manage your portfolio content from here.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio data cards */}
          {[
            { title: 'Profile', desc: 'Manage your personal information and bio', count: '1 profile' },
            { title: 'Experience', desc: 'Update work history and career timeline', count: '9 entries' },
            { title: 'Skills', desc: 'Manage technical skills and proficiency levels', count: '20 skills' },
            { title: 'Projects', desc: 'Showcase your featured projects', count: '4 projects' },
            { title: 'Medium Articles', desc: 'Articles auto-synced from Medium RSS feed', count: 'Auto-synced' },
            { title: 'Contact Messages', desc: 'View messages from portfolio visitors', count: 'Logged to server' },
          ].map((card) => (
            <div key={card.title} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
              <p className="text-white/30 text-sm mb-4">{card.desc}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-[#06b6d4]">
                {card.count}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-white/40">
            <p>• <strong className="text-white/60">Static Data:</strong> Portfolio data (profile, skills, experiences, projects) is served from the Go backend as static JSON — no database required.</p>
            <p>• <strong className="text-white/60">Medium RSS:</strong> Blog articles are automatically fetched from your Medium RSS feed in real-time.</p>
            <p>• <strong className="text-white/60">Authentication:</strong> This admin panel is protected by Google OAuth 2.0, restricted to your email only.</p>
            <p>• <strong className="text-white/60">To update content:</strong> Edit the static data in the backend <code className="text-[#06b6d4] font-mono">handlers/handlers.go</code> file and redeploy.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-[#06b6d4] text-sm transition-colors"
          >
            <FaHome /> View Portfolio
          </Link>
        </div>
      </main>
    </div>
  );
}
