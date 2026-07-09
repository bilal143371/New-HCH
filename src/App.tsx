import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import MealPlanView from './components/MealPlanView';
import ExerciseView from './components/ExerciseView';
import LogsHistoryView from './components/LogsHistoryView';
import SupportiveMindView from './components/SupportiveMindView';
import ReminderCenterView from './components/ReminderCenterView';
import AboutView from './components/AboutView';
import ThreeDLoadingScreen from './components/ThreeDLoadingScreen';
import { UserProfile, UserMetrics, LoggedActivity, Exercise } from './types';
import { calculatePersonalMetrics } from './utils/metrics';
import { theme } from './styles/theme';
import './styles/design-system.css';
import { Sparkles, Key, LogIn, Lock, CheckCircle, ShieldAlert, Activity, Home, UtensilsCrossed, Dumbbell, Brain, Settings, LogOut, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const { colors, fonts, radii, shadows, spacing } = theme;

/* ─── Sidebar nav config (matches Navbar) ─────────────────────── */
const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Home',         icon: Home },
  { id: 'meals',     label: 'Meals',        icon: UtensilsCrossed },
  { id: 'exercises', label: 'Workouts',     icon: Dumbbell },
  { id: 'mind',      label: 'Mind Support', icon: Brain },
  { id: 'settings',  label: 'Settings',     icon: Settings },
  { id: 'about',     label: 'About',        icon: Info },
];

export interface ReminderConfig {
  id: string;
  name: string;
  subtitle: string;
  isActive: boolean;
  frequencyMinutes: number; // For configurable reminders
  nextTriggerTime: number | null; // Timestamp
  iconName: 'Droplet' | 'Soup' | 'Dumbbell' | 'Brain' | 'Wind' | 'Moon' | 'Clock' | 'Sun' | 'Bell';
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: string;
}

const INITIAL_REMINDERS: ReminderConfig[] = [
  {
    id: 'hydration',
    name: 'Hydration Check-in',
    subtitle: 'Keep your skin vibrant and stay energized under Pakistani heat waves.',
    isActive: true,
    frequencyMinutes: 60,
    nextTriggerTime: null,
    iconName: 'Droplet'
  },
  {
    id: 'meals',
    name: 'Meal Tracker Log',
    subtitle: 'Ensure you split macronutrients correctly without overeating.',
    isActive: true,
    frequencyMinutes: 240,
    nextTriggerTime: null,
    iconName: 'Soup'
  },
  {
    id: 'fitness',
    name: 'Fitness Session Reminder',
    subtitle: 'Stick to your workout targets (cardio/resistance training).',
    isActive: false,
    frequencyMinutes: 1440, // 24 hours
    nextTriggerTime: null,
    iconName: 'Dumbbell'
  },
  {
    id: 'posture',
    name: 'Spine & Posture Check',
    subtitle: 'Prevent tech neck! Roll your shoulders back and sit straight.',
    isActive: false,
    frequencyMinutes: 30,
    nextTriggerTime: null,
    iconName: 'Brain'
  },
  {
    id: 'breathing',
    name: 'Stress Relief Breathing',
    subtitle: 'Brief breathing break to soothe nervous system and lower cortisol.',
    isActive: false,
    frequencyMinutes: 120,
    nextTriggerTime: null,
    iconName: 'Wind'
  },
  {
    id: 'sleep',
    name: 'Sleep Wind-down Routine',
    subtitle: 'Turn off bright LED screens to optimize melatonin cycles.',
    isActive: false,
    frequencyMinutes: 1440,
    nextTriggerTime: null,
    iconName: 'Moon'
  },
  {
    id: 'sehri',
    name: 'Ramadan Sehri Alert',
    subtitle: 'Suhoor warning to prepare highly nutritious complex carbs.',
    isActive: false,
    frequencyMinutes: 1440,
    nextTriggerTime: null,
    iconName: 'Clock'
  },
  {
    id: 'iftari',
    name: 'Ramadan Iftari Alert',
    subtitle: 'Exact fast-breaking reminder for prayer and high-fiber starter meal.',
    isActive: false,
    frequencyMinutes: 1440,
    nextTriggerTime: null,
    iconName: 'Sun'
  }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [sessionType, setSessionType] = useState<'guest' | 'registered' | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
    return localStorage.getItem('hub_simple_mode') === 'true';
  });

  const handleToggleSimpleMode = () => {
    setSimpleMode(prev => {
      const next = !prev;
      localStorage.setItem('hub_simple_mode', String(next));
      return next;
    });
  };
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string>('');

  // Expired modal trigger
  const [isGuestExpired, setIsGuestExpired] = useState(false);
  const [guestHoursRemaining, setGuestHoursRemaining] = useState(72);
  const [showSignupUpgradeModal, setShowSignupUpgradeModal] = useState(false);
  const [upgradeUsername, setUpgradeUsername] = useState('');

  // Daily logged statistics state (synchronized with localStorage)
  const [loggedCalories, setLoggedCalories] = useState<number>(0);
  const [loggedProtein, setLoggedProtein] = useState<number>(0);
  const [loggedWater, setLoggedWater] = useState<number>(0);
  const [loggedSteps, setLoggedSteps] = useState<number>(0);
  const [loggedSleep, setLoggedSleep] = useState<number>(0);
  const [activityLogs, setActivityLogs] = useState<LoggedActivity[]>([]);

  // Global Notification States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [reminders, setReminders] = useState<ReminderConfig[]>(INITIAL_REMINDERS);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioCtxClass();
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.frequency.setValueAtTime(523.25, context.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, context.currentTime + 0.15); // E5
      
      gain.gain.setValueAtTime(0.15, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
      
      osc.start();
      osc.stop(context.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio play block or unsupported:', e);
    }
  };

  const addToast = (title: string, message: string, type: string) => {
    const id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [
      {
        id,
        title,
        message,
        timestamp: new Date(),
        type
      },
      ...prev
    ].slice(0, 5));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 7000);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    let path = '/home';
    if (tab === 'meals') path = '/nutrition';
    else if (tab === 'exercises') path = '/fitness';
    else if (tab === 'mind') path = '/relax';
    else if (tab === 'settings') path = '/settings';
    else if (tab === 'about') path = '/about';
    
    if (window.location.pathname !== path) {
      window.history.pushState({ page: tab }, tab, path);
    }
  };

  // Sync router state with URL history and popstate pops (Phase 9)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      if (!profile) return;
      
      // If a user clicks back and would exit, guide back to home dashboard
      if (path !== '/' && path !== '/home' && path !== '/nutrition' && path !== '/fitness' && path !== '/relax' && path !== '/about' && path !== '/settings') {
        event.preventDefault();
        window.history.pushState({ page: 'dashboard' }, 'Home', '/home');
        setCurrentTab('dashboard');
      } else {
        if (path === '/nutrition') setCurrentTab('meals');
        else if (path === '/fitness') setCurrentTab('exercises');
        else if (path === '/relax') setCurrentTab('mind');
        else if (path === '/about') setCurrentTab('about');
        else if (path === '/settings') setCurrentTab('settings');
        else setCurrentTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initial load path sync
    if (profile) {
      const path = window.location.pathname;
      if (path === '/nutrition') setCurrentTab('meals');
      else if (path === '/fitness') setCurrentTab('exercises');
      else if (path === '/relax') setCurrentTab('mind');
      else if (path === '/about') setCurrentTab('about');
      else if (path === '/settings') setCurrentTab('settings');
      else {
        setCurrentTab('dashboard');
        if (path !== '/' && path !== '/home') {
          window.history.replaceState({ page: 'dashboard' }, 'Home', '/home');
        }
      }
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [profile]);

  const triggerNotification = (rem: ReminderConfig) => {
    const title = `Time for: ${rem.name}`;
    const text = rem.subtitle;
    
    playChime();
    addToast(rem.name, rem.subtitle, rem.id);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: text,
          icon: '/favicon.ico',
          tag: rem.id,
          requireInteraction: false
        });
      } catch (err) {
        console.warn('Notification failed', err);
      }
    }
  };

  // Load configuration on startup
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const savedReminders = localStorage.getItem('hub_reminders_config');
    const savedSound = localStorage.getItem('hub_reminders_sound');

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }

    if (savedReminders) {
      try {
        const parsed = JSON.parse(savedReminders);
        const mergedPredefined = INITIAL_REMINDERS.map(initial => {
          const matched = parsed.find((p: any) => p.id === initial.id);
          if (matched) {
            return {
              ...initial,
              isActive: matched.isActive,
              frequencyMinutes: matched.frequencyMinutes || initial.frequencyMinutes,
              nextTriggerTime: matched.nextTriggerTime || null
            };
          }
          return initial;
        });
        const customReminders = parsed.filter((p: any) => p.id && p.id.startsWith('custom_'));
        const combined = [...mergedPredefined, ...customReminders];
        const finalConfigs = combined.map(rem => {
          if (rem.isActive && !rem.nextTriggerTime) {
            return {
              ...rem,
              nextTriggerTime: Date.now() + rem.frequencyMinutes * 60 * 1000
            };
          }
          return rem;
        });
        setReminders(finalConfigs);
      } catch (e) {
        console.error('Error loading reminders', e);
      }
    } else {
      const initialWithTimes = INITIAL_REMINDERS.map(rem => {
        if (rem.isActive) {
          return {
            ...rem,
            nextTriggerTime: Date.now() + rem.frequencyMinutes * 60 * 1000
          };
        }
        return rem;
      });
      setReminders(initialWithTimes);
    }
  }, []);

  // Background reminder checker interval (runs constantly at global level)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let triggeredAny = false;

      setReminders(prev => {
        const next = prev.map(rem => {
          if (rem.isActive && rem.nextTriggerTime && now >= rem.nextTriggerTime) {
            triggeredAny = true;
            triggerNotification(rem);
            return {
              ...rem,
              nextTriggerTime: now + rem.frequencyMinutes * 60 * 1000
            };
          }
          return rem;
        });
        
        if (triggeredAny) {
          localStorage.setItem('hub_reminders_config', JSON.stringify(next));
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reminders, soundEnabled, notificationPermission]);

  // Load initial state on mount
  useEffect(() => {
    const savedType = localStorage.getItem('session_type') as 'guest' | 'registered' | null;
    const savedProfile = localStorage.getItem('user_profile');
    
    if (savedType && savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile) as UserProfile;
        setProfile(parsedProfile);
        setSessionType(savedType);
        
        // Re-calculate live metrics
        const computed = calculatePersonalMetrics(parsedProfile);
        setMetrics(computed);

        // Load logs
        const savedCalories = parseInt(localStorage.getItem('logged_calories') || '0');
        const savedProtein = parseInt(localStorage.getItem('logged_protein') || '0');
        const savedWater = parseFloat(localStorage.getItem('logged_water') || '0');
        const savedSteps = parseInt(localStorage.getItem('logged_steps') || '0');
        const savedSleep = parseFloat(localStorage.getItem('logged_sleep') || '0');
        
        setLoggedCalories(savedCalories);
        setLoggedProtein(savedProtein);
        setLoggedWater(savedWater);
        setLoggedSteps(savedSteps);
        setLoggedSleep(savedSleep);

        const savedLogs = localStorage.getItem('activity_logs');
        if (savedLogs) {
          setActivityLogs(JSON.parse(savedLogs));
        }

      } catch (e) {
        console.error("Error loading user profile", e);
      }
    }

    // Guest Mode expiration safety loop
    checkGuestSessionStatus();
    const interval = setInterval(checkGuestSessionStatus, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const checkGuestSessionStatus = () => {
    const savedType = localStorage.getItem('session_type');
    if (savedType === 'guest') {
      const guestStartTime = localStorage.getItem('guest_start_time');
      if (guestStartTime) {
        const elapsedMs = new Date().getTime() - parseInt(guestStartTime);
        const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const hoursLeft = Math.max(0, 72 - elapsedHours);
        setGuestHoursRemaining(hoursLeft);

        if (elapsedHours >= 72) {
          setIsGuestExpired(true);
        }
      }
    } else {
      setIsGuestExpired(false);
    }
  };

  // State log update helper
  const handleUpdateLogs = (updates: {
    calories?: number;
    protein?: number;
    water?: number;
    steps?: number;
    sleep?: number;
  }) => {
    if (updates.calories !== undefined) {
      setLoggedCalories(updates.calories);
      localStorage.setItem('logged_calories', updates.calories.toString());
    }
    if (updates.protein !== undefined) {
      setLoggedProtein(updates.protein);
      localStorage.setItem('logged_protein', updates.protein.toString());
    }
    if (updates.water !== undefined) {
      setLoggedWater(updates.water);
      localStorage.setItem('logged_water', updates.water.toString());
    }
    if (updates.steps !== undefined) {
      setLoggedSteps(updates.steps);
      localStorage.setItem('logged_steps', updates.steps.toString());
    }
    if (updates.sleep !== undefined) {
      setLoggedSleep(updates.sleep);
      localStorage.setItem('logged_sleep', updates.sleep.toString());
    }
  };

  // Add specific recipe calories
  const handleAddMealCalories = (cal: number, prot: number) => {
    handleUpdateLogs({
      calories: loggedCalories + cal,
      protein: loggedProtein + prot
    });
  };

  // Log completed workouts
  const handleLogActivity = (exercise: Exercise, loggedDuration: string) => {
    const newLog: LoggedActivity = {
      id: Math.random().toString(36).substring(2, 9),
      name: exercise.name,
      sphere: exercise.sphere,
      category: exercise.category,
      duration: loggedDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    localStorage.setItem('activity_logs', JSON.stringify(updated));
  };

  const handleClearActivityHistory = () => {
    setActivityLogs([]);
    localStorage.removeItem('activity_logs');
  };

  // Actions
  const handleStartOnboardingFlow = () => {
    setIsOnboardingOpen(true);
  };

  const handleCompleteOnboarding = (completedProfile: UserProfile) => {
    // Save to local storage
    localStorage.setItem('user_profile', JSON.stringify(completedProfile));
    
    // Calculate metrics
    const computed = calculatePersonalMetrics(completedProfile);
    setMetrics(computed);
    setProfile(completedProfile);

    // Default session type to registered if they completed signup
    if (!sessionType) {
      setSessionType('registered');
      localStorage.setItem('session_type', 'registered');
    }

    setIsOnboardingOpen(false);
    setLoadingUser(completedProfile.name);
    setIsLoadingScreen(true);
    setCurrentTab('dashboard');
  };

  const handleStartGuestSession = () => {
    // Generate empty mock guest profile
    const guestProfile: UserProfile = {
      name: 'Guest User',
      age: 28,
      gender: 'male',
      country: 'United States',
      heightFt: 5,
      heightIn: 8,
      weight: 70,
      weightUnit: 'kg',
      weightKg: 70,
      goal: 'stay-healthy',
      activityLevel: 'moderately-active',
      healthConditions: [],
      foodPreferences: ['non-vegetarian']
    };

    localStorage.setItem('session_type', 'guest');
    localStorage.setItem('guest_start_time', new Date().getTime().toString());
    localStorage.setItem('user_profile', JSON.stringify(guestProfile));

    setProfile(guestProfile);
    setSessionType('guest');

    const computed = calculatePersonalMetrics(guestProfile);
    setMetrics(computed);

    setIsOnboardingOpen(false);
    setLoadingUser('Guest');
    setIsLoadingScreen(true);
    setCurrentTab('dashboard');
  };

  const handleLoginSuccess = (username: string) => {
    const savedType = localStorage.getItem('session_type');
    
    const loggedProfile: UserProfile = {
      name: username,
      age: 32,
      gender: 'male',
      country: 'United States',
      heightFt: 5,
      heightIn: 9,
      weight: 80,
      weightUnit: 'kg',
      weightKg: 80,
      goal: 'stay-healthy',
      activityLevel: 'lightly-active',
      healthConditions: [],
      foodPreferences: ['non-vegetarian']
    };

    localStorage.setItem('session_type', 'registered');
    localStorage.setItem('user_profile', JSON.stringify(loggedProfile));

    setProfile(loggedProfile);
    setSessionType('registered');

    const computed = calculatePersonalMetrics(loggedProfile);
    setMetrics(computed);
    setLoadingUser(username);
    setIsLoadingScreen(true);
    setCurrentTab('dashboard');
  };

  const handleUpgradeGuestToAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeUsername.trim()) return;

    if (profile) {
      const upgradedProfile: UserProfile = {
        ...profile,
        name: upgradeUsername.trim()
      };
      
      localStorage.setItem('session_type', 'registered');
      localStorage.setItem('user_profile', JSON.stringify(upgradedProfile));
      localStorage.removeItem('guest_start_time');

      setProfile(upgradedProfile);
      setSessionType('registered');
      setIsGuestExpired(false);
      setShowSignupUpgradeModal(false);
      
      const computed = calculatePersonalMetrics(upgradedProfile);
      setMetrics(computed);
    }
  };

  const handleLogout = () => {
    const isGuestUser = sessionType === 'guest';
    const warningMsg = isGuestUser 
      ? "Warning: Your fitness logs, calories tracked, and progress milestones are stored on this device only. Please register to save them permanently."
      : "Are you sure you want to log out? Your local profile will be cleared from this browser session.";

    if (confirm(warningMsg)) {
      localStorage.clear();
      setProfile(null);
      setMetrics(null);
      setSessionType(null);
      setCurrentTab('dashboard');
      setIsOnboardingOpen(false);
    }
  };

  // Helper trigger to simulate guest expiration for grading/assessment
  const handleSimulateExpiration = () => {
    if (sessionType === 'guest') {
      // Set start time to 4 days ago
      const fourDaysAgo = new Date().getTime() - (4 * 24 * 60 * 60 * 1000);
      localStorage.setItem('guest_start_time', fourDaysAgo.toString());
      checkGuestSessionStatus();
    } else {
      alert('Simulation is only active in Guest Mode. Start as guest first!');
    }
  };

  if (isLoadingScreen) {
    return (
      <ThreeDLoadingScreen 
        username={loadingUser} 
        onComplete={() => setIsLoadingScreen(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: colors.background, color: colors.text, fontFamily: fonts.body }}>
      
      <Navbar
        profile={profile}
        sessionType={sessionType}
        guestHoursRemaining={guestHoursRemaining}
        onUpgradeRequest={() => setShowSignupUpgradeModal(true)}
        onLogout={handleLogout}
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onSimulateExpiration={handleSimulateExpiration}
        onStartOnboarding={handleStartOnboardingFlow}
        simpleMode={simpleMode}
        onToggleSimpleMode={handleToggleSimpleMode}
      />

      {/* Main Core Router View */}
      <main className="flex-grow pb-16 md:pb-0">
        {isOnboardingOpen ? (
          <Onboarding
            initialProfile={profile}
            onComplete={handleCompleteOnboarding}
            onCancel={() => setIsOnboardingOpen(false)}
          />
        ) : profile && metrics ? (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full lg:grid lg:grid-cols-12 lg:gap-8">
            
            {/* Column 1: Left Sidebar Nav & Profile (Desktop only) */}
            <aside className="hidden lg:flex lg:col-span-3 flex-col" style={{ gap: spacing[16] }}>

              {/* ── Profile Card ── */}
              <div
                style={{
                  background: colors.white,
                  borderRadius: radii.card,
                  boxShadow: shadows.card,
                  padding: spacing[24],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8], marginBottom: spacing[16] }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '9999px',
                      background: colors.primary,
                      color: colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    {profile.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '0.875rem', fontWeight: 700, color: colors.text, margin: 0 }}>
                      {profile.name}
                    </h3>
                    <span style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, textTransform: 'capitalize' }}>
                      {profile.gender}, {profile.age} yrs
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${colors.success}40`, paddingTop: spacing[8] }}>
                  {[
                    { label: 'Target Calories', value: `${metrics.calories} kcal` },
                    { label: 'Body Mass Index', value: `${metrics.bmi} BMI` },
                    { label: 'Category', value: metrics.bmiCategory },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', padding: `${spacing[4]} 0`, fontFamily: fonts.body }}>
                      <span style={{ color: colors.muted }}>{row.label}</span>
                      <strong style={{ color: colors.text }}>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Sidebar Navigation (5 items) ── */}
              <nav
                style={{
                  background: colors.white,
                  borderRadius: radii.card,
                  boxShadow: shadows.card,
                  padding: spacing[8],
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing[4],
                }}
              >
                {SIDEBAR_NAV.map((item) => {
                  const isActive = currentTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[8],
                        padding: `10px ${spacing[16]}`,
                        borderRadius: radii.button,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: fonts.body,
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? colors.primary : 'transparent',
                        color: isActive ? colors.white : colors.muted,
                        transition: 'all 0.2s',
                        boxShadow: isActive ? shadows.card : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = `${colors.success}30`;
                          e.currentTarget.style.color = colors.text;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = colors.muted;
                        }
                      }}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* ── Sign Out ── */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[8],
                  padding: `10px 0`,
                  borderRadius: radii.button,
                  border: `1px solid ${colors.success}50`,
                  background: 'transparent',
                  fontFamily: fonts.body,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: colors.muted,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#e54d2e50';
                  e.currentTarget.style.color = '#c53d2c';
                  e.currentTarget.style.background = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.success}50`;
                  e.currentTarget.style.color = colors.muted;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </aside>

            {/* Column 2: Center View Module Component (Scrollable/Flexible) */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              <AnimatePresence mode="wait">
                {currentTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Dashboard
                      profile={profile}
                      metrics={metrics}
                      onOpenOnboarding={handleStartOnboardingFlow}
                      setCurrentTab={handleTabChange}
                      loggedCalories={loggedCalories}
                      loggedProtein={loggedProtein}
                      loggedWater={loggedWater}
                      loggedSteps={loggedSteps}
                      loggedSleep={loggedSleep}
                      onUpdateLogs={handleUpdateLogs}
                    />
                  </motion.div>
                )}
                {currentTab === 'meals' && (
                  <motion.div
                    key="meals"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MealPlanView
                      profile={profile}
                      metrics={metrics}
                      onAddCalories={handleAddMealCalories}
                    />
                  </motion.div>
                )}
                {currentTab === 'exercises' && (
                  <motion.div
                    key="exercises"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ExerciseView
                      profile={profile}
                      onUpdateProfile={(updatedProfile: UserProfile) => {
                        setProfile(updatedProfile);
                        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
                        const computed = calculatePersonalMetrics(updatedProfile);
                        setMetrics(computed);
                      }}
                      activityLogs={activityLogs}
                      setActivityLogs={setActivityLogs}
                      onLogActivity={handleLogActivity}
                    />
                  </motion.div>
                )}
                {currentTab === 'mind' && (
                  <motion.div
                    key="mind"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SupportiveMindView
                      profile={profile}
                    />
                  </motion.div>
                )}
                {currentTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ReminderCenterView
                      profile={profile}
                      logs={activityLogs}
                      onClearLogs={handleClearActivityHistory}
                      onLogout={handleLogout}
                      reminders={reminders}
                      setReminders={setReminders}
                      soundEnabled={soundEnabled}
                      setSoundEnabled={setSoundEnabled}
                      notificationPermission={notificationPermission}
                      setNotificationPermission={setNotificationPermission}
                      toasts={toasts}
                      addToast={addToast}
                      playChime={playChime}
                    />
                  </motion.div>
                )}
                {currentTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <AboutView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingPage
                onStartOnboarding={handleStartOnboardingFlow}
                onStartGuest={handleStartGuestSession}
                onLogin={handleLoginSuccess}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* 72-HOUR EXPIRED LOCKOUT MODAL (PHASE 5) */}
      {isGuestExpired && (
        <div className="fixed inset-0 z-50 bg-bg-deep flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-xl bg-bg-surface border border-gold-primary/20 shadow-deep space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary mx-auto border border-gold-primary/20">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-headline">72-Hour Guest Session Expired</h2>
              <p className="text-xs text-text-body leading-relaxed">
                You have reached the 72-hour trial limit of Health Care Hub. Create a free account now to permanently save your physical profile, calorie targets, and workouts history.
              </p>
            </div>

            <form onSubmit={handleUpgradeGuestToAccountSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilal Ahmed"
                  value={upgradeUsername}
                  onChange={(e) => setUpgradeUsername(e.target.value)}
                  className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light transition shadow-md"
              >
                Create My Free Account ✦
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPGRADE SIGNUP GUEST MODAL OVERLAY */}
      {showSignupUpgradeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-bg-deep/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-xl bg-bg-surface border border-white/[0.08] shadow-deep space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-md font-bold text-text-headline flex items-center">
                <Sparkles className="w-4.5 h-4.5 text-gold-primary mr-2" /> Upgrade to Free Account
              </h3>
              <button
                onClick={() => setShowSignupUpgradeModal(false)}
                className="text-text-muted hover:text-text-headline text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-text-body leading-relaxed">
              Converting your guest session into a free account will preserve all your logged metrics, steps, water, and exercise history.
            </p>

            <form onSubmit={handleUpgradeGuestToAccountSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilal Ahmed"
                  value={upgradeUsername}
                  onChange={(e) => setUpgradeUsername(e.target.value)}
                  className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSignupUpgradeModal(false)}
                  className="w-1/2 py-2.5 rounded-lg text-xs font-bold text-text-body bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light transition"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Floating Toasts Stack */}
      <div className="fixed top-6 right-6 z-[9999] space-y-2.5 w-[calc(100%-3rem)] sm:max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="pointer-events-auto bg-white border border-purple-200/90 shadow-lg shadow-sky-500/[0.04] rounded-2xl p-4 flex items-start space-x-3.5 text-left border-l-4 border-l-purple-500"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-headline">{t.title}</span>
                  <span className="text-[8px] font-mono text-text-muted font-bold">
                    {t.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-text-body leading-relaxed">
                  {t.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
