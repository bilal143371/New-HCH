import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Activity, ShieldAlert, LogOut, User, Menu, X, Clock, HelpCircle, Brain, Bell, Settings, Dumbbell, Soup, Palette } from 'lucide-react';

export interface NavbarProps {
  profile: UserProfile | null;
  sessionType: 'guest' | 'registered' | null;
  guestHoursRemaining: number;
  onUpgradeRequest: () => void;
  onLogout: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSimulateExpiration?: () => void;
}

export default function Navbar({
  profile,
  sessionType,
  guestHoursRemaining,
  onUpgradeRequest,
  onLogout,
  currentTab,
  setCurrentTab,
  onSimulateExpiration
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isGuest = sessionType === 'guest';

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme') || 'purple';
    return saved;
  });

  // Apply theme class to html root
  useEffect(() => {
    if (theme === 'purple') {
      document.documentElement.className = '';
    } else {
      document.documentElement.className = `theme-${theme}`;
    }
  }, [theme]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-nav/90 backdrop-blur-md border-b border-white/[0.06] px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
          <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-primary/20">
            <Activity className="w-5 h-5 text-gold-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm md:text-md font-sans font-extrabold tracking-tight text-text-headline">
              Health Care Hub
            </h1>
            <span className="text-[9px] uppercase tracking-wider font-mono text-text-muted block">
              Personal Wellness Assistant
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        {profile && (
        <nav className="hidden md:flex items-center space-x-1 bg-bg-surface/40 p-1 rounded-lg border border-white/[0.04]">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'dashboard'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-white/[0.02]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleTabChange('exercises')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'exercises'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-white/[0.02]'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Exercises</span>
            </button>
            <button
              onClick={() => handleTabChange('meals')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'meals'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-white/[0.02]'
              }`}
            >
              <Soup className="w-3.5 h-3.5" />
              <span>Food Plan</span>
            </button>
            <button
              onClick={() => handleTabChange('mind')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'mind'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-white/[0.02]'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Supportive Mind</span>
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'settings'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-white/[0.02]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Guest Mode Indicator and Upgrade button */}
          {profile && isGuest && (
            <div className="flex items-center space-x-2">
              <div 
                onClick={onSimulateExpiration}
                className="cursor-pointer flex items-center space-x-1.5 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/25 px-2.5 py-1 rounded-full text-[10px] text-purple-300 font-mono transition"
                title="Click to simulate 72-hour guest trial expiration"
              >
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Guest Trial:</span>
                <span>{guestHoursRemaining} hrs left</span>
              </div>
              
              <button
                onClick={onUpgradeRequest}
                className="hidden sm:inline-flex items-center px-3 py-1 btn-3d-purple text-[10px] font-bold rounded-full font-mono active:scale-95"
              >
                Upgrade Free ✦
              </button>
            </div>
          )}

          {/* Custom Theme Switcher Widget */}
          <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl shrink-0">
            <Palette className="w-3.5 h-3.5 text-purple-300 ml-1 mr-0.5 shrink-0" />
            <button
              onClick={() => setTheme('purple')}
              className={`w-4 h-4 rounded-full bg-[#7C3AED] border-2 transition active:scale-90 cursor-pointer ${theme === 'purple' ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Orchid Purple (Default)"
            />
            <button
              onClick={() => setTheme('midnight')}
              className={`w-4 h-4 rounded-full bg-[#EC4899] border-2 transition active:scale-90 cursor-pointer ${theme === 'midnight' ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Midnight OLED"
            />
            <button
              onClick={() => setTheme('forest')}
              className={`w-4 h-4 rounded-full bg-[#10B981] border-2 transition active:scale-90 cursor-pointer ${theme === 'forest' ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Forest Zen"
            />
            <button
              onClick={() => setTheme('sunrise')}
              className={`w-4 h-4 rounded-full bg-[#F59E0B] border-2 transition active:scale-90 cursor-pointer ${theme === 'sunrise' ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Sunrise Gold"
            />
          </div>

          {profile ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-xs font-semibold text-text-body transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
              <button
                onClick={onLogout}
                className="sm:hidden p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] text-text-muted hover:text-red-400 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabChange('landing')}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-purple-50 bg-purple-600 hover:bg-purple-500 transition"
            >
              Get Started
            </button>
          )}

          {/* Mobile Menu Button toggle */}
          {profile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-text-body"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

        </div>
      </div>

      {/* Mobile Menu dropdown drawer */}
      {mobileMenuOpen && profile && (
        <div className="md:hidden border-t border-white/[0.06] py-3 space-y-1 bg-bg-nav">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition ${
              currentTab === 'dashboard' ? 'bg-purple-500/15 text-purple-300 font-bold' : 'text-text-body hover:bg-white/[0.02]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleTabChange('exercises')}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition ${
              currentTab === 'exercises' ? 'bg-purple-500/15 text-purple-300 font-bold' : 'text-text-body hover:bg-white/[0.02]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
            <span>Exercises</span>
          </button>
          <button
            onClick={() => handleTabChange('meals')}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition ${
              currentTab === 'meals' ? 'bg-purple-500/15 text-purple-300 font-bold' : 'text-text-body hover:bg-white/[0.02]'
            }`}
          >
            <Soup className="w-3.5 h-3.5 text-purple-400" />
            <span>Food Plan</span>
          </button>
          <button
            onClick={() => handleTabChange('mind')}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition ${
              currentTab === 'mind' ? 'bg-purple-500/15 text-purple-300 font-bold' : 'text-text-body hover:bg-white/[0.02]'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Supportive Mind</span>
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition ${
              currentTab === 'settings' ? 'bg-purple-500/15 text-purple-300 font-bold' : 'text-text-body hover:bg-white/[0.02]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg flex items-center space-x-2 transition text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Log Out</span>
          </button>

          {isGuest && (
            <div className="px-4 py-2 pt-4 border-t border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span>Trial hours remaining:</span>
                <span>{guestHoursRemaining} hours</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onUpgradeRequest();
                }}
                className="w-full py-2 btn-3d-purple text-xs font-bold rounded-lg text-center block"
              >
                Upgrade to Free Account ✦
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
