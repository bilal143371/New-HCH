import React, { useState, useEffect } from 'react';
import { UserProfile, UserMetrics } from '../types';
import { 
  Footprints, 
  Droplet, 
  Flame, 
  Check, 
  RotateCcw, 
  Award, 
  AlertTriangle 
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  metrics: UserMetrics;
  onOpenOnboarding: () => void;
  setCurrentTab: (tab: string) => void;
  
  // States of logged items passed down from App
  loggedCalories: number;
  loggedProtein: number;
  loggedWater: number; // in Liters
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

const HEALTH_QUOTES = [
  "A healthy body is a home for a peaceful mind. Take care of yourself today.",
  "Your health is your greatest wealth. Every step forward is a victory.",
  "Eat to nourish, move to strengthen, rest to restore.",
  "Consistency is the secret to lifetime wellness. Keep it simple and safe.",
  "Wellness is a journey, not a destination. Celebrate small daily wins!"
];

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
  simpleMode = false
}: DashboardProps) {
  
  // Habits checks state
  const [habitsChecked, setHabitsChecked] = useState<{
    water: boolean;
    steps: boolean;
    sleep: boolean;
  }>({
    water: false,
    steps: false,
    sleep: false
  });

  // Undo System State
  const [lastActionSnapshot, setLastActionSnapshot] = useState<{
    calories: number;
    protein: number;
    water: number;
    steps: number;
    sleep: number;
  } | null>(null);
  const [undoTimer, setUndoTimer] = useState<number>(0);
  const [showUndoToast, setShowUndoToast] = useState<boolean>(false);
  const [undoMessage, setUndoMessage] = useState<string>('');

  // Undo Timer Loop
  useEffect(() => {
    let interval: any;
    if (showUndoToast && undoTimer > 0) {
      interval = setInterval(() => {
        setUndoTimer((prev) => {
          if (prev <= 1) {
            setShowUndoToast(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showUndoToast, undoTimer]);

  const triggerUndoableAction = (
    message: string,
    newUpdates: {
      calories?: number;
      protein?: number;
      water?: number;
      steps?: number;
      sleep?: number;
    }
  ) => {
    const snapshot = {
      calories: loggedCalories,
      protein: loggedProtein,
      water: loggedWater,
      steps: loggedSteps,
      sleep: loggedSleep,
    };

    setLastActionSnapshot(snapshot);
    setUndoMessage(message);
    setUndoTimer(5);
    setShowUndoToast(true);

    onUpdateLogs(newUpdates);
  };

  const handleUndo = () => {
    if (lastActionSnapshot) {
      onUpdateLogs(lastActionSnapshot);
      setLastActionSnapshot(null);
      setShowUndoToast(false);
    }
  };

  // Automatically check off habits if targets are achieved
  useEffect(() => {
    const isWaterMet = loggedWater >= metrics.water;
    const isStepsMet = loggedSteps >= metrics.steps;
    const isSleepMet = loggedSleep >= metrics.sleep;
    
    setHabitsChecked(prev => ({
      water: isWaterMet ? true : prev.water,
      steps: isStepsMet ? true : prev.steps,
      sleep: isSleepMet ? true : prev.sleep
    }));
  }, [loggedWater, loggedSteps, loggedSleep, metrics]);

  // Adjusters
  const handleAdjustSteps = (amount: number) => {
    const targetSteps = Math.max(0, loggedSteps + amount);
    triggerUndoableAction(`Steps adjusted (${amount > 0 ? '+' : ''}${amount.toLocaleString()})`, {
      steps: targetSteps
    });
  };

  const handleAddWaterMl = (ml: number) => {
    const currentLitres = loggedWater;
    const additionalLitres = ml / 1000;
    const targetWater = Math.max(0, Math.round((currentLitres + additionalLitres) * 100) / 100);
    triggerUndoableAction(`Water logged (${ml > 0 ? '+' : ''}${ml}ml)`, {
      water: targetWater
    });
  };

  const handleClearTodayLogs = () => {
    if (confirm('Are you sure you want to clear your logged progress for today?')) {
      onUpdateLogs({
        calories: 0,
        protein: 0,
        water: 0,
        steps: 0,
        sleep: 0
      });
      setHabitsChecked({
        water: false,
        steps: false,
        sleep: false
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Champion! 🌅';
    if (hour < 18) return 'Good Afternoon, Champion! ☀️';
    return 'Good Evening, Champion! 🌙';
  };

  const todayQuote = HEALTH_QUOTES[new Date().getDate() % HEALTH_QUOTES.length];
  const habitsCountDone = Object.values(habitsChecked).filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 lg:py-12 space-y-8 lg:space-y-10 animate-fade-in text-left">
      
      {/* 1. Dynamic Greeting Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-sans font-extrabold tracking-tight text-text-headline">
            {getGreeting()}
          </h2>
          <p className="text-xs text-text-muted mt-1.5 italic font-sans">
            "{todayQuote}"
          </p>
        </div>

        <div className="flex space-x-2 shrink-0">
          <button
            onClick={handleClearTodayLogs}
            className="flex items-center px-4 py-2 border border-slate-200 hover:border-red-400/20 bg-white hover:bg-slate-50 text-[10px] text-text-muted hover:text-red-650 rounded-lg transition font-mono min-h-[48px] cursor-pointer"
            title="Reset daily counts"
          >
            Reset Logs
          </button>
          <button
            onClick={onOpenOnboarding}
            className="flex items-center px-4 py-2 btn-3d-purple text-[10px] font-bold rounded-lg active:scale-95 shadow-sm font-sans min-h-[48px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 mr-1.5 animate-spin-hover" /> Recalculate
          </button>
        </div>
      </div>

      {/* Health Conditions Triggered Warnings Banner */}
      {profile.healthConditions.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-250 flex items-start space-x-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Health Profile Adaptive Mode Triggered</h4>
            <p className="text-xs text-text-body mt-0.5 leading-relaxed font-sans">
              Your limits and fitness goals are dynamically customized for: {profile.healthConditions.map(c => c.split('-').join(' ')).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* 2. Primary Metrics Row (At-a-Glance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Steps Taken */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-100/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest font-mono block">Steps Taken</span>
            {simpleMode ? (
              <span className={`text-xs font-extrabold block leading-tight py-1 ${loggedSteps >= metrics.steps ? 'text-emerald-600' : 'text-slate-500'}`}>
                {loggedSteps >= metrics.steps ? '✓ Walk Completed (چہل قدمی مکمل) 🟢' : '🚶 Keep Walking (چلتے رہیں)'}
              </span>
            ) : (
              <div className="text-xl lg:text-2xl font-extrabold text-text-headline font-mono">
                {loggedSteps.toLocaleString()} <span className="text-xs text-text-muted font-normal font-sans">/ {metrics.steps.toLocaleString()} steps</span>
              </div>
            )}
            
            {/* Inline Logs Incrementor */}
            <div className="flex items-center space-x-1.5 pt-1">
              <button
                onClick={() => handleAdjustSteps(-1000)}
                className="w-7 h-7 rounded-full bg-slate-100/80 hover:bg-slate-200 border border-slate-200/50 flex items-center justify-center text-xs font-bold text-text-headline active:scale-90 transition cursor-pointer"
                title="Subtract 1,000 steps"
              >
                -
              </button>
              <button
                onClick={() => handleAdjustSteps(1000)}
                className="w-7 h-7 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center text-xs font-bold active:scale-90 transition cursor-pointer"
                title="Add 1,000 steps"
              >
                +
              </button>
            </div>
          </div>

          {/* Icon/Circle Indicator */}
          {!simpleMode && (
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" className="stroke-slate-100" strokeWidth="4.5" fill="transparent" />
                <circle cx="32" cy="32" r="26" className="stroke-sky-500 transition-all duration-1000 ease-out" strokeWidth="4.5" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * Math.min(loggedSteps, metrics.steps)) / metrics.steps} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm">👟</span>
            </div>
          )}
        </div>

        {/* Metric 2: Calorie Budget */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-100/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest font-mono block">Calorie Budget</span>
            {simpleMode ? (
              <span className={`text-xs font-extrabold block leading-tight py-1 ${loggedCalories <= metrics.calories && loggedCalories > 0 ? 'text-emerald-600' : loggedCalories === 0 ? 'text-slate-500' : 'text-red-500'}`}>
                {loggedCalories <= metrics.calories && loggedCalories > 0 ? '✓ Good Diet (اچھی خوراک) 🟢' : loggedCalories === 0 ? '🍽️ Eat Healthy (اچھا کھائیں)' : '⚠️ Limit Exceeded (حد سے زیادہ)'}
              </span>
            ) : (
              <div className="text-xl lg:text-2xl font-extrabold text-text-headline font-mono">
                {loggedCalories.toLocaleString()} <span className="text-xs text-text-muted font-normal font-sans">/ {metrics.calories.toLocaleString()} kcal</span>
              </div>
            )}
            <span className="text-[10px] text-text-muted block pt-1.5 font-mono">Log meals inside Kitchen</span>
          </div>

          {/* Icon/Circle Indicator */}
          {!simpleMode && (
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" className="stroke-slate-100" strokeWidth="4.5" fill="transparent" />
                <circle cx="32" cy="32" r="26" className="stroke-emerald-500 transition-all duration-1000 ease-out" strokeWidth="4.5" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * Math.min(loggedCalories, metrics.calories)) / metrics.calories} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm">🥗</span>
            </div>
          )}
        </div>

        {/* Metric 3: Water Track */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-100/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest font-mono block">Water Track</span>
            {simpleMode ? (
              <span className={`text-xs font-extrabold block leading-tight py-1 ${loggedWater >= metrics.water ? 'text-emerald-600' : 'text-slate-500'}`}>
                {loggedWater >= metrics.water ? '✓ Good Hydration (پانی مکمل) 🟢' : '🥛 Drink Water (پانی پییں)'}
              </span>
            ) : (
              <div className="text-xl lg:text-2xl font-extrabold text-text-headline font-mono">
                {Math.round(loggedWater / 0.25)} <span className="text-xs text-text-muted font-normal font-sans">/ 8 Cups</span>
              </div>
            )}
            
            {/* Inline Logs Incrementor */}
            <div className="flex items-center space-x-1.5 pt-1">
              <button
                onClick={() => handleAddWaterMl(-250)}
                className="w-7 h-7 rounded-full bg-slate-100/80 hover:bg-slate-200 border border-slate-200/50 flex items-center justify-center text-xs font-bold text-text-headline active:scale-90 transition cursor-pointer"
                title="Subtract 1 cup (250ml)"
              >
                -
              </button>
              <button
                onClick={() => handleAddWaterMl(250)}
                className="w-7 h-7 rounded-full bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#bae6fd] text-[#0369a1] flex items-center justify-center text-xs font-bold active:scale-90 transition cursor-pointer"
                title="Add 1 cup (250ml)"
              >
                +
              </button>
            </div>
          </div>

          {/* Icon/Circle Indicator */}
          {!simpleMode && (
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" className="stroke-slate-100" strokeWidth="4.5" fill="transparent" />
                <circle cx="32" cy="32" r="26" className="stroke-blue-500 transition-all duration-1000 ease-out" strokeWidth="4.5" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * Math.min(loggedWater, metrics.water)) / metrics.water} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm">💧</span>
            </div>
          )}
        </div>

      </div>

      {/* 3. Three Isolated Primary Goal Gateway Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gateway 1: Open Nutrition Kitchen */}
        <button
          onClick={() => setCurrentTab('meals')}
          className="p-8 bg-white/80 backdrop-blur-md border border-slate-100 hover:border-emerald-300 rounded-3xl shadow-xl shadow-slate-100/50 hover:shadow-emerald-100/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left flex flex-col justify-between space-y-5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-sm border border-emerald-100 transition-colors group-hover:bg-emerald-100">
            🥗
          </div>
          <div>
            <h4 className="text-md font-sans font-extrabold text-text-headline group-hover:text-emerald-700 transition">
              Open Nutrition Kitchen
            </h4>
            <p className="text-xs text-text-body mt-1 leading-relaxed font-sans">
              Explore portion sizes, search local recipes, and run AI snap recommendations.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            Open Kitchen →
          </span>
        </button>

        {/* Gateway 2: Start Joint-Safe Workout */}
        <button
          onClick={() => setCurrentTab('exercises')}
          className="p-8 bg-white/80 backdrop-blur-md border border-slate-100 hover:border-sky-300 rounded-3xl shadow-xl shadow-slate-100/50 hover:shadow-sky-100/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left flex flex-col justify-between space-y-5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl shadow-sm border border-sky-100 transition-colors group-hover:bg-sky-100">
            🏃
          </div>
          <div>
            <h4 className="text-md font-sans font-extrabold text-text-headline group-hover:text-sky-700 transition">
              Start Joint-Safe Workout
            </h4>
            <p className="text-xs text-text-body mt-1 leading-relaxed font-sans">
              Begin joint-safe bodyweight stretches or custom workouts with simple wind-down timers.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600 flex items-center">
            Start Workout →
          </span>
        </button>

        {/* Gateway 3: Begin Relaxation Session */}
        <button
          onClick={() => setCurrentTab('mind')}
          className="p-8 bg-white/80 backdrop-blur-md border border-slate-100 hover:border-purple-300 rounded-3xl shadow-xl shadow-slate-100/50 hover:shadow-purple-100/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-left flex flex-col justify-between space-y-5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-650 flex items-center justify-center text-xl shadow-sm border border-purple-100 transition-colors group-hover:bg-purple-100">
            🧠
          </div>
          <div>
            <h4 className="text-md font-sans font-extrabold text-text-headline group-hover:text-purple-750 transition">
              Begin Relaxation Session
            </h4>
            <p className="text-xs text-text-body mt-1 leading-relaxed font-sans">
              Relax your mind using 4-7-8 breathing exercises and visual metronome bubbles.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-650 flex items-center">
            Relax Now →
          </span>
        </button>

      </div>

      {/* 4. DAILY HABITS INTERACTIVE LIST */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest font-mono block">Daily Habits (Rozana ki Aadaat)</span>
            <p className="text-xs text-text-body mt-0.5 font-sans">Tick the boxes as you complete them throughout the day!</p>
          </div>
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold font-mono flex items-center">
            <Check className="w-3 h-3 mr-1" /> {habitsCountDone} / 3 Complete
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Habit 1: Water */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, water: !p.water }))}
            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
              habitsChecked.water 
                ? 'bg-purple-50/50 border-purple-250 shadow-sm' 
                : 'bg-slate-50/50 border-slate-100 hover:border-purple-200'
            }`}
            style={{ minHeight: '48px' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🥛</span>
              <div>
                <h4 className="text-xs font-bold text-text-headline">Water Cup (Paani ka Glass)</h4>
                <p className="text-[10.5px] text-text-body mt-0.5 font-sans">Paani pina sehat ke liye zaroori hai. Drink water to stay active! ({Math.round(loggedWater * 1000)}ml logged)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
              habitsChecked.water 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-slate-300 hover:border-purple-400'
            }`}>
              {habitsChecked.water && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Habit 2: Steps */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, steps: !p.steps }))}
            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
              habitsChecked.steps 
                ? 'bg-purple-50/50 border-purple-250 shadow-sm' 
                : 'bg-slate-50/50 border-slate-100 hover:border-purple-200'
            }`}
            style={{ minHeight: '48px' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">👟</span>
              <div>
                <h4 className="text-xs font-bold text-text-headline">Step Shoe (Qadamo ki Chahal Qadmi)</h4>
                <p className="text-[10.5px] text-text-body mt-0.5 font-sans">Rozana chalne se jism chust rehta hai. Walk at your own pace! ({loggedSteps.toLocaleString()} steps logged)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
              habitsChecked.steps 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-slate-300 hover:border-purple-400'
            }`}>
              {habitsChecked.steps && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Habit 3: Sleep */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, sleep: !p.sleep }))}
            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
              habitsChecked.sleep 
                ? 'bg-purple-50/50 border-purple-250 shadow-sm' 
                : 'bg-slate-50/50 border-slate-100 hover:border-purple-200'
            }`}
            style={{ minHeight: '48px' }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">⏰</span>
              <div>
                <h4 className="text-xs font-bold text-text-headline">Sleep Clock (Soney ka Waqt)</h4>
                <p className="text-[10.5px] text-text-body mt-0.5 font-sans">Sakoon ki neend aap ke dimaag ko fresh rakhti hai. Sleep well tonight! ({metrics.sleep} hours target)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
              habitsChecked.sleep 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-slate-300 hover:border-purple-400'
            }`}>
              {habitsChecked.sleep && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-between text-[10px] font-mono text-text-muted">
          <span>Progress: {Math.round((habitsCountDone / 3) * 100)}%</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* 5. Project Development Team credits attribution */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-650">✦ Project Development Team</h4>
          <p className="text-[11px] text-text-body mt-1.5 leading-relaxed font-sans">
            This project is proudly designed and developed by:
          </p>
          <ol className="list-decimal list-inside text-[11px] text-text-headline font-semibold space-y-0.5 mt-2 font-sans">
            <li>Muhammad Jamal</li>
            <li>Zainab Irfan</li>
            <li>Laiba Khan</li>
            <li>Aqsa Haider</li>
            <li>Ujala Ashraf</li>
          </ol>
        </div>
        <div className="flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
          <div>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">Official Submission Contact</span>
            <strong className="text-xs text-purple-750 block mt-1">Support Helpline: +92 309 4530756</strong>
          </div>
          <span className="text-[9.5px] text-text-muted font-mono mt-3 sm:mt-0">Health Care Hub Regional Welfare Pilot System</span>
        </div>
      </div>

      {/* 5-SECOND UNDO TOAST NOTIFICATION */}
      {showUndoToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-purple-200/90 shadow-lg max-w-sm w-[90vw] flex flex-col space-y-3 animate-fade-in text-white text-left">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold">
                {undoMessage}
              </span>
            </div>
            <button
              onClick={handleUndo}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] rounded transition flex items-center shrink-0 active:scale-95 shadow cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Undo ({undoTimer}s)
            </button>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-1000 ease-linear" 
              style={{ width: `${(undoTimer / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

    </div>
  );
}
