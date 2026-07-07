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
  onStartOnboarding?: () => void;
}

export default function Navbar({
  profile,
  sessionType,
  guestHoursRemaining,
  onUpgradeRequest,
  onLogout,
  currentTab,
  setCurrentTab,
  onSimulateExpiration,
  onStartOnboarding
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
    <header className="sticky top-0 z-40 w-full bg-bg-nav/95 backdrop-blur-md border-b border-border-subtle px-4 md:px-8">
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
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/60 p-1 rounded-lg border border-slate-200/50">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition ${
                currentTab === 'dashboard'
                  ? 'bg-purple-600 text-purple-50 font-bold shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline hover:bg-slate-200/40'
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
                  : 'text-text-body hover:text-text-headline hover:bg-slate-200/40'
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
                  : 'text-text-body hover:text-text-headline hover:bg-slate-200/40'
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
                  : 'text-text-body hover:text-text-headline hover:bg-slate-200/40'
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
                  : 'text-text-body hover:text-text-headline hover:bg-slate-200/40'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Guest Mode Indicator and Upgrade button */}
          {profile && isGuest && (
            <div className="flex items-center space-x-1.5 mr-1">
              <div 
                onClick={onSimulateExpiration}
                className="cursor-pointer flex items-center space-x-1 bg-purple-100/80 hover:bg-purple-200/60 border border-purple-200/70 px-2 py-0.5 rounded-full text-[9px] text-purple-700 font-mono transition"
                title="Click to simulate 72-hour guest trial expiration"
              >
                <ShieldAlert className="w-3 h-3 animate-pulse text-purple-650" />
                <span className="hidden sm:inline">Guest Trial:</span>
                <span>{guestHoursRemaining}h left</span>
              </div>
              
              <button
                onClick={onUpgradeRequest}
                className="hidden lg:inline-flex items-center px-3 py-1 btn-3d-purple text-[10px] font-bold rounded-full font-mono active:scale-95"
              >
                Upgrade Free ✦
              </button>
            </div>
          )}

          {/* Custom Theme Switcher Widget */}
          <div className="flex items-center space-x-1 bg-slate-100/80 border border-slate-200/60 p-0.5 rounded-xl shrink-0 shadow-sm">
            <Palette className="w-3 h-3 text-slate-500 ml-1 mr-0.5 shrink-0" />
            <button
              onClick={() => setTheme('purple')}
              className={`w-3.5 h-3.5 rounded-full bg-[#0284C7] border transition active:scale-90 cursor-pointer ${theme === 'purple' ? 'border-white scale-110 shadow-sm ring-1 ring-slate-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Sky Blue (Default)"
            />
            <button
              onClick={() => setTheme('midnight')}
              className={`w-3.5 h-3.5 rounded-full bg-[#DB2777] border transition active:scale-90 cursor-pointer ${theme === 'midnight' ? 'border-white scale-110 shadow-sm ring-1 ring-slate-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Blossom Rose"
            />
            <button
              onClick={() => setTheme('forest')}
              className={`w-3.5 h-3.5 rounded-full bg-[#10B981] border transition active:scale-90 cursor-pointer ${theme === 'forest' ? 'border-white scale-110 shadow-sm ring-1 ring-slate-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Forest Zen"
            />
            <button
              onClick={() => setTheme('sunrise')}
              className={`w-3.5 h-3.5 rounded-full bg-[#D97706] border transition active:scale-90 cursor-pointer ${theme === 'sunrise' ? 'border-white scale-110 shadow-sm ring-1 ring-slate-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Sunrise Gold"
            />
          </div>

          {profile && (
            <button
              onClick={() => handleTabChange('settings')}
              className={`p-2 rounded-xl border transition shrink-0 flex items-center justify-center h-9 w-9 active:scale-95 ${
                currentTab === 'settings'
                  ? 'bg-purple-50 border-purple-350 text-purple-750 shadow-sm'
                  : 'bg-slate-100/80 border-slate-200/50 text-text-muted hover:text-text-body'
              }`}
              title="Settings & Alerts"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {profile ? (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100/80 border border-slate-200/50 hover:bg-red-50 text-text-muted hover:text-red-650 transition shrink-0 flex items-center justify-center h-9 w-9 active:scale-95"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onStartOnboarding}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-sm active:scale-95 shrink-0"
            >
              Get Started
            </button>
          )}

        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (Replicates Native App Feel) */}
      {profile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/70 flex justify-around items-center px-2 py-1 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex-1 h-12 flex flex-col items-center justify-center space-y-0.5 text-[9px] font-bold transition active:scale-95 ${
              currentTab === 'dashboard' ? 'text-purple-600 font-extrabold' : 'text-text-muted hover:text-text-body'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleTabChange('meals')}
            className={`flex-1 h-12 flex flex-col items-center justify-center space-y-0.5 text-[9px] font-bold transition active:scale-95 ${
              currentTab === 'meals' ? 'text-purple-600 font-extrabold' : 'text-text-muted hover:text-text-body'
            }`}
          >
            <Soup className="w-5 h-5" />
            <span>Diet</span>
          </button>
          <button
            onClick={() => handleTabChange('exercises')}
            className={`flex-1 h-12 flex flex-col items-center justify-center space-y-0.5 text-[9px] font-bold transition active:scale-95 ${
              currentTab === 'exercises' ? 'text-purple-600 font-extrabold' : 'text-text-muted hover:text-text-body'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span>Exercise</span>
          </button>
          <button
            onClick={() => handleTabChange('mind')}
            className={`flex-1 h-12 flex flex-col items-center justify-center space-y-0.5 text-[9px] font-bold transition active:scale-95 ${
              currentTab === 'mind' ? 'text-purple-600 font-extrabold' : 'text-text-muted hover:text-text-body'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>Calm</span>
          </button>
        </div>
      )}
    </header>
  );
}
