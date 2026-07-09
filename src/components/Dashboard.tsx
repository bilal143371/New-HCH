/**
 * Dashboard.tsx — Blended Wellness Home Screen
 * ═══════════════════════════════════════════════
 *
 * Visual blend of three wellness-app patterns:
 *   - MyFitnessPal: circular progress rings, one primary number per card, clean diary list
 *   - Noom: warm coach-like tone, encouraging microcopy, streak celebration
 *   - Headspace: soft rounded shapes, calm gradients, generous whitespace, micro-animations
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserMetrics } from '../types';
import { theme } from '../styles/theme';
import '../styles/design-system.css';
import {
  Footprints,
  Droplet,
  Flame,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  Heart,
  Clock,
} from 'lucide-react';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

/* ─── Types ──────────────────────────────────────────────────────── */
interface DashboardProps {
  profile: UserProfile;
  metrics: UserMetrics;
  onOpenOnboarding: () => void;
  setCurrentTab: (tab: string) => void;
  loggedCalories: number;
  loggedProtein: number;
  loggedWater: number;
  loggedSteps: number;
  loggedSleep: number;
  onUpdateLogs: (updates: {
    calories?: number;
    protein?: number;
    water?: number;
    steps?: number;
    sleep?: number;
  }) => void;
  simpleMode?: boolean;
}

/* ─── Coach Messages (Noom-style encouraging copy) ───────────────── */
const COACH_MESSAGES = {
  morning: [
    "Rise and shine! 🌅 Today's a fresh start — let's make it count.",
    "Good morning! Your body will thank you for every healthy choice today.",
    "A new day, a new chance to feel amazing. You've got this! ✨",
  ],
  afternoon: [
    "You're doing great today! Keep that momentum going. 💪",
    "Halfway through the day — stay hydrated and keep moving!",
    "Afternoon check-in: remember, small steps lead to big changes. 🌿",
  ],
  evening: [
    "Winding down — great job today! Review your progress below. 🌙",
    "Evening already! Let's see how your day shaped up.",
    "Almost done for today — you showed up, and that matters. 💚",
  ],
};

const getCoachMessage = () => {
  const h = new Date().getHours();
  const bucket = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  const msgs = COACH_MESSAGES[bucket];
  return msgs[new Date().getDate() % msgs.length];
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

/* ─── Animated Progress Ring (MyFitnessPal-style) ────────────────── */
const ProgressRing: React.FC<{
  progress: number;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}> = ({ progress, color, trackColor, size = 100, strokeWidth = 7, children }) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const offset = circumference - circumference * clampedProgress;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={trackColor || `${colors.success}30`}
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Dashboard({
  profile,
  metrics,
  onOpenOnboarding,
  setCurrentTab,
  loggedCalories,
  loggedProtein,
  loggedWater,
  loggedSteps,
  loggedSleep,
  onUpdateLogs,
}: DashboardProps) {

  /* Undo system */
  const [lastSnapshot, setLastSnapshot] = useState<{
    calories: number; protein: number; water: number; steps: number; sleep: number;
  } | null>(null);
  const [undoTimer, setUndoTimer] = useState(0);
  const [showUndo, setShowUndo] = useState(false);
  const [undoMsg, setUndoMsg] = useState('');

  useEffect(() => {
    if (!showUndo || undoTimer <= 0) return;
    const id = setInterval(() => {
      setUndoTimer((t) => {
        if (t <= 1) { setShowUndo(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showUndo, undoTimer]);

  const doUndoable = (msg: string, updates: Partial<{ calories: number; protein: number; water: number; steps: number; sleep: number }>) => {
    setLastSnapshot({ calories: loggedCalories, protein: loggedProtein, water: loggedWater, steps: loggedSteps, sleep: loggedSleep });
    setUndoMsg(msg);
    setUndoTimer(5);
    setShowUndo(true);
    onUpdateLogs(updates);
  };

  const handleUndo = () => {
    if (lastSnapshot) { onUpdateLogs(lastSnapshot); setLastSnapshot(null); setShowUndo(false); }
  };

  /* Adjusters */
  const addSteps = (n: number) => doUndoable(`Steps ${n > 0 ? '+' : ''}${n.toLocaleString()}`, { steps: Math.max(0, loggedSteps + n) });
  const addWater = (ml: number) => doUndoable(`Water ${ml > 0 ? '+' : ''}${ml}ml`, { water: Math.max(0, Math.round((loggedWater + ml / 1000) * 100) / 100) });

  /* Derived */
  const stepsProgress = metrics.steps > 0 ? loggedSteps / metrics.steps : 0;
  const calProgress = metrics.calories > 0 ? loggedCalories / metrics.calories : 0;
  const waterCups = Math.round(loggedWater / 0.25);
  const waterProgress = waterCups / 8;
  const firstName = profile.name.split(' ')[0];

  /* Streak (simple mock based on date) */
  const streakDays = Math.max(1, new Date().getDate() % 7 + 1);

  /* Diary items — combine logged data into a timeline */
  const diaryItems: { time: string; icon: React.ReactNode; label: string; detail: string; color: string }[] = [];
  if (loggedCalories > 0) {
    diaryItems.push({
      time: 'Today',
      icon: <Flame size={16} />,
      label: 'Meals logged',
      detail: `${loggedCalories.toLocaleString()} kcal · ${loggedProtein}g protein`,
      color: colors.accent,
    });
  }
  if (loggedSteps > 0) {
    diaryItems.push({
      time: 'Today',
      icon: <Footprints size={16} />,
      label: 'Steps taken',
      detail: `${loggedSteps.toLocaleString()} steps`,
      color: colors.primary,
    });
  }
  if (loggedWater > 0) {
    diaryItems.push({
      time: 'Today',
      icon: <Droplet size={16} />,
      label: 'Water intake',
      detail: `${waterCups} cups (${(loggedWater * 1000).toFixed(0)}ml)`,
      color: colors.blue,
    });
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[24],
        paddingBottom: spacing[48],
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          1. GREETING + COACH MESSAGE (Noom-style warm header)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="hch-animate-in"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #3d6b43 60%, #4a7d52 100%)`,
          borderRadius: radii.card,
          padding: spacing[32],
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blob (Headspace feel) */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-20px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-10px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(242,134,94,0.1)',
          pointerEvents: 'none',
        }} />

        {/* Date */}
        <span style={{
          fontFamily: fonts.body,
          fontSize: fontSizes.xs,
          color: `${colors.success}`,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>

        {/* Greeting */}
        <h1 style={{
          fontFamily: fonts.heading,
          fontSize: '1.75rem',
          fontWeight: 700,
          color: colors.white,
          margin: `${spacing[8]} 0 ${spacing[4]}`,
          lineHeight: 1.2,
          position: 'relative',
          zIndex: 1,
        }}>
          {getGreeting()}, {firstName} 👋
        </h1>

        {/* Coach message (Noom-style) */}
        <p style={{
          fontFamily: fonts.body,
          fontSize: fontSizes.sm,
          color: 'rgba(255,255,255,0.85)',
          margin: `${spacing[4]} 0 0`,
          lineHeight: 1.6,
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
        }}>
          {getCoachMessage()}
        </p>

        {/* Streak badge (Noom-style) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[8],
          marginTop: spacing[16],
          padding: '8px 16px',
          borderRadius: radii.button,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ fontSize: '1rem' }}>🔥</span>
          <span style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.xs,
            fontWeight: 600,
            color: colors.white,
          }}>
            {streakDays} day streak — keep it going!
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. PROGRESS RINGS (MyFitnessPal-style, one number each)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="hch-animate-in"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing[16],
        }}
      >
        {/* Steps Ring */}
        <div style={{
          background: colors.white,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing[12],
          textAlign: 'center',
        }}>
          <ProgressRing progress={stepsProgress} color={colors.primary} size={90} strokeWidth={7}>
            <span style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, lineHeight: 1 }}>
              {loggedSteps > 0 ? (loggedSteps / 1000).toFixed(1) + 'k' : '0'}
            </span>
          </ProgressRing>
          <div>
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 600, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Steps
            </span>
            <span style={{ display: 'block', fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, marginTop: '2px' }}>
              of {(metrics.steps / 1000).toFixed(0)}k goal
            </span>
          </div>
          <div style={{ display: 'flex', gap: spacing[8] }}>
            <button
              onClick={() => addSteps(-1000)}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.success}60`, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.muted, transition: 'all 0.2s',
              }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => addSteps(1000)}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.primary}50`, background: `${colors.primary}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.primary, transition: 'all 0.2s',
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Calories Ring */}
        <div style={{
          background: colors.white,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing[12],
          textAlign: 'center',
        }}>
          <ProgressRing progress={calProgress} color={colors.accent} size={90} strokeWidth={7}>
            <span style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, lineHeight: 1 }}>
              {loggedCalories > 0 ? loggedCalories.toLocaleString() : '0'}
            </span>
          </ProgressRing>
          <div>
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 600, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Calories
            </span>
            <span style={{ display: 'block', fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, marginTop: '2px' }}>
              of {metrics.calories.toLocaleString()} kcal
            </span>
          </div>
          <div style={{ display: 'flex', gap: spacing[8] }}>
            <button
              onClick={() => doUndoable('-100 kcal', { calories: Math.max(0, loggedCalories - 100) })}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.success}60`, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.muted, transition: 'all 0.2s',
              }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => doUndoable('+100 kcal', { calories: loggedCalories + 100 })}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.accent}50`, background: `${colors.accent}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.accent, transition: 'all 0.2s',
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Water Ring */}
        <div style={{
          background: colors.white,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing[12],
          textAlign: 'center',
        }}>
          <ProgressRing progress={waterProgress} color={colors.blue} size={90} strokeWidth={7}>
            <span style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, lineHeight: 1 }}>
              {waterCups}
            </span>
          </ProgressRing>
          <div>
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 600, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Water
            </span>
            <span style={{ display: 'block', fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, marginTop: '2px' }}>
              {waterCups} of 8 cups
            </span>
          </div>
          <div style={{ display: 'flex', gap: spacing[8] }}>
            <button
              onClick={() => addWater(-250)}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.success}60`, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.muted, transition: 'all 0.2s',
              }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => addWater(250)}
              style={{
                width: '32px', height: '32px', borderRadius: radii.full,
                border: `1.5px solid ${colors.blue}50`, background: `${colors.blue}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: colors.blue, transition: 'all 0.2s',
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. COACH ENCOURAGEMENT CARD (Headspace-style gradient)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="hch-animate-in"
        style={{
          background: `linear-gradient(135deg, ${colors.success}40 0%, ${colors.success}15 100%)`,
          borderRadius: radii.card,
          padding: spacing[24],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[16],
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: radii.full,
          background: colors.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(47,82,51,0.1)',
        }}>
          <Sparkles size={22} color={colors.primary} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.sm,
            fontWeight: 600,
            color: colors.primary,
            margin: 0,
            lineHeight: 1.5,
          }}>
            {calProgress >= 0.5 && stepsProgress >= 0.3
              ? `Amazing progress today, ${firstName}! You're already past halfway on calories and getting those steps in. 🎉`
              : calProgress >= 0.3
              ? `Nice start! You've logged some meals already. Keep going — every bite logged helps you stay on track.`
              : `Your day is just beginning! Start by logging a meal or taking a quick walk. Small wins add up. 🌱`
            }
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          4. TODAY'S DIARY (MyFitnessPal-style activity list)
         ═══════════════════════════════════════════════════════ */}
      <div className="hch-animate-in">
        <h2 style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes.xl,
          fontWeight: 700,
          color: colors.text,
          margin: `0 0 ${spacing[16]}`,
        }}>
          Today's diary
        </h2>

        {diaryItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
            {diaryItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: colors.white,
                  borderRadius: radii.card,
                  boxShadow: shadows.card,
                  padding: `${spacing[16]} ${spacing[20]}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[16],
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `${item.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: fontSizes.sm,
                    fontWeight: 600,
                    color: colors.text,
                    display: 'block',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontFamily: fonts.body,
                    fontSize: fontSizes.xs,
                    color: colors.muted,
                    display: 'block',
                    marginTop: '2px',
                  }}>
                    {item.detail}
                  </span>
                </div>
                <Clock size={14} color={colors.muted} style={{ opacity: 0.4, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        ) : (
          /* Headspace-style empty state with mascot */
          <div style={{
            background: colors.white,
            borderRadius: radii.card,
            boxShadow: shadows.card,
            padding: spacing[48],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[16],
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>🥑</div>
            <h3 style={{
              fontFamily: fonts.heading,
              fontSize: fontSizes.lg,
              fontWeight: 600,
              color: colors.text,
              margin: 0,
            }}>
              Nothing logged yet — that's okay!
            </h3>
            <p style={{
              fontFamily: fonts.body,
              fontSize: fontSizes.sm,
              color: colors.muted,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '320px',
            }}>
              Start your day by logging a meal, adding some steps, or grabbing a glass of water. Every small action counts.
            </p>
            <button
              onClick={() => setCurrentTab('meals')}
              className="hch-btn hch-btn--accent"
              style={{ marginTop: spacing[8] }}
            >
              <Plus size={16} /> Log your first meal
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          5. EXPLORE SHORTCUTS (Headspace-style navigation cards)
         ═══════════════════════════════════════════════════════ */}
      <div className="hch-animate-in">
        <h2 style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes.xl,
          fontWeight: 700,
          color: colors.text,
          margin: `0 0 ${spacing[16]}`,
        }}>
          Explore
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing[12],
        }}>
          {[
            { label: 'Meal Planner', desc: 'Pakistani recipes & nutrition tracking', tab: 'meals', emoji: '🥗', image: '/quick_action_meal.png' },
            { label: 'Workouts', desc: 'Joint-safe exercises for every level', tab: 'exercises', emoji: '💪', image: '/quick_action_workout.png' },
            { label: 'Mind Support', desc: 'Breathing, meditation & coach chat', tab: 'mind', emoji: '🧘', image: '/quick_action_coach.png' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setCurrentTab(item.tab)}
              style={{
                position: 'relative',
                borderRadius: radii.card,
                overflow: 'hidden',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                boxShadow: shadows.card,
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(38,41,31,0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = shadows.card;
              }}
            >
              <img
                src={item.image}
                alt={item.label}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(0deg, rgba(38,41,31,0.78) 0%, rgba(38,41,31,0.2) 50%, transparent 100%)',
              }} />
              <div style={{ position: 'relative', padding: spacing[20], zIndex: 1 }}>
                <h3 style={{
                  fontFamily: fonts.heading,
                  fontSize: fontSizes.base,
                  fontWeight: 700,
                  color: colors.white,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[8],
                }}>
                  {item.label} <ChevronRight size={14} style={{ opacity: 0.6 }} />
                </h3>
                <p style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.xs,
                  color: 'rgba(255,255,255,0.75)',
                  margin: `${spacing[4]} 0 0`,
                  lineHeight: 1.4,
                }}>
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          6. DAILY TIP (warm, Noom-style coaching tip)
         ═══════════════════════════════════════════════════════ */}
      <div
        className="hch-animate-in"
        style={{
          background: colors.white,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing[16],
        }}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: `${colors.accent}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Heart size={18} color={colors.accent} />
        </div>
        <div>
          <h4 style={{
            fontFamily: fonts.heading,
            fontSize: fontSizes.sm,
            fontWeight: 700,
            color: colors.text,
            margin: `0 0 ${spacing[4]}`,
          }}>
            Today's wellness tip
          </h4>
          <p style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.sm,
            color: colors.muted,
            lineHeight: 1.65,
            margin: 0,
          }}>
            Drinking a glass of warm water first thing in the morning kickstarts your metabolism, aids digestion, and keeps your hydration on track. Try it tomorrow! 💧
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          7. RECALCULATE GOALS (subtle, non-intrusive)
         ═══════════════════════════════════════════════════════ */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onOpenOnboarding}
          className="hch-btn hch-btn--ghost"
          style={{ fontSize: fontSizes.xs }}
        >
          <RotateCcw size={12} /> Recalculate my goals
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          UNDO TOAST
         ═══════════════════════════════════════════════════════ */}
      {showUndo && (
        <div
          style={{
            position: 'fixed',
            bottom: spacing[24],
            right: spacing[24],
            zIndex: 50,
            background: colors.text,
            color: colors.white,
            borderRadius: radii.card,
            padding: spacing[16],
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            maxWidth: '340px',
            width: '90vw',
            fontFamily: fonts.body,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[8],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[8] }}>
            <span style={{ fontSize: fontSizes.sm, fontWeight: 500 }}>{undoMsg}</span>
            <button
              onClick={handleUndo}
              style={{
                padding: '10px 20px',
                borderRadius: radii.button,
                border: 'none',
                background: colors.accent,
                color: colors.white,
                fontWeight: 700,
                fontSize: fontSizes.xs,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <RotateCcw size={11} /> Undo ({undoTimer}s)
            </button>
          </div>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.12)', borderRadius: radii.full, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: colors.accent,
                borderRadius: radii.full,
                transition: 'width 1s linear',
                width: `${(undoTimer / 5) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
