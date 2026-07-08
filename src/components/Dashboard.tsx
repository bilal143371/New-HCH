import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserMetrics, LoggedActivity } from '../types';
import { calculatePersonalMetrics } from '../utils/metrics';
import { 
  Flame, 
  Droplet, 
  Footprints, 
  Moon, 
  Info, 
  RotateCcw, 
  AlertTriangle, 
  Scale, 
  Check, 
  Plus, 
  Minus, 
  Coffee, 
  Lightbulb, 
  ChefHat, 
  Sparkles,
  Award,
  TrendingUp,
  Brain,
  Timer
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
}

const HEALTH_TIPS = [
  {
    title: "Midday Salad",
    description: "Add sliced cucumbers, tomatoes, and half a lemon to your bowl of daal or sabzi. This adds bulk to your lunch without extra oil.",
    tag: "LOCAL CUCUMBER & LEMON",
    benefit: "Keeps you full longer"
  },
  {
    title: "Nimbu Pani",
    description: "Drink a fresh glass of lemon water with a pinch of black salt (kala namak) instead of sweet carbonated drinks. Great for hot Pakistani summers!",
    tag: "ZERO SUGAR REFRESHER",
    benefit: "Beats summer fatigue"
  },
  {
    title: "Smart Chai",
    description: "Avoid white sugar in your milk tea (Chai). Try half a teaspoon of brown sugar or organic honey, and use low-fat skimmed milk instead of full cream.",
    tag: "LOW CALORIE TEA",
    benefit: "Saves 100+ kcal daily"
  },
  {
    title: "Dahi Snacking",
    description: "Skip samosas or biscuits. Have three tablespoons of plain dahi (yogurt) with sliced cucumber or half an apple. It aids digestion and builds muscle.",
    tag: "DAHI & APPLE MIX",
    benefit: "Great probiotic & protein"
  },
  {
    title: "Lal Atta Roti",
    description: "Use stone-ground whole wheat flour (Lal Atta) instead of white flour (Maida). Fiber-rich rotis keep blood sugar stable and prevent overeating.",
    tag: "WHOLE-WHEAT LAL ATTA",
    benefit: "Provides slow release energy"
  }
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
  onUpdateLogs
}: DashboardProps) {
  
  // Local input values
  const [foodCalInput, setFoodCalInput] = useState('');
  const [foodProtInput, setFoodProtInput] = useState('');
  const [customWaterInput, setCustomWaterInput] = useState('');
  const [customStepsInput, setCustomStepsInput] = useState('');
  
  // Health tips carousel index
  const [tipIndex, setTipIndex] = useState(0);

  // Manual habit checks override state
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

  // Simulated Gemini Nutritional Insight States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<{
    status: string;
    actionTitle: string;
    recommendation: string;
    rationale: string;
    pacingColor: string;
  } | null>(null);

  // Analyze function based on logged statistics and user profile
  const runNutritionAnalysis = (silent = false) => {
    if (!silent) {
      setIsAiAnalyzing(true);
    }
    
    const delay = silent ? 0 : 1000;
    setTimeout(() => {
      let status = "Balanced Nutrition";
      let actionTitle = "Add Micro-nutrients";
      let recommendation = "Include 1 fresh glass of cucumber & mint raita with your main meals.";
      let rationale = "This raises healthy enzymes, cools down body temperature naturally, and aids digestion of traditional heavy lentils.";
      let pacingColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

      const calTarget = metrics.calories;
      const protTarget = metrics.protein;

      if (loggedCalories === 0) {
        status = "Intake Tracker Pending";
        actionTitle = "Start with Lal Atta Roti";
        recommendation = "Begin your morning by eating 1 whole-wheat Lal Atta Roti paired with 2 egg whites cooked in 1/2 teaspoon of mustard oil.";
        rationale = "Whole wheat Lal Atta contains essential slow-release complex carbs that prevent mid-morning glucose drops, perfect for your profile.";
        pacingColor = "text-text-gold bg-gold-primary/10 border-gold-primary/20";
      } else if (loggedProtein < protTarget * 0.4) {
        status = "Protein Deficit Warning";
        actionTitle = "Incorporate Greek Dahi / Roasted Chickpeas";
        recommendation = "Swap your evening flour biscuit or deep-fried samosa with 3 full tablespoons of plain Greek Dahi (yogurt) or 30g of dry roasted chickpeas (Bhuna Chana).";
        rationale = "Traditional Pakistani flour snacks are high in refined trans fats and oils. Bhuna Chana provides 6g of clean protein per handful with a low glycemic index.";
        pacingColor = "text-amber-400 bg-amber-500/10 border-amber-500/25";
      } else if (loggedCalories > calTarget * 0.8) {
        status = "Calorie Ceiling Alert";
        actionTitle = "Swap White Rice for Cauliflower Mash or Roti";
        recommendation = "For your next meal, replace deep-fried chicken curry and white Maida Naan with boiled skinless chicken tandoori and half a whole-wheat Chapati.";
        rationale = "White rice and Naan spike insulin rapidly, causing immediate fat storage. Swap them for tandoori with chapati to save over 350 kcal while doubling fiber.";
        pacingColor = "text-red-400 bg-red-500/10 border-red-500/25";
      } else {
        status = "Excellent Wellness Pacing";
        actionTitle = "Add Chia Seeds to Water";
        recommendation = "Add 1 teaspoon of pre-soaked Chia seeds (Tukh-malanga) to your daily water intake.";
        rationale = "Tukh-malanga contains soluble fiber and omega-3 fatty acids which support gut health, lower blood pressure, and keep hydration high.";
        pacingColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      }

      if (profile.healthConditions.includes('diabetes')) {
        rationale += " Furthermore, this whole-food adjustment stabilizes insulin sensitivity, which is critical for diabetes management.";
      } else if (profile.healthConditions.includes('high-blood-pressure')) {
        rationale += " Additionally, this low-sodium choice prevents water retention and supports cardiorespiratory health.";
      }

      setAiInsight({
        status,
        actionTitle,
        recommendation,
        rationale,
        pacingColor
      });
      setIsAiAnalyzing(false);
    }, delay);
  };

  // Run analysis when logs change
  useEffect(() => {
    runNutritionAnalysis(true);
  }, [loggedCalories, loggedProtein]);

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
    // Snapshot of current logged statistics BEFORE the action is taken
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

    // Apply updates immediately
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

  // Slogan/Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = parseInt(foodCalInput) || 0;
    const prot = parseInt(foodProtInput) || 0;
    if (cal > 0 || prot > 0) {
      triggerUndoableAction(`Food logged (+${cal} kcal, +${prot}g protein)`, {
        calories: loggedCalories + cal,
        protein: loggedProtein + prot
      });
      setFoodCalInput('');
      setFoodProtInput('');
    }
  };

  const handleAddWaterMl = (ml: number) => {
    const currentLitres = loggedWater;
    const additionalLitres = ml / 1000;
    const targetWater = Math.round((currentLitres + additionalLitres) * 100) / 100;
    triggerUndoableAction(`Water logged (+${ml}ml)`, {
      water: targetWater
    });
  };

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseInt(customWaterInput) || 0;
    if (ml > 0) {
      handleAddWaterMl(ml);
      setCustomWaterInput('');
    }
  };

  const handleAdjustSteps = (amount: number) => {
    const targetSteps = Math.max(0, loggedSteps + amount);
    triggerUndoableAction(`Steps adjusted (${amount > 0 ? '+' : ''}${amount.toLocaleString()})`, {
      steps: targetSteps
    });
  };

  const handleCustomStepsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const steps = parseInt(customStepsInput) || 0;
    if (steps > 0) {
      handleAdjustSteps(steps);
      setCustomStepsInput('');
    }
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

  // Macro target allocations (Standard calorie split ratio)
  // Protein is metrics.protein
  // Carbs = 40% of target calories
  // Fat = 25% of target calories
  const carbTarget = Math.round((metrics.calories * 0.40) / 4);
  const fatTarget = Math.round((metrics.calories * 0.25) / 9);

  // Estimating consumed carbs/fat proportionally for UI movement
  const consumedCarbs = Math.min(carbTarget, Math.round((loggedCalories * 0.40) / 4));
  const consumedFat = Math.min(fatTarget, Math.round((loggedCalories * 0.25) / 9));

  // Progress Percentages
  const calPercent = Math.min(100, Math.round((loggedCalories / metrics.calories) * 100)) || 0;
  const protPercent = Math.min(100, Math.round((loggedProtein / metrics.protein) * 100)) || 0;
  const carbPercent = Math.min(100, Math.round((consumedCarbs / carbTarget) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((consumedFat / fatTarget) * 100)) || 0;

  const waterPercent = Math.min(100, Math.round((loggedWater / metrics.water) * 100)) || 0;
  const stepsPercent = Math.min(100, Math.round((loggedSteps / metrics.steps) * 100)) || 0;
  const sleepPercent = Math.min(100, Math.round((loggedSleep / metrics.sleep) * 100)) || 0;

  // Format label helper
  const formattedGoalLabel = profile.goal
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const formattedActivityLabel = profile.activityLevel
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Active status of "On Track" AI Coach
  const isOnTrack = loggedCalories <= metrics.calories;

  // Count habits finished
  const habitsCountDone = Object.values(habitsChecked).filter(Boolean).length;

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
  };
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-left">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-sans font-extrabold tracking-tight text-text-headline">
            Daily Health Metrics
          </h2>
          <p className="text-xs text-text-muted mt-1 font-mono">
            {profile.name}'s {formattedGoalLabel} plan · {formattedActivityLabel} · {profile.age} yrs old
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleClearTodayLogs}
            className="flex items-center px-4 py-2 border border-slate-200 hover:border-red-400/20 bg-white hover:bg-slate-50 text-[10px] text-text-muted hover:text-red-650 rounded-lg transition font-mono min-h-[48px]"
            title="Reset daily counts"
          >
            Reset Logs
          </button>
          <button
            onClick={onOpenOnboarding}
            className="flex items-center px-4 py-2 btn-3d-purple text-[10px] font-bold rounded-lg active:scale-95 shadow-sm font-sans min-h-[48px]"
          >
            <RotateCcw className="w-3 h-3 mr-1.5 animate-spin-hover" /> Recalculate
          </button>
        </div>
      </div>

      {/* 📱 Mobile Stats Quick Ring Gauges (Visible on mobile/tablet only, < 1024px) */}
      <div className="lg:hidden grid grid-cols-2 gap-4 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm shadow-sky-500/[0.01]">
        {/* Calorie Progress Ring */}
        <div className="flex flex-col items-center justify-center space-y-2 border-r border-slate-100 pr-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-purple-600 transition-all duration-1000 ease-out"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * Math.min(loggedCalories, metrics.calories)) / metrics.calories}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-extrabold text-text-headline">{Math.max(0, metrics.calories - loggedCalories)}</span>
              <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider font-mono">kcal left</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block font-mono">Consumed</span>
            <span className="text-[10px] font-bold text-text-headline font-mono">{loggedCalories} / {metrics.calories} kcal</span>
          </div>
        </div>

        {/* Steps Progress Ring */}
        <div className="flex flex-col items-center justify-center space-y-2 pl-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-slate-100"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="238.7"
                strokeDashoffset={238.7 - (238.7 * Math.min(loggedSteps, metrics.steps)) / metrics.steps}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-extrabold text-text-headline">{loggedSteps.toLocaleString()}</span>
              <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider font-mono">steps</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block font-mono">Target</span>
            <span className="text-[10px] font-bold text-text-headline font-mono">{metrics.steps.toLocaleString()} steps</span>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Horizontal Health Tips Slider (Visible on < 1024px) */}
      <div className="lg:hidden space-y-2.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block">Swipeable Health Tips:</span>
        <div className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 pb-2.5 scrollbar-none">
          {HEALTH_TIPS.map((tip, i) => (
            <div key={i} className="min-w-[280px] max-w-[280px] snap-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] text-left">
              <div>
                <span className="text-[8px] font-mono font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full uppercase tracking-wider">{tip.tag}</span>
                <h4 className="text-xs font-bold text-text-headline mt-2.5">{tip.title}</h4>
                <p className="text-[11px] text-text-body mt-1 leading-normal italic font-sans">"{tip.description}"</p>
              </div>
              <span className="text-[9px] text-emerald-600 font-bold block border-t border-slate-50 pt-2 mt-2">✓ Benefit: {tip.benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning/Guideline Badges depending on health conditions */}
      {profile.healthConditions.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200/60 flex items-start space-x-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Health Guidelines Triggered</h4>
            <p className="text-xs text-text-body mt-0.5 leading-relaxed font-sans">
              Your calorie caps, protein targets, steps floors, and exercises are personalized for: {profile.healthConditions.map(c => c.split('-').join(' ')).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* METRIC TARGETS CARD GRID (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Daily Calorie */}
        <div className="p-4 rounded-xl bg-bg-card border border-purple-500/15 hover:border-purple-500/35 shadow-card transition duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Daily Calorie</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.calories}</div>
          <div className="text-[10px] text-text-muted mt-0.5">kcal / day</div>
        </div>

        {/* Card 2: Protein Target */}
        <div className="p-4 rounded-xl bg-bg-card border border-purple-500/15 hover:border-purple-500/35 shadow-card transition duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Protein Target</span>
            <Scale className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.protein}</div>
          <div className="text-[10px] text-text-muted mt-0.5">g / day</div>
        </div>

        {/* Card 3: Water Goal */}
        <div className="p-4 rounded-xl bg-bg-card border border-purple-500/15 hover:border-purple-500/35 shadow-card transition duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Water Goal</span>
            <Droplet className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.water}</div>
          <div className="text-[10px] text-text-muted mt-0.5">L / day</div>
        </div>

        {/* Card 4: Daily Steps */}
        <div className="p-4 rounded-xl bg-bg-card border border-purple-500/15 hover:border-purple-500/35 shadow-card transition duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Daily Steps</span>
            <Footprints className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.steps.toLocaleString()}</div>
          <div className="text-[10px] text-text-muted mt-0.5">steps / day</div>
        </div>

        {/* Card 5: Sleep Target */}
        <div className="p-4 rounded-xl bg-bg-card border border-purple-500/20 hover:border-purple-500/40 shadow-card transition duration-200 card-purple-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-wider font-mono">Sleep Target</span>
            <Moon className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.sleep}</div>
          <div className="text-[10px] text-purple-300/60 mt-0.5">hrs / night</div>
        </div>

        {/* Card 6: BMI Index */}
        <div className="p-4 rounded-xl bg-bg-card border border-white/[0.06] hover:border-gold-primary/20 shadow-card transition duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">BMI Index</span>
            <TrendingUp className="w-3.5 h-3.5 text-gold-primary" />
          </div>
          <div className="text-lg font-bold text-text-headline font-mono">{metrics.bmi}</div>
          <div className="text-[10px] text-purple-300/70 font-bold mt-0.5 font-mono">{metrics.bmiCategory}</div>
        </div>
      </div>

      {/* CALORIE BREAKDOWN PROGRESS METER & DIET INFO BANNER */}
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono">Calorie Breakdown</span>
              <h3 className="text-xl font-bold text-text-headline mt-0.5">Total: {metrics.calories} kcal</h3>
            </div>
            <span className="px-3 py-1 bg-gold-primary/10 border border-gold-primary/30 rounded-full text-[10px] font-bold text-text-gold uppercase tracking-wider font-mono">
              {formattedGoalLabel}
            </span>
          </div>

          {/* Three Segment Bar */}
          <div className="w-full h-4 bg-white/[0.04] rounded-full overflow-hidden flex mb-4">
            <div className="bg-[#F4A220]" style={{ width: '35%' }} title="Protein (35%)"></div>
            <div className="bg-[#F8C78A]" style={{ width: '40%' }} title="Carbs (40%)"></div>
            <div className="bg-[#C07A08]" style={{ width: '25%' }} title="Fat (25%)"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="flex flex-col items-center">
              <span className="flex items-center text-[11px] font-semibold text-text-headline">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4A220] mr-1.5 shrink-0"></span>
                Protein (35%)
              </span>
              <span className="text-[11px] text-text-muted font-mono mt-0.5">{Math.round((metrics.calories * 0.35) / 4)}g / {metrics.protein}g</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/[0.04]">
              <span className="flex items-center text-[11px] font-semibold text-text-headline">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F8C78A] mr-1.5 shrink-0"></span>
                Carbs (40%)
              </span>
              <span className="text-[11px] text-text-muted font-mono mt-0.5">{carbTarget}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center text-[11px] font-semibold text-text-headline">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C07A08] mr-1.5 shrink-0"></span>
                Fat (25%)
              </span>
              <span className="text-[11px] text-text-muted font-mono mt-0.5">{fatTarget}g</span>
            </div>
          </div>
        </div>

        {/* Personalized Diet Plan Alert Bar */}
        <div className="p-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">🇵🇰</span>
            <span className="text-text-headline font-semibold">Personalized Diet Plan</span>
            <span className="text-text-muted">·</span>
            <p className="text-text-body">
              Your food plan is personalized for <span className="text-text-gold font-bold">{profile.foodPreferences.join(', ') || 'Standard Diet'}</span> and <span className="text-text-gold font-bold">{formattedGoalLabel}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* DUAL WATER & STEP INTERACTIVE TRACKERS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WATER TRACKER PANEL */}
        <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Water Tracker</span>
            <h3 className="text-md font-bold text-text-headline mt-0.5">My Water Drank</h3>
          </div>

          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-white/[0.04]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-[#7C3AED]"
                  strokeWidth="6"
                  fill="transparent"
                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 54) * (1 - Math.min(1, waterPercent / 100)) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeDasharray={2 * Math.PI * 54}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold font-mono text-text-headline">{Math.round(loggedWater * 1000)}</span>
                <span className="text-[9px] text-text-muted font-mono">/ {Math.round(metrics.water * 1000)} ml</span>
                <span className="text-[9px] font-bold text-purple-300 font-mono mt-0.5">{waterPercent}% DONE</span>
              </div>
            </div>

            {/* Smart Hydration Schedule Checklist */}
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Daily Hydration Schedule</span>
            <div className="grid grid-cols-4 gap-2 w-full">
              {[
                { num: 1, time: "8:00 AM" },
                { num: 2, time: "10:30 AM" },
                { num: 3, time: "12:30 PM" },
                { num: 4, time: "3:00 PM" },
                { num: 5, time: "5:30 PM" },
                { num: 6, time: "7:30 PM" },
                { num: 7, time: "9:00 PM" },
                { num: 8, time: "10:30 PM" }
              ].map((glass) => {
                const isCompleted = loggedWater >= (glass.num * 0.25);
                return (
                  <button
                    key={glass.num}
                    onClick={() => {
                      const newVolume = glass.num * 0.25;
                      onUpdateLogs({ water: newVolume });
                    }}
                    className={`py-2 px-1 border rounded-xl flex flex-col items-center justify-center transition active:scale-95 cursor-pointer ${
                      isCompleted 
                        ? 'bg-purple-950/30 border-purple-500/40 text-purple-300 shadow-sm' 
                        : 'bg-bg-surface border-white/[0.04] text-text-muted hover:border-white/[0.08]'
                    }`}
                  >
                    <span className="text-[14px]">{isCompleted ? '💧' : '🥛'}</span>
                    <span className="text-[8px] font-mono font-bold mt-1">{glass.time}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Quick Add Buttons</span>

            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                onClick={() => handleAddWaterMl(250)}
                className="py-2.5 px-1 bg-bg-surface border border-white/[0.06] hover:border-gold-primary/30 rounded-xl flex flex-col items-center text-center transition"
              >
                <span className="text-xs">🍵</span>
                <span className="text-[9px] font-bold text-text-headline mt-1">+250 ml</span>
                <span className="text-[8px] text-text-muted font-mono">Cup</span>
              </button>

              <button
                onClick={() => handleAddWaterMl(500)}
                className="py-2.5 px-1 bg-bg-surface border border-white/[0.06] hover:border-gold-primary/30 rounded-xl flex flex-col items-center text-center transition"
              >
                <span className="text-xs">🧴</span>
                <span className="text-[9px] font-bold text-text-headline mt-1">+500 ml</span>
                <span className="text-[8px] text-text-muted font-mono">Small Bottle</span>
              </button>

              <button
                onClick={() => handleAddWaterMl(750)}
                className="py-2.5 px-1 bg-bg-surface border border-white/[0.06] hover:border-gold-primary/30 rounded-xl flex flex-col items-center text-center transition"
              >
                <span className="text-xs">🍶</span>
                <span className="text-[9px] font-bold text-text-headline mt-1">+750 ml</span>
                <span className="text-[8px] text-text-muted font-mono">Large Bottle</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleCustomWaterSubmit} className="flex gap-2">
            <input
              type="number"
              placeholder="Other amount (ml)"
              value={customWaterInput}
              onChange={(e) => setCustomWaterInput(e.target.value)}
              className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary outline-none rounded-lg py-1.5 px-3 text-xs text-text-headline font-mono placeholder-text-muted"
            />
            <button
              type="submit"
              className="btn-3d-purple text-purple-50 font-extrabold px-3 py-1.5 rounded-lg text-xs transition"
            >
              Add Water
            </button>
          </form>

          <div className="border-t border-white/[0.04] pt-2.5 flex justify-between text-[10px] font-mono text-text-muted">
            <span>Saved as for today</span>
            <button 
              type="button"
              onClick={() => onUpdateLogs({ water: 0 })}
              className="hover:text-red-400 font-bold transition flex items-center"
            >
              <RotateCcw className="w-2.5 h-2.5 mr-1" /> Clear Today
            </button>
          </div>
        </div>

        {/* STEP TRACKER PANEL */}
        <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col justify-between space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Step Tracker</span>
              <h3 className="text-md font-bold text-text-headline mt-0.5">Daily Walk Counter</h3>
            </div>
            <span className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-[8px] font-bold text-text-gold uppercase tracking-wider font-mono flex items-center">
              <Check className="w-2.5 h-2.5 mr-1 text-gold-primary animate-pulse" /> Auto Detect
            </span>
          </div>

          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-white/[0.04]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-[#7C3AED]"
                  strokeWidth="6"
                  fill="transparent"
                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 54) * (1 - Math.min(1, stepsPercent / 100)) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeDasharray={2 * Math.PI * 54}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold font-mono text-text-headline">{loggedSteps.toLocaleString()}</span>
                <span className="text-[9px] text-text-muted font-mono">Goal: {metrics.steps.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-purple-300 font-mono mt-0.5">{stepsPercent}% DONE</span>
              </div>
            </div>

            <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Adjust Today's Steps</span>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => handleAdjustSteps(1000)}
                className="py-2 bg-bg-surface border border-white/[0.06] hover:border-gold-primary/30 rounded-xl text-xs font-bold text-text-headline transition flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-gold-primary" />
                <span>1,000 Steps</span>
              </button>

              <button
                onClick={() => handleAdjustSteps(-1000)}
                className="py-2 bg-bg-surface border border-white/[0.06] hover:border-gold-primary/30 rounded-xl text-xs font-bold text-text-headline transition flex items-center justify-center space-x-1"
              >
                <Minus className="w-3.5 h-3.5 text-gold-primary" />
                <span>1,000 Steps</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleCustomStepsSubmit} className="flex gap-2">
            <input
              type="number"
              placeholder="Custom steps amount..."
              value={customStepsInput}
              onChange={(e) => setCustomStepsInput(e.target.value)}
              className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary outline-none rounded-lg py-1.5 px-3 text-xs text-text-headline font-mono placeholder-text-muted"
            />
            <button
              type="submit"
              className="btn-3d-purple text-purple-50 font-bold px-3 py-1.5 rounded-lg text-xs transition whitespace-nowrap"
            >
              Add Steps
            </button>
          </form>

          <div className="border-t border-white/[0.04] pt-2.5 flex justify-between text-[10px] font-mono text-text-muted">
            <span>Keep stepping!</span>
            <button 
              type="button"
              onClick={() => onUpdateLogs({ steps: 0 })}
              className="hover:text-red-400 font-bold transition flex items-center"
            >
              <RotateCcw className="w-2.5 h-2.5 mr-1" /> Reset Today
            </button>
          </div>
        </div>

      </div>

      {/* RAMADAN TIMINGS BANNER (ONLY IF RAMADAN ACTIVE) */}
      {profile.goal === 'stay-healthy' && (
        <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-center text-xs text-text-muted font-mono">
          <Coffee className="w-3.5 h-3.5 mr-2 text-gold-primary" /> Loading Ramadan timings....
        </div>
      )}

      {/* HEALTH TIP OF THE DAY */}
      <div className="bg-gradient-to-br from-bg-card to-bg-surface border border-white/[0.08] p-6 rounded-2xl shadow-deep text-left space-y-4">
        <div className="flex items-center space-x-2 text-text-gold font-bold text-xs uppercase tracking-wider font-mono">
          <Lightbulb className="w-4 h-4 text-gold-primary shrink-0 animate-pulse" />
          <span>Health Tip of the Day</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-md font-sans font-bold text-text-headline text-gradient-gold">
            {HEALTH_TIPS[tipIndex].title}
          </h4>
          <p className="text-xs text-text-body italic leading-relaxed pt-1 font-sans">
            "{HEALTH_TIPS[tipIndex].description}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.04] text-[10px] font-mono">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-text-gold font-bold uppercase">
              ★ {HEALTH_TIPS[tipIndex].tag}
            </span>
            <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-bold uppercase flex items-center">
              ✓ {HEALTH_TIPS[tipIndex].benefit}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-text-muted">From our Health Library</span>
            <button
              onClick={handleNextTip}
              className="py-1 px-3 btn-3d-purple text-purple-50 font-bold rounded-lg transition flex items-center"
            >
              Next Tip <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>


      {/* THESE 4: YOUR AI COACH, WELLNESS RADAR CHART, QUICK HEALTH UPDATES, AND PROTEIN, CARBS & FAT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* YOUR AI COACH (Gold solid card) */}
        <div className="bg-[#F4A220] text-bg-deep p-5 rounded-xl flex flex-col justify-between shadow-card relative overflow-hidden min-h-[160px] hover:scale-[1.01] transition duration-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono opacity-80">YOUR WELLNESS COACH</span>
            <span className="px-2 py-0.5 bg-bg-deep text-text-gold rounded-full text-[9px] font-bold uppercase font-mono tracking-wider">
              {isOnTrack ? 'READY' : 'BUSY'}
            </span>
          </div>
          <div className="space-y-1 my-3">
            <h4 className="text-sm font-semibold opacity-90">On Track?</h4>
            <div className="text-3xl font-extrabold flex items-center font-sans tracking-tight">
              {isOnTrack ? 'YES 🔥' : 'WATCH UP ⚡'}
            </div>
          </div>
          <div className="border-t border-bg-deep/10 pt-2 flex justify-between items-center text-[11px] font-bold font-mono text-bg-deep/75">
            <span>INTAKE TARGET</span>
            <span>{metrics.calories} KCAL</span>
          </div>
        </div>

        {/* 5-DIMENSION WELLNESS RADAR CHART */}
        <div className="bg-bg-card border border-purple-500/15 p-5 rounded-xl shadow-card flex flex-col justify-between min-h-[160px] hover:border-purple-500/35 transition duration-200 card-purple-hover">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-widest font-mono">Wellness Balance</span>
            <span className="text-[9px] font-mono text-purple-400 font-bold">5-D Radar</span>
          </div>

          <div className="flex items-center justify-center py-1">
            <svg viewBox="0 0 200 200" className="w-28 h-28">
              {/* Pentagon concentric grids */}
              {[20, 40, 60, 80, 100].map((percent) => {
                const r = 70 * (percent / 100);
                const points = Array.from({ length: 5 }).map((_, i) => {
                  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                  const x = 100 + Math.cos(angle) * r;
                  const y = 100 + Math.sin(angle) * r;
                  return `${x},${y}`;
                }).join(" ");
                return (
                  <polygon
                    key={percent}
                    points={points}
                    className="fill-none stroke-white/[0.04] stroke-[1]"
                  />
                );
              })}

              {/* Pentagon axis lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                const x = 100 + Math.cos(angle) * 70;
                const y = 100 + Math.sin(angle) * 70;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    className="stroke-white/[0.04] stroke-[1]"
                  />
                );
              })}

              {/* Dynamic filled radar polygon */}
              <polygon
                points={(() => {
                  const values = [waterPercent, stepsPercent, sleepPercent, calPercent, protPercent];
                  return values.map((val, i) => {
                    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                    const r = 70 * (Math.max(10, Math.min(100, val)) / 100);
                    const x = 100 + Math.cos(angle) * r;
                    const y = 100 + Math.sin(angle) * r;
                    return `${x},${y}`;
                  }).join(" ");
                })()}
                className="fill-purple-500/20 stroke-purple-500 stroke-[2] transition-all duration-300"
              />

              {/* Small dots on vertices */}
              {(() => {
                const values = [waterPercent, stepsPercent, sleepPercent, calPercent, protPercent];
                return values.map((val, i) => {
                  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                  const r = 70 * (Math.max(10, Math.min(100, val)) / 100);
                  const x = 100 + Math.cos(angle) * r;
                  const y = 100 + Math.sin(angle) * r;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3.5"
                      className="fill-purple-300 stroke-purple-600 stroke-[1]"
                    />
                  );
                });
              })()}

              {/* Small labels on outer vertices */}
              {['H2O', 'Walk', 'Rest', 'Kcal', 'Prot'].map((lbl, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                const offset = 85;
                const x = 100 + Math.cos(angle) * offset;
                const y = 100 + Math.sin(angle) * offset;
                return (
                  <text
                    key={lbl}
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    className="fill-text-muted text-[8px] font-mono font-bold"
                  >
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>

          <p className="text-[8px] font-mono text-text-muted text-center mt-1">Balanced day = perfect pentagon</p>
        </div>

        {/* QUICK HEALTH UPDATES CARD */}
        <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card flex flex-col justify-between min-h-[160px] hover:border-gold-primary/20 transition duration-200">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block">Quick Health Updates</span>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => handleAdjustSteps(1500)}
                className="p-3 bg-bg-surface border border-white/[0.04] hover:border-purple-500/30 rounded-xl flex flex-col items-center justify-center text-center transition group active:scale-95"
              >
                <Footprints className="w-4 h-4 text-text-muted group-hover:text-purple-400 transition mb-1" />
                <span className="text-[9px] font-bold text-text-headline">Add Steps</span>
                <span className="text-[9px] text-purple-300 font-mono font-bold mt-0.5">+1.5k</span>
              </button>

              <button
                onClick={() => handleAddWaterMl(250)}
                className="p-3 bg-bg-surface border border-white/[0.04] hover:border-purple-500/30 rounded-xl flex flex-col items-center justify-center text-center transition group active:scale-95"
              >
                <Droplet className="w-4 h-4 text-text-muted group-hover:text-purple-400 transition mb-1" />
                <span className="text-[9px] font-bold text-text-headline">Add Water</span>
                <span className="text-[9px] text-purple-300 font-mono font-bold mt-0.5">+250ml</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-2 flex justify-between text-[11px] font-mono text-text-muted">
            <span>Steps: {loggedSteps.toLocaleString()}</span>
            <span>Fluid: {Math.round(loggedWater * 1000)} ml</span>
          </div>
        </div>

        {/* MACROS CARD (Protein, Carbs & Fat detailed progress) */}
        <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card flex flex-col justify-between hover:border-gold-primary/20 transition duration-200">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block mb-3">Protein, Carbs & Fat</span>
            <div className="space-y-3">
              {/* Protein Row */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-text-headline">Protein</span>
                  <span className="text-text-muted font-mono">{loggedProtein}g / {metrics.protein}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${protPercent}%` }}></div>
                </div>
              </div>

              {/* Carbs Row */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-text-headline">Carbohydrates</span>
                  <span className="text-text-muted font-mono">{consumedCarbs}g / {carbTarget}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F8C78A] transition-all duration-300" style={{ width: `${carbPercent}%` }}></div>
                </div>
              </div>

              {/* Fat Row */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-text-headline">Healthy Fats</span>
                  <span className="text-text-muted font-mono">{consumedFat}g / {fatTarget}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-gold-dark transition-all duration-300" style={{ width: `${fatPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[9px] font-mono text-text-muted mt-2">Helpful for tracking your body's power</p>
        </div>

      </div>

      {/* TODAY'S FOCUS */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono flex items-center">
          <Award className="w-4 h-4 text-gold-primary mr-1.5" /> Today's Focus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Physical Focus */}
          <div className="p-4 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[9px] font-bold text-text-gold uppercase tracking-widest font-mono">Body · Legs & Glutes</span>
              <h4 className="text-sm font-bold text-text-headline flex items-center mt-1">
                <span className="mr-2">🦵</span> Squats
              </h4>
              <p className="text-xs text-text-body mt-1 leading-relaxed">
                Lower your hips from a standing position to build strong leg muscles and core stability.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono text-text-muted">3 sets x 12 reps</span>
              <button 
                onClick={() => setCurrentTab('exercises')}
                className="text-xs font-bold text-text-gold hover:text-gold-light transition flex items-center"
              >
                Start Exercise <span className="ml-1">→</span>
              </button>
            </div>
          </div>

          {/* Mental Focus */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col justify-between space-y-3 card-purple-hover">
            <div>
              <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest font-mono">Mind · Stress Relief</span>
              <h4 className="text-sm font-bold text-text-headline flex items-center mt-1">
                <span className="mr-2">🧠</span> Body Scan Meditation
              </h4>
              <p className="text-xs text-text-body mt-1 leading-relaxed">
                Focus your mental attention sequentially on different body parts to release deep muscle tension.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-purple-500/10">
              <span className="text-[10px] font-mono text-text-muted">5 minutes</span>
              <button 
                onClick={() => setCurrentTab('exercises')}
                className="text-xs font-bold text-purple-300 hover:text-purple-200 transition flex items-center"
              >
                Start Relaxation <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KEY NUTRIENTS PILLS */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest font-mono flex items-center">
          <Info className="w-4 h-4 text-gold-primary mr-1.5" /> Key Nutrients For You
        </h3>
        <div className="flex flex-wrap gap-2">
          {metrics.nutrients.map((n, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-xs text-purple-200 font-bold font-mono transition">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* INTERACTIVE TRACKING PANELS: SIDE-BY-SIDE FOOD CALORIE & TODAY'S FOOD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Food Calories Tracked Widget */}
        <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">Food Calorie Tracked</span>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-text-muted font-mono">Today</span>
            </div>
          </div>

          {/* Large circular/radial progress representation */}
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-white/[0.04]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-[#7C3AED]"
                  strokeWidth="8"
                  fill="transparent"
                  initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 62) * (1 - Math.min(1, calPercent / 100)) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeDasharray={2 * Math.PI * 62}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">REMAINING</span>
                <span className="text-xl font-bold font-mono text-text-headline">{Math.max(0, metrics.calories - loggedCalories)}</span>
                <span className="text-[10px] text-text-muted font-mono">/ {metrics.calories} kcal</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="text-[11px] text-text-muted uppercase tracking-wider font-mono">Of Day's Goal Consumed</div>
              <div className="text-xs font-bold text-text-gold font-mono">EATEN: {loggedCalories} KCAL</div>
            </div>
          </div>

          {/* Quick inline logger */}
          <form onSubmit={handleLogFood} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Log calories (kcal)"
                value={foodCalInput}
                onChange={(e) => setFoodCalInput(e.target.value)}
                className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary outline-none rounded-lg py-1.5 px-3 text-xs text-text-headline font-mono placeholder-text-muted"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={foodProtInput}
                onChange={(e) => setFoodProtInput(e.target.value)}
                className="w-24 bg-bg-surface border border-white/[0.06] focus:border-gold-primary outline-none rounded-lg py-1.5 px-2 text-xs text-text-headline font-mono placeholder-text-muted"
              />
              <button
                type="submit"
                className="btn-3d-purple text-purple-50 font-bold px-4 py-1.5 rounded-lg text-xs transition"
              >
                Log
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setCurrentTab('meals')}
                className="text-[10px] font-bold text-text-gold hover:underline flex items-center"
              >
                Add meal +
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Today's Food List View */}
        <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block mb-2">Today's Food List</span>
            <div className="flex flex-col items-center justify-center py-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-muted">
                <ChefHat className="w-5 h-5" />
              </div>
              <p className="text-xs text-text-body">No meals tracked today. Add your first meal.</p>
              <button 
                onClick={() => setCurrentTab('meals')}
                className="text-xs font-bold text-text-gold hover:underline active:scale-95 transition"
              >
                Log a meal now
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-3 text-[10px] font-mono text-text-muted text-left flex justify-between items-center">
            <span>Total Eaten: {loggedCalories} kcal</span>
            <span className="text-text-gold font-bold">{loggedProtein}g Protein</span>
          </div>
        </div>

      </div>

      {/* COACHES & AI INSIGHTS SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI COACH SUGGESTIONS FOR YOU */}
        <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card text-left flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block mb-3">Coach Suggestions</span>
            <div className="space-y-2">
              <div className="p-3 bg-bg-surface border border-white/[0.04] rounded-xl flex items-center space-x-3 text-xs text-text-body">
                <span className="text-base shrink-0">💧</span>
                <p>
                  <strong className="text-text-headline">Drink water:</strong> Drink a glass of water now to stay fresh. Nimbu pani is great too!
                </p>
              </div>

              <div className="p-3 bg-bg-surface border border-white/[0.04] rounded-xl flex items-center space-x-3 text-xs text-text-body">
                <span className="text-base shrink-0">🚶</span>
                <p>
                  <strong className="text-text-headline">Stay active:</strong> Walk for 5 to 10 minutes right now to stretch your legs.
                </p>
              </div>

              <div className="p-3 bg-bg-surface border border-white/[0.04] rounded-xl flex items-center space-x-3 text-xs text-text-body">
                <span className="text-base shrink-0">🍏</span>
                <p>
                  <strong className="text-text-headline">Snack well:</strong> Have some dahi (yogurt) or a handful of almonds instead of sweet biscuits.
                </p>
              </div>
            </div>
          </div>
          <p className="text-[9px] font-mono text-text-muted mt-3 pt-2 border-t border-white/[0.04]">Friendly advice from your health helpers.</p>
        </div>

        {/* NUTRITIONAL INSIGHTS CARD */}
        <div className="bg-bg-card border border-purple-500/15 p-5 rounded-xl shadow-card text-left flex flex-col justify-between relative overflow-hidden">
          {/* Subtle purple decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <span className="p-1 rounded bg-purple-500/15 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest font-mono">Nutritional Insights</span>
              </div>
              
              <button
                onClick={() => runNutritionAnalysis(false)}
                disabled={isAiAnalyzing}
                className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition disabled:opacity-50 active:scale-95 flex items-center space-x-1 cursor-pointer"
                title="Recalculate Recommendations"
              >
                <RotateCcw className={`w-3 h-3 ${isAiAnalyzing ? 'animate-spin text-purple-400' : ''}`} />
                <span className="text-[9px] font-mono font-bold uppercase px-0.5">REANALYZE</span>
              </button>
            </div>

            {isAiAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 border-2 border-purple-500/35 border-t-purple-400 rounded-full animate-spin"></div>
                <span className="text-[10px] font-mono text-purple-300/70 uppercase tracking-wider animate-pulse">Analyzing Health Metrics...</span>
              </div>
            ) : aiInsight ? (
              <div className="space-y-3.5">
                <div className="flex items-center">
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${aiInsight.pacingColor}`}>
                    {aiInsight.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-text-muted uppercase">Specific Recommendation</span>
                  <h4 className="text-sm font-extrabold text-text-headline tracking-tight leading-snug">
                    {aiInsight.recommendation}
                  </h4>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-text-muted uppercase">Scientific Rationale</span>
                  <p className="text-xs text-text-body leading-relaxed">
                    {aiInsight.rationale}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-text-muted">
                No current nutritional insight. Try logging your calories or protein above.
              </div>
            )}
          </div>

          <p className="text-[9px] font-mono text-text-muted mt-4 pt-2 border-t border-white/[0.04]">
            Calculated based on health profile targets: <span className="text-text-headline font-bold">{metrics.calories} kcal / {metrics.protein}g protein</span>
          </p>
        </div>

      </div>

      {/* DAILY HABITS INTERACTIVE LIST */}
      <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block">Your Daily Habits</span>
            <p className="text-xs text-text-body mt-0.5">Check things off as you do them!</p>
          </div>
          <span className="px-2.5 py-1 badge-purple rounded-full text-[10px] font-bold font-mono flex items-center">
            <Check className="w-3 h-3 mr-1" /> {habitsCountDone} / 3 Habits Done
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Habit 1: Water */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, water: !p.water }))}
            className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
              habitsChecked.water 
                ? 'bg-purple-950/40 border-purple-500/30 shadow shadow-purple-500/10' 
                : 'bg-bg-surface border-white/[0.06] hover:border-purple-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${habitsChecked.water ? 'bg-purple-500/15 text-purple-400' : 'bg-white/[0.03] text-text-muted'}`}>
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${habitsChecked.water ? 'text-purple-300' : 'text-text-headline'}`}>My Water Goal</h4>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">Drink plenty of water today ({Math.round(loggedWater * 1000)}ml / {Math.round(metrics.water * 1000)}ml)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
              habitsChecked.water 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-white/[0.2] hover:border-purple-500/40'
            }`}>
              {habitsChecked.water && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Habit 2: Steps */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, steps: !p.steps }))}
            className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
              habitsChecked.steps 
                ? 'bg-purple-950/40 border-purple-500/30 shadow shadow-purple-500/10' 
                : 'bg-bg-surface border-white/[0.06] hover:border-purple-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${habitsChecked.steps ? 'bg-purple-500/15 text-purple-400' : 'bg-white/[0.03] text-text-muted'}`}>
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${habitsChecked.steps ? 'text-purple-300' : 'text-text-headline'}`}>Moving Around</h4>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">Walk or do easy home exercise ({loggedSteps.toLocaleString()} steps / {metrics.steps.toLocaleString()} steps)</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
              habitsChecked.steps 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-white/[0.2] hover:border-purple-500/40'
            }`}>
              {habitsChecked.steps && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Habit 3: Sleep */}
          <button
            onClick={() => setHabitsChecked(p => ({ ...p, sleep: !p.sleep }))}
            className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
              habitsChecked.sleep 
                ? 'bg-purple-950/40 border-purple-500/30 shadow shadow-purple-500/10' 
                : 'bg-bg-surface border-white/[0.06] hover:border-purple-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${habitsChecked.sleep ? 'bg-purple-500/15 text-purple-400' : 'bg-white/[0.03] text-text-muted'}`}>
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${habitsChecked.sleep ? 'text-purple-300' : 'text-text-headline'}`}>Good Sleep</h4>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">Sleep for {metrics.sleep} hours last night</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
              habitsChecked.sleep 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'border-white/[0.2] hover:border-purple-500/40'
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

      {/* WEEKLY EXERCISE CSS BAR CHART */}
      <div className="bg-bg-card border border-white/[0.06] p-5 rounded-xl shadow-card space-y-4 text-left">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block">My Exercise This Week</span>
            <p className="text-xs text-text-body mt-0.5">See your workouts and active minutes.</p>
          </div>
          <span className="px-2.5 py-1 bg-gold-primary/10 border border-gold-primary/20 rounded-full text-[10px] font-bold text-text-gold font-mono flex items-center">
            <Check className="w-3 h-3 mr-1" /> Active
          </span>
        </div>

        {/* CSS Chart Representation */}
        <div className="relative pt-6">
          <div className="h-40 flex items-end justify-between px-2 sm:px-6 relative">
            
            {/* Grid Line lines */}
            <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none">
              <div className="border-b border-white/[0.04] w-full text-[9px] font-mono text-text-muted flex justify-between pb-0.5"><span>4</span><span>------------------------------------------------------------------------------------------------------------------------</span></div>
              <div className="border-b border-white/[0.04] w-full text-[9px] font-mono text-text-muted flex justify-between pb-0.5"><span>3</span><span>------------------------------------------------------------------------------------------------------------------------</span></div>
              <div className="border-b border-white/[0.04] w-full text-[9px] font-mono text-text-muted flex justify-between pb-0.5"><span>2</span><span>------------------------------------------------------------------------------------------------------------------------</span></div>
              <div className="border-b border-white/[0.04] w-full text-[9px] font-mono text-text-muted flex justify-between pb-0.5"><span>1</span><span>------------------------------------------------------------------------------------------------------------------------</span></div>
              <div className="w-full text-[9px] font-mono text-text-muted flex justify-between pb-0.5"><span>0</span><span>------------------------------------------------------------------------------------------------------------------------</span></div>
            </div>

            {/* Bars for Mon - Sun */}
            {[
              { day: 'Mon', h: 'h-4 bg-white/[0.04] hover:bg-purple-500/30' },
              { day: 'Tue', h: 'h-14 bg-purple-600/70 hover:bg-purple-500' },
              { day: 'Wed', h: 'h-6 bg-white/[0.04] hover:bg-purple-500/30' },
              { day: 'Thu', h: 'h-14 bg-purple-600/70 hover:bg-purple-500' },
              { day: 'Fri', h: 'h-4 bg-white/[0.04] hover:bg-purple-500/30' },
              { day: 'Sat', h: 'h-14 bg-purple-600/70 hover:bg-purple-500' },
              { day: 'Sun', h: 'h-8 bg-white/[0.04] hover:bg-purple-500/30' }
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center w-8 group z-10">
                <div className={`${bar.h} w-4 rounded-t transition-all duration-300 relative`}>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-surface border border-white/[0.08] text-[9px] font-bold text-text-gold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    Active
                  </div>
                </div>
                <span className="text-[10px] font-mono text-text-muted mt-2">{bar.day}</span>
              </div>
            ))}

          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-3 flex justify-between text-[10px] font-mono text-text-muted">
          <span>Wellness hours tracked this cycle</span>
          <span className="text-text-gold font-bold">8 mins total</span>
        </div>
      </div>



      {/* 5-SECOND UNDO TOAST NOTIFICATION */}
      {showUndoToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#131A35] border border-gold-primary/30 shadow-deep max-w-sm w-[90vw] flex flex-col space-y-3 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-text-headline">
                {undoMessage}
              </span>
            </div>
            <button
              onClick={handleUndo}
              className="px-3 py-1 bg-gold-primary hover:bg-gold-light text-bg-deep font-extrabold text-[10px] rounded transition flex items-center shrink-0 active:scale-95 shadow-md"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Undo ({undoTimer}s)
            </button>
          </div>
          {/* Countdown animated progress bar */}
          <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold-primary transition-all duration-1000 ease-linear" 
              style={{ width: `${(undoTimer / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

    </div>
  );
}

