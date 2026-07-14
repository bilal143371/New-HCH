import React from 'react';
import { LoggedActivity } from '../types';
import { Calendar, Trash2, Heart, Dumbbell, Flame, Award, Clock } from 'lucide-react';
import { theme } from '../styles/theme';
import '../styles/design-system.css';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface LogsHistoryViewProps {
  logs: LoggedActivity[];
  onClearLogs: () => void;
  setCurrentTab?: (tab: string) => void;
}

export default function LogsHistoryView({
  logs,
  onClearLogs,
  setCurrentTab
}: LogsHistoryViewProps) {
  
  // Calculate workout streak
  const getWorkoutStreak = () => {
    if (logs.length === 0) return 0;
    const dates = Array.from(new Set(logs.map(log => log.date || new Date().toISOString().split('T')[0]))).sort().reverse();
    let streak = 0;
    const checkDate = new Date();
    const todayStr = checkDate.toISOString().split('T')[0];
    
    // If today is not logged, check yesterday. If yesterday is not logged either, streak is 0.
    if (!dates.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      if (!dates.includes(yesterdayStr)) {
        return 0;
      }
    }
    
    // Count backward
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getWorkoutStreak();

  // Badges verification logic
  const badgesList = [
    {
      id: 'pioneer',
      name: 'First Step',
      desc: 'Completed your first wellness log.',
      unlocked: logs.length >= 1,
      icon: '🥇'
    },
    {
      id: 'early',
      name: 'Early Bird',
      desc: 'Completed a workout logged before 9:00 AM.',
      unlocked: logs.some(l => l.timestamp && l.timestamp.includes('AM') && (parseInt(l.timestamp.split(':')[0], 10) < 9 || parseInt(l.timestamp.split(':')[0], 10) === 12)),
      icon: '🌅'
    },
    {
      id: 'zen',
      name: 'Zen Master',
      desc: 'Completed 3 or more mental/relax logs.',
      unlocked: logs.filter(l => l.sphere === 'mental').length >= 3,
      icon: '🧘'
    },
    {
      id: 'consistency',
      name: 'Consistency Pro',
      desc: 'Worked out on 3 distinct days.',
      unlocked: new Set(logs.map(l => l.date || '')).size >= 3,
      icon: '🏃'
    },
    {
      id: 'endurance',
      name: 'Endurance Champ',
      desc: 'Completed a workout duration >= 25 mins.',
      unlocked: logs.some(l => l.duration && parseInt(l.duration, 10) >= 25),
      icon: '⏱️'
    },
    {
      id: 'desi',
      name: 'Desi Burner',
      desc: 'Logged 5 total completed routines.',
      unlocked: logs.length >= 5,
      icon: '🔥'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-left">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${colors.success}30`, paddingBottom: spacing[16], gap: spacing[16] }} className="flex flex-col sm:flex-row">
        <div>
          <h3 style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 750, color: colors.text, margin: 0 }}>
            Activity & Workout History
          </h3>
          <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, margin: `${spacing[4]} 0 0` }}>
            A chronological ledger of physical routines and mental exercises completed by you.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="hch-btn hch-btn--outline"
            style={{
              fontSize: '0.6875rem',
              padding: '6px 12px',
              color: '#d9534f',
              borderColor: '#d9534f30',
              background: '#d9534f10',
            }}
          >
            <Trash2 size={12} style={{ marginRight: spacing[4] }} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Gamification Streak & Badges Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', mdGridTemplateColumns: '1fr 2fr', gap: spacing[24] }} className="grid grid-cols-1 md:grid-cols-3">
        {/* Streak banner */}
        <div
          style={{
            background: colors.white,
            borderRadius: radii.card,
            boxShadow: shadows.card,
            padding: spacing[20],
            border: `1px solid ${colors.success}30`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: spacing[12],
          }}
        >
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Consistency Streak</span>
            <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: `${spacing[4]} 0 0` }}>My Workout Fire</h4>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12], padding: `${spacing[8]} 0` }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: radii.full,
              background: `${colors.accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.accent,
            }}>
              <Flame size={20} className={streak > 0 ? 'animate-pulse' : ''} />
            </div>
            <div>
              <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xl, fontWeight: 800, color: colors.text, display: 'block' }}>
                {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
              <span style={{ fontSize: '0.6875rem', color: colors.muted }}>active daily streak</span>
            </div>
          </div>

          <p style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, margin: 0 }}>
            {streak > 0 ? "Great job! Keep logging workouts daily to keep the fire burning!" : "No active streak. Complete a workout today to light the fire!"}
          </p>
        </div>

        {/* Badges dashboard - 2 cols span */}
        <div
          className="md:col-span-2"
          style={{
            background: colors.white,
            borderRadius: radii.card,
            boxShadow: shadows.card,
            padding: spacing[20],
            border: `1px solid ${colors.success}30`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[12],
          }}
        >
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Unlockable Badges</span>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: spacing[12] }}>
            {badgesList.map((badge) => (
              <div 
                key={badge.id}
                style={{
                  background: badge.unlocked ? `${colors.primary}10` : '#FAF7F2',
                  border: badge.unlocked ? `1.5px solid ${colors.primary}` : `1px solid ${colors.success}30`,
                  borderRadius: radii.card,
                  padding: spacing[12],
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[8],
                  transition: 'all 0.2s',
                  opacity: badge.unlocked ? 1 : 0.5,
                }}
                title={badge.desc}
              >
                <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
                <div style={{ textAlign: 'left', lineHeight: 1.2, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.text, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {badge.name}
                  </span>
                  <span style={{ fontSize: '0.5625rem', color: colors.muted }}>{badge.unlocked ? 'Unlocked ✓' : 'Locked'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics stats row if logs exist */}
      {logs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[16] }}>
          <div style={{ background: colors.white, padding: spacing[16], borderRadius: radii.card, border: `1px solid ${colors.success}30`, boxShadow: shadows.card }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Total Completed</span>
            <div style={{ fontSize: fontSizes.xl, fontWeight: 800, color: colors.primary, marginTop: spacing[4], fontFamily: fonts.body }}>{logs.length}</div>
          </div>
          <div style={{ background: colors.white, padding: spacing[16], borderRadius: radii.card, border: `1px solid ${colors.success}30`, boxShadow: shadows.card }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Physical Workouts</span>
            <div style={{ fontSize: fontSizes.xl, fontWeight: 800, color: colors.text, marginTop: spacing[4], fontFamily: fonts.body }}>
              {logs.filter(l => l.sphere === 'physical').length}
            </div>
          </div>
          <div style={{ background: colors.white, padding: spacing[16], borderRadius: radii.card, border: `1px solid ${colors.success}30`, boxShadow: shadows.card }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Mental Exercises</span>
            <div style={{ fontSize: fontSizes.xl, fontWeight: 800, color: colors.text, marginTop: spacing[4], fontFamily: fonts.body }}>
              {logs.filter(l => l.sphere === 'mental').length}
            </div>
          </div>
        </div>
      )}

      {/* Timeline view list */}
      {logs.length === 0 ? (
        <div style={{ background: colors.white, border: `1px solid ${colors.success}30`, borderRadius: radii.card, padding: spacing[32], textAlign: 'center', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[12] }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${colors.success}20`, marginBottom: spacing[8] }}>
            <img src="/logs_empty_state.png" alt="Lacing running shoes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>No exercises logged today</h3>
          <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, margin: 0, lineHeight: 1.4 }}>
            Start a physical leg routine or mental breathing exercise to record your first completed activity ledger.
          </p>
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('exercises')}
              className="hch-btn hch-btn--primary"
              style={{
                fontSize: fontSizes.xs,
                padding: '10px 18px',
                marginTop: spacing[8],
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[8]
              }}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Explore Workouts</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative', borderLeft: `2px solid ${colors.success}40`, marginLeft: spacing[16], paddingLeft: spacing[24], display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          {logs.map((log) => (
            <div key={log.id} style={{ position: 'relative' }}>
              
              {/* Vertical timeline marker dot */}
              <div style={{
                position: 'absolute',
                left: '-31px',
                top: '12px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: log.sphere === 'physical' ? colors.accent : colors.primary,
                border: `2px solid ${colors.background}`,
                boxShadow: shadows.card,
              }}></div>
              
              <div
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.success}30`,
                  borderRadius: radii.card,
                  padding: spacing[16],
                  boxShadow: shadows.card,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: spacing[16],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12] }}>
                  <div style={{
                    padding: spacing[8],
                    borderRadius: radii.button,
                    background: log.sphere === 'physical' ? `${colors.accent}15` : `${colors.primary}15`,
                    color: log.sphere === 'physical' ? colors.accent : colors.primary,
                  }}>
                    {log.sphere === 'physical' ? <Dumbbell size={14} /> : <Heart size={14} />}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: fonts.heading, fontSize: '0.875rem', fontWeight: 700, color: colors.text, margin: 0 }}>{log.name}</h4>
                    <p style={{ fontFamily: fonts.body, fontSize: '0.625rem', color: colors.muted, textTransform: 'uppercase', margin: 0, marginTop: '2px', fontWeight: 600 }}>
                      {log.sphere} · {log.category}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  <span style={{
                    fontSize: '0.625rem',
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    color: colors.primary,
                    background: `${colors.primary}10`,
                    padding: '2px 6px',
                    borderRadius: radii.button,
                  }}>
                    {log.duration}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: colors.muted, fontFamily: fonts.body }}>
                    {log.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
