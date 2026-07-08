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
  simpleMode?: boolean;
  onToggleSimpleMode?: () => void;
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
  onStartOnboarding,
  simpleMode = false,
  onToggleSimpleMode
}: NavbarProps) {
  const isGuest = sessionType === 'guest';

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'purple';
  });

  // Apply theme class to html root
  useEffect(() => {
    if (theme === 'purple') {
      document.documentElement.className = '';
    } else {
      document.documentElement.className = `theme-${theme}`;
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <>
      {/* 📱 / 💻 Thin top navbar (Universal, hides center tabs on desktop since left sidebar is active) */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 pt-safe">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
          
          {/* Brand Logo / Avatar */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
            <div className="w-8.5 h-8.5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {profile?.name ? profile.name[0].toUpperCase() : <Activity className="w-4 h-4" />}
            </div>
            <div>
              <h1 className="text-xs md:text-sm font-sans font-extrabold tracking-tight text-text-headline">
                Health Care Hub
              </h1>
              <span className="text-[8px] uppercase tracking-widest font-mono text-text-muted block">
                Wellness Portal
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs - Hidden on Desktop (lg:hidden) since sidebar handles it */}
          {profile && (
            <nav className="hidden md:flex lg:hidden items-center space-x-1 bg-slate-100/60 p-1 rounded-lg border border-slate-200/50">
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  currentTab === 'dashboard'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-text-body hover:text-text-headline hover:bg-slate-250/40'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleTabChange('exercises')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  currentTab === 'exercises'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-text-body hover:text-text-headline hover:bg-slate-250/40'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Exercises</span>
              </button>
              <button
                onClick={() => handleTabChange('meals')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  currentTab === 'meals'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-text-body hover:text-text-headline hover:bg-slate-250/40'
                }`}
              >
                <Soup className="w-3.5 h-3.5" />
                <span>Food Plan</span>
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
                  <ShieldAlert className="w-3 h-3 animate-pulse text-purple-600" />
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

            {profile && onToggleSimpleMode && (
              <button
                onClick={onToggleSimpleMode}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold transition active:scale-95 flex items-center space-x-1.5 shrink-0 ${
                  simpleMode
                    ? 'bg-emerald-50 border-emerald-250 text-emerald-700 font-extrabold'
                    : 'bg-slate-100/80 border-slate-200/50 text-text-muted hover:text-text-body'
                }`}
              >
                <span>{simpleMode ? 'Simple Mode (سادہ موڈ) 🟢' : 'Advanced Mode'}</span>
              </button>
            )}

            {/* Custom Theme Switcher Widget */}
            <div className="flex items-center space-x-1 bg-slate-100/80 border border-slate-200/60 p-0.5 rounded-xl shrink-0 shadow-sm">
              <Palette className="w-3 h-3 text-slate-500 ml-1 mr-0.5 shrink-0" />
              <button
                onClick={() => setTheme('purple')}
                className={`w-3.5 h-3.5 rounded-full bg-[#0284C7] border transition active:scale-90 cursor-pointer ${theme === 'purple' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                title="Sky Blue (Default)"
              />
              <button
                onClick={() => setTheme('midnight')}
                className={`w-3.5 h-3.5 rounded-full bg-[#DB2777] border transition active:scale-90 cursor-pointer ${theme === 'midnight' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                title="Blossom Rose"
              />
              <button
                onClick={() => setTheme('forest')}
                className={`w-3.5 h-3.5 rounded-full bg-[#10B981] border transition active:scale-90 cursor-pointer ${theme === 'forest' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                title="Forest Zen"
              />
              <button
                onClick={() => setTheme('sunrise')}
                className={`w-3.5 h-3.5 rounded-full bg-[#D97706] border transition active:scale-90 cursor-pointer ${theme === 'sunrise' ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                title="Sunrise Gold"
              />
            </div>

            {profile && (
              <>
                <button
                  onClick={() => handleTabChange('about')}
                  className={`p-2 rounded-xl border transition shrink-0 flex items-center justify-center h-8.5 w-8.5 active:scale-95 lg:hidden ${
                    currentTab === 'about'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-slate-100/80 border-slate-200/50 text-text-muted hover:text-text-body'
                  }`}
                  title="About & Credits"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleTabChange('settings')}
                  className={`p-2 rounded-xl border transition shrink-0 flex items-center justify-center h-8.5 w-8.5 active:scale-95 lg:hidden ${
                    currentTab === 'settings'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-slate-100/80 border-slate-200/50 text-text-muted hover:text-text-body'
                  }`}
                  title="Settings & Alerts"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}

            {profile ? (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-100/80 border border-slate-200/50 hover:bg-red-50 text-text-muted hover:text-red-650 transition shrink-0 flex items-center justify-center h-8.5 w-8.5 active:scale-95"
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
      </header>

      {/* 📱 sticky bottom Navigation Bar (Replicates Native App Feel, Hidden on Desktop: lg:hidden) */}
      {profile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-2 py-1 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          {[
            { id: 'dashboard', label: 'Home', icon: <Activity className="w-5 h-5" /> },
            { id: 'meals', label: 'Diet', icon: <Soup className="w-5 h-5" /> },
            { id: 'exercises', label: 'Exercise', icon: <Dumbbell className="w-5 h-5" /> },
            { id: 'mind', label: 'Calm', icon: <Brain className="w-5 h-5" /> }
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 h-12 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                  isActive ? 'text-[#0284C7] font-extrabold' : 'text-[#64748B] hover:text-text-headline'
                }`}
                style={{ minHeight: '48px' }} // ergonomic mobile touch target
              >
                {tab.icon}
                <span className="text-[9px] font-sans font-bold tracking-tight block mt-0.5">
                  {tab.label}
                </span>
                <span className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-300 ${isActive ? 'bg-[#0284C7] scale-100' : 'bg-transparent scale-0'}`} />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
