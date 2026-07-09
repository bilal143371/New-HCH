import React, { useState } from 'react';
import { UserProfile } from '../types';
import { theme } from '../styles/theme';
import '../styles/design-system.css';
import {
  Home,
  UtensilsCrossed,
  Dumbbell,
  Brain,
  Settings,
  LogOut,
  X,
  ShieldAlert,
  Activity,
  Info,
} from 'lucide-react';

const { colors, fonts, radii, shadows, spacing } = theme;

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

/* ─── Sidebar nav items (6 max) ────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',         icon: Home },
  { id: 'meals',     label: 'Meals',        icon: UtensilsCrossed },
  { id: 'exercises', label: 'Workouts',     icon: Dumbbell },
  { id: 'mind',      label: 'Mind Support', icon: Brain },
  { id: 'settings',  label: 'Settings',     icon: Settings },
  { id: 'about',     label: 'About',        icon: Info },
];

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
}: NavbarProps) {
  const isGuest = sessionType === 'guest';

  /* Dismissible guest trial banner */
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <>
      {/* ─────────────────────────────────────────────────────
          TOP HEADER BAR (all breakpoints)
         ───────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          background: `${colors.white}ee`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${colors.success}40`,
        }}
      >
        {/* ── Guest trial banner (dismissible) ── */}
        {profile && isGuest && !bannerDismissed && (
          <div
            style={{
              background: `${colors.accent}10`,
              borderBottom: `1px solid ${colors.accent}25`,
              padding: `${spacing[4]} ${spacing[16]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[8],
              fontFamily: fonts.body,
              fontSize: '0.8125rem',
              color: colors.text,
            }}
          >
            <ShieldAlert size={14} style={{ color: colors.accent, flexShrink: 0 }} />
            <span>
              <strong style={{ color: colors.accent }}>Guest Trial</strong> — {guestHoursRemaining}h remaining.
              <button
                onClick={onUpgradeRequest}
                style={{
                  marginLeft: spacing[8],
                  color: colors.white,
                  background: colors.accent,
                  border: 'none',
                  borderRadius: radii.button,
                  padding: `2px ${spacing[8]}`,
                  fontWeight: 600,
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Upgrade Free
              </button>
            </span>
            <button
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss banner"
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.muted,
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Main bar ── */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${spacing[16]}`,
          }}
        >
          {/* Brand */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[8],
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: radii.full,
                background: colors.primary,
                color: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '0.8125rem',
                boxShadow: shadows.card,
              }}
            >
              {profile?.name ? profile.name[0].toUpperCase() : <Activity size={16} />}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: fonts.heading,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: colors.text,
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                Health Care Hub
              </h1>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: '0.625rem',
                  color: colors.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Wellness Portal
              </span>
            </div>
          </div>

          {/* Tablet Nav Bar: Visible only on tablet (>= 640px and < 1024px) */}
          <nav
            className="hidden sm:flex lg:hidden items-center"
            style={{
              gap: spacing[4],
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[4],
                    padding: `6px ${spacing[12]}`,
                    borderRadius: radii.button,
                    border: 'none',
                    background: isActive ? colors.primary : 'transparent',
                    color: isActive ? colors.white : colors.muted,
                    cursor: 'pointer',
                    fontFamily: fonts.body,
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = `${colors.success}20`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={14} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
            {profile ? (
              <button
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                  padding: `6px ${spacing[16]}`,
                  borderRadius: radii.button,
                  border: `1px solid ${colors.success}60`,
                  background: 'transparent',
                  color: colors.muted,
                  fontFamily: fonts.body,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e54d2e60';
                  e.currentTarget.style.color = '#c53d2c';
                  e.currentTarget.style.background = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.success}60`;
                  e.currentTarget.style.color = colors.muted;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onStartOnboarding}
                style={{
                  padding: `8px ${spacing[24]}`,
                  borderRadius: radii.button,
                  border: 'none',
                  background: colors.primary,
                  color: colors.white,
                  fontFamily: fonts.body,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: shadows.card,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────
          MOBILE BOTTOM TAB BAR  (hidden on sm+)
         ───────────────────────────────────────────────────── */}
      {profile && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
          style={{
            background: `${colors.white}dd`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: `1px solid ${colors.success}30`,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: `${spacing[4]} ${spacing[8]}`,
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: `${spacing[4]} 0`,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? colors.primary : colors.muted,
                  transition: 'all 0.2s',
                  minHeight: '48px',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: '0.5625rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.label}
                </span>
                {/* Active dot */}
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: radii.full,
                    background: isActive ? colors.primary : 'transparent',
                    transition: 'all 0.3s',
                    transform: isActive ? 'scale(1)' : 'scale(0)',
                  }}
                />
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
