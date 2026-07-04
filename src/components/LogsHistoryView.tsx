import React from 'react';
import { LoggedActivity } from '../types';
import { Calendar, Trash2, Heart, Dumbbell, Flame, Award, Clock } from 'lucide-react';

interface LogsHistoryViewProps {
  logs: LoggedActivity[];
  onClearLogs: () => void;
}

export default function LogsHistoryView({
  logs,
  onClearLogs
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
      <div className="border-b border-white/[0.06] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-extrabold text-text-headline">
            📈 Workout & Activity Logs
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            A chronological timeline of physical routines and mental exercises completed by you.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center px-4 py-2 border border-white/[0.08] hover:border-red-400/20 bg-bg-card hover:bg-white/[0.02] text-xs text-text-muted hover:text-red-400 rounded-lg transition font-mono cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear All History
          </button>
        )}
      </div>

      {/* Gamification Streak & Badges Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak banner */}
        <div className="p-5 rounded-xl bg-bg-card border border-purple-500/15 flex flex-col justify-between shadow-card hover:border-purple-500/35 transition duration-200">
          <div>
            <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-widest font-mono">Consistency Streak</span>
            <h3 className="text-md font-bold text-text-headline mt-1">My Workout Fire</h3>
          </div>
          
          <div className="flex items-center space-x-3 py-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/25">
              <Flame className={`w-7 h-7 text-purple-400 ${streak > 0 && 'animate-pulse'}`} />
            </div>
            <div>
              <span className="text-2xl font-mono font-extrabold text-text-headline block">
                {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
              <span className="text-[10px] text-text-muted">active daily streak</span>
            </div>
          </div>

          <p className="text-[9px] font-mono text-text-muted">
            {streak > 0 ? "Great job! Keep logging workouts daily to keep the fire burning!" : "No active streak. Complete a workout today to light the fire!"}
          </p>
        </div>

        {/* Badges dashboard - 2 cols span */}
        <div className="md:col-span-2 p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col space-y-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Unlockable Badges</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badgesList.map((badge) => (
              <div 
                key={badge.id}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition ${
                  badge.unlocked
                    ? 'bg-purple-950/20 border-purple-500/30 text-purple-200 shadow-sm'
                    : 'bg-white/[0.01] border-white/[0.04] opacity-40 grayscale'
                }`}
                title={badge.desc}
              >
                <span className="text-xl shrink-0">{badge.icon}</span>
                <div className="text-left leading-tight truncate">
                  <span className={`text-[10px] font-extrabold block truncate ${badge.unlocked ? 'text-purple-300' : 'text-text-headline'}`}>
                    {badge.name}
                  </span>
                  <span className="text-[8px] text-text-muted font-mono">{badge.unlocked ? 'Unlocked ✓' : 'Locked'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics stats row if logs exist */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-bg-card border border-white/[0.04]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono">Total Completed</span>
            <div className="text-2xl font-bold text-text-gold font-mono mt-1">{logs.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-white/[0.04]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono">Physical Workouts</span>
            <div className="text-2xl font-bold text-text-headline font-mono mt-1">
              {logs.filter(l => l.sphere === 'physical').length}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-white/[0.04]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono">Mental Exercises</span>
            <div className="text-2xl font-bold text-text-headline font-mono mt-1">
              {logs.filter(l => l.sphere === 'mental').length}
            </div>
          </div>
        </div>
      )}

      {/* Timeline view list */}
      {logs.length === 0 ? (
        <div className="p-12 rounded-xl bg-bg-card border border-white/[0.06] text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-10 h-10 text-text-muted mx-auto animate-pulse" />
          <h3 className="text-sm font-bold text-text-headline">No exercises logged today</h3>
          <p className="text-xs text-text-body leading-relaxed">
            Start a physical leg routine or standard mental breathing exercise from the Exercises tab to write your first log.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-white/[0.06] ml-4 pl-6 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative">
              
              {/* Vertical timeline marker dot */}
              <div className="absolute left-[-31px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-bg-deep shadow"></div>
              
              <div className="p-4 bg-bg-card border border-white/[0.06] rounded-xl hover:border-purple-500/15 transition duration-150 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${log.sphere === 'physical' ? 'bg-orange-500/10 text-orange-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    {log.sphere === 'physical' ? <Dumbbell className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-headline">{log.name}</h4>
                    <p className="text-[10px] text-text-muted font-mono uppercase mt-0.5 tracking-wider">
                      {log.sphere} · {log.category}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between items-end h-full">
                  <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                    {log.duration}
                  </span>
                  <span className="text-[9px] text-text-muted font-mono mt-2">
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
