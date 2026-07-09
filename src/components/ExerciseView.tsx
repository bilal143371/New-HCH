import React, { useState, useEffect } from 'react';
import { UserProfile, Exercise, LoggedActivity } from '../types';
import { EXERCISES } from '../data/exercises';
import { EXERCISE_PLAN_VARIATIONS } from '../data/exercises';
import { theme } from '../styles/theme';
import { mediaMap } from '../data/mediaMap';
import '../styles/design-system.css';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Shield, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Check, 
  Plus, 
  Minus, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Timer, 
  X, 
  PlusCircle, 
  Trash2,
  RefreshCw
} from 'lucide-react';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface ExerciseViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  activityLogs: LoggedActivity[];
  setActivityLogs: React.Dispatch<React.SetStateAction<LoggedActivity[]>>;
  onLogActivity: (exercise: Exercise, loggedDuration: string) => void;
}

const getCaloriesForCategory = (category: string): number => {
  switch (category) {
    case 'legs': return 120;
    case 'arms': return 100;
    case 'chest': return 130;
    case 'back': return 90;
    case 'core': return 110;
    case 'full-body': return 200;
    case 'breathing': return 15;
    case 'meditation': return 10;
    case 'sleep': return 5;
    case 'stress': return 10;
    case 'energy': return 25;
    default: return 120;
  }
};

const getGoalLabel = (goal: string): string => {
  switch (goal) {
    case 'lose-weight': return 'Lose Weight';
    case 'build-muscle': return 'Build Muscle';
    case 'stay-healthy': return 'Stay Healthy';
    case 'reduce-stress': return 'Reduce Stress';
    case 'improve-fitness': return 'Improve Fitness';
    default: return 'Lose Weight';
  }
};

export default function ExerciseView({
  profile,
  onUpdateProfile,
  activityLogs = [],
  setActivityLogs,
  onLogActivity
}: ExerciseViewProps) {
  const [activeTab, setActiveTab] = useState<'physical' | 'mental' | 'plan'>('physical');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const toggleHealthCondition = (condition: string) => {
    let updated: string[];
    if (profile.healthConditions.includes(condition)) {
      updated = profile.healthConditions.filter((c) => c !== condition);
    } else {
      updated = [...profile.healthConditions, condition];
    }
    onUpdateProfile({
      ...profile,
      healthConditions: updated
    });
  };
  
  // Heart Condition bypass state
  const [bypassHeartRestriction, setBypassHeartRestriction] = useState(false);

  // Timer Dialog States
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [heartRate, setHeartRate] = useState(72);

  // Simulated Heart Rate Zones loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeExercise && timerRunning) {
      interval = setInterval(() => {
        setHeartRate((prev) => {
          const maxHr = 220 - profile.age;
          const targetHr = maxHr * 0.72; // target cardio fat-burn zone
          if (prev < targetHr) {
            return prev + Math.floor(Math.random() * 3) + 2; // rise up
          } else {
            return prev + (Math.random() > 0.5 ? 1 : -1); // hover around target
          }
        });
      }, 1000);
    } else {
      // drop down slowly back to resting rate
      interval = setInterval(() => {
        setHeartRate((prev) => {
          if (prev > 72) {
            return prev - Math.floor(Math.random() * 2) - 1;
          }
          return 72;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [activeExercise, timerRunning, profile.age]);

  // Active Rest Interval Timer states
  const [restSeconds, setRestSeconds] = useState(60);
  const [restMaxSeconds, setRestMaxSeconds] = useState(60);
  const [restRunning, setRestRunning] = useState(false);

  // Manual Log Workout modal states
  const [showManualLog, setShowManualLog] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualSphere, setManualSphere] = useState<'physical' | 'mental'>('physical');
  const [manualCategory, setManualCategory] = useState('legs');
  const [manualDuration, setManualDuration] = useState('15 mins');

  // 7-Day Plan States
  const [planSubTab, setPlanSubTab] = useState<'active' | 'past'>('active');
  const [sevenDayPlan, setSevenDayPlan] = useState<any[] | null>(null);
  const [savedExercisePlans, setSavedExercisePlans] = useState<{id: string, name: string, date: string, days: any[]}[]>([]);

  // Undo Toast state
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoMessage, setUndoMessage] = useState('');
  const [undoTargetId, setUndoTargetId] = useState<string | null>(null);
  const [undoProgress, setUndoProgress] = useState(100);

  // Difficulty Filter State
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedExercisePresetId, setSelectedExercisePresetId] = useState<string>('fat-burn-cardio');

  const [generatingStep, setGeneratingStep] = useState(0);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const [selectedBurnFood, setSelectedBurnFood] = useState('samosa');
  const getBurnFoodCalories = () => {
    switch (selectedBurnFood) {
      case 'chai': return 150;
      case 'roti': return 120;
      case 'samosa': return 260;
      case 'paratha': return 320;
      case 'gulab': return 180;
      case 'biryani': return 550;
      default: return 260;
    }
  };

  const EXERCISE_GENERATION_TIPS = [
    "Analyzing joint-pain & cardio thresholds...",
    "Selecting low-impact or high-stamina moves...",
    "Structuring balanced mid-week mental relaxation...",
    "Formatting standard daily workout intervals..."
  ];

  // Load 7-Day Plan on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('seven_day_plan');
    if (savedPlan) {
      try {
        setSevenDayPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error('Error loading 7-day plan', e);
      }
    } else {
      // Seed with dynamic preset based on user profile
      const isJoint = profile.healthConditions.includes('joint-pain') || profile.healthConditions.includes('back-pain');
      const isStamina = profile.goal === 'lose-weight' || profile.goal === 'improve-fitness';
      const targetPresetId = 
        isJoint ? 'low-impact-wellness' :
        isStamina ? 'fat-burn-cardio' : 'strength-lean-muscle';
        
      const preset = EXERCISE_PLAN_VARIATIONS.find(p => p.id === targetPresetId) || EXERCISE_PLAN_VARIATIONS[0];
      setSevenDayPlan(preset.days);
      localStorage.setItem('seven_day_plan', JSON.stringify(preset.days));
    }

    // Load saved exercise plans list
    const savedPlansList = localStorage.getItem('saved_exercise_plans');
    if (savedPlansList) {
      try {
        setSavedExercisePlans(JSON.parse(savedPlansList));
      } catch (e) {
        console.error('Error loading saved plans', e);
      }
    }
  }, [profile.healthConditions, profile.goal]);

  // Sync manual category option list based on sphere
  useEffect(() => {
    if (manualSphere === 'physical') {
      setManualCategory('legs');
    } else {
      setManualCategory('breathing');
    }
  }, [manualSphere]);

  // Filtering category pills list
  const getCategoriesList = () => {
    if (activeTab === 'physical') {
      return ['all', 'legs', 'arms', 'chest', 'back', 'core', 'full-body'];
    } else {
      return ['all', 'breathing', 'meditation', 'sleep', 'stress', 'energy'];
    }
  };

  // Switch tabs reset category
  const handleTabChange = (tab: 'physical' | 'mental' | 'plan') => {
    setActiveTab(tab);
    setActiveCategory('all');
    setSelectedDifficulty('all');
  };

  // Core Filtering and Sorting Logic based on Health profile
  const getFilteredExercises = () => {
    let list = [...EXERCISES];

    // 1. Sphere check
    list = list.filter((ex) => ex.sphere === (activeTab === 'physical' ? 'physical' : 'mental'));

    // 2. Category check
    if (activeCategory !== 'all') {
      list = list.filter((ex) => ex.category === activeCategory);
    }

    // 3. Knee/Joint Pain check: Instantly HIDE jump-based high-impact exercises
    if (profile.healthConditions.includes('joint-pain') && activeTab === 'physical') {
      list = list.filter((ex) => !ex.highImpact);
    }

    // 4. Difficulty level filter (custom selection)
    if (selectedDifficulty !== 'all') {
      list = list.filter((ex) => ex.difficulty === selectedDifficulty);
    }

    // 5. Heart Condition check: Restrict to Beginner difficulty by default (unless bypassed)
    const hasHeartCondition = profile.healthConditions.includes('heart-condition');
    if (hasHeartCondition && !bypassHeartRestriction && activeTab === 'physical') {
      list = list.filter((ex) => ex.difficulty === 'Beginner');
    }

    // 5. Dynamic Sorting/Prioritizing:
    // - Back Pain: Highlight gentle stretches (Cat-Cow, Bird-Dog) at the very top.
    // - Asthma: Place breathing techniques at the very top.
    list.sort((a, b) => {
      // Asthma: breathing category takes absolute priority
      if (profile.healthConditions.includes('asthma')) {
        if (a.category === 'breathing' && b.category !== 'breathing') return -1;
        if (b.category === 'breathing' && a.category !== 'breathing') return 1;
      }

      // Back Pain: back category stretches take priority
      if (profile.healthConditions.includes('back-pain')) {
        if (a.category === 'back' && b.category !== 'back') return -1;
        if (b.category === 'back' && a.category !== 'back') return 1;
      }

      return 0; // maintain original
    });

    return list;
  };

  // Main countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Rest Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restSeconds === 0 && restRunning) {
      setRestRunning(false);
    }
    return () => clearInterval(interval);
  }, [restRunning, restSeconds]);

  // Undo Toast progress tick effect
  useEffect(() => {
    if (!showUndoToast) return;
    
    const interval = setInterval(() => {
      setUndoProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setShowUndoToast(false);
          setUndoTargetId(null);
          return 0;
        }
        return prev - 2; // tick down 2% every 100ms = 5000ms total
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [showUndoToast]);

  const handleStartExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setTimerSeconds(ex.timerSeconds || 60);
    setTimerRunning(false);
  };

  const handleLogExerciseSubmit = () => {
    if (!activeExercise) return;
    
    const loggedDuration = activeExercise.hasTimer 
      ? `${activeExercise.timerSeconds || 60} seconds`
      : activeExercise.duration;

    const logId = Math.random().toString(36).substring(2, 9);
    
    // Add real date field to sync with our beautiful chart
    const newLog: LoggedActivity = {
      id: logId,
      name: activeExercise.name,
      sphere: activeExercise.sphere,
      category: activeExercise.category,
      duration: loggedDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    localStorage.setItem('activity_logs', JSON.stringify(updated));

    // Show 5-second undo toast
    setUndoTargetId(logId);
    setUndoMessage(`Successfully logged "${activeExercise.name}"`);
    setUndoProgress(100);
    setShowUndoToast(true);

    setActiveExercise(null);
    setTimerRunning(false);
  };

  const handleRepeatLastWorkout = () => {
    if (activityLogs.length === 0) return;
    const lastLog = activityLogs[0];
    const newLogId = Math.random().toString(36).substring(2, 9);
    const newLog: LoggedActivity = {
      id: newLogId,
      name: lastLog.name,
      sphere: lastLog.sphere,
      category: lastLog.category,
      duration: lastLog.duration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    localStorage.setItem('activity_logs', JSON.stringify(updated));

    setUndoTargetId(newLogId);
    setUndoMessage(`Repeated "${lastLog.name}"`);
    setUndoProgress(100);
    setShowUndoToast(true);
  };

  const handleManualLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newLogId = Math.random().toString(36).substring(2, 9);
    const newLog: LoggedActivity = {
      id: newLogId,
      name: manualName.trim(),
      sphere: manualSphere,
      category: manualCategory,
      duration: manualDuration.trim() || '15 mins',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newLog, ...activityLogs];
    setActivityLogs(updated);
    localStorage.setItem('activity_logs', JSON.stringify(updated));

    setUndoTargetId(newLogId);
    setUndoMessage(`Logged custom workout "${manualName}"`);
    setUndoProgress(100);
    setShowUndoToast(true);

    setShowManualLog(false);
    setManualName('');
    setManualDuration('15 mins');
  };

  const handleUndo = () => {
    if (!undoTargetId) return;

    const updated = activityLogs.filter(log => log.id !== undoTargetId);
    setActivityLogs(updated);
    localStorage.setItem('activity_logs', JSON.stringify(updated));

    // Restore 7-Day Plan completion if undo targets a day's workout
    if (sevenDayPlan) {
      const updatedPlan = sevenDayPlan.map(day => {
        if (day.completedWithLogId === undoTargetId) {
          return { ...day, completed: false, completedWithLogId: undefined };
        }
        return day;
      });
      setSevenDayPlan(updatedPlan);
      localStorage.setItem('seven_day_plan', JSON.stringify(updatedPlan));
    }

    setShowUndoToast(false);
    setUndoTargetId(null);
    setSuccessToast('Workout action undone successfully.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Generate 7-Day Plan
  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setGeneratingStep(0);

    // Rotate through physiological step guidelines
    const stepInterval = setInterval(() => {
      setGeneratingStep((prev) => (prev + 1) % 4);
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);
      const isHeart = profile.healthConditions.includes('heart-condition');
      const isJoint = profile.healthConditions.includes('joint-pain');
      const isBack = profile.healthConditions.includes('back-pain');
      const isAsthma = profile.healthConditions.includes('asthma');

      const daysData = [
        {
          day: 1,
          title: 'Active Body Starter',
          description: isJoint ? 'Low-impact legs & ankles mobility stretch.' : 'Cardio starter with body squats.',
          exercises: isJoint ? ['Calf Raises', 'Glute Bridges'] : ['Wall Squats', 'Calf Raises'],
          category: 'legs',
          sphere: 'physical' as const,
          duration: '15 mins',
          completed: false
        },
        {
          day: 2,
          title: 'Upper Body Toning',
          description: isHeart ? 'Gentle shoulder circles & wall push-ups.' : 'Core control & standard chest builder.',
          exercises: isHeart ? ['Arm Circles', 'Wall Push-Ups'] : ['Standard Push-Ups', 'Plank Hold'],
          category: 'chest',
          sphere: 'physical' as const,
          duration: '12 mins',
          completed: false
        },
        {
          day: 3,
          title: 'Mid-week Breathwork',
          description: isAsthma ? 'Asthma-friendly deep lung expansion exercises.' : 'Anxiety reduction deep breathing.',
          exercises: ['Deep Belly Breathing', 'Box Breathing'],
          category: 'breathing',
          sphere: 'mental' as const,
          duration: '10 mins',
          completed: false
        },
        {
          day: 4,
          title: 'Posture & Back Support',
          description: isBack ? 'Highly recommended gentle spine alignment.' : 'Spine stretches and core stability.',
          exercises: ['Cat-Cow Stretch', 'Bird-Dog Hold'],
          category: 'back',
          sphere: 'physical' as const,
          duration: '12 mins',
          completed: false
        },
        {
          day: 5,
          title: 'Mind & Body Harmony',
          description: 'Guided mindfulness meditation and calmness.',
          exercises: ['Mindfulness Meditation', 'Calming Ocean Sounds'],
          category: 'meditation',
          sphere: 'mental' as const,
          duration: '15 mins',
          completed: false
        },
        {
          day: 6,
          title: 'Stamina & Energy Activation',
          description: isJoint ? 'Knee-safe glutes & posture support.' : 'Moderate full body bodyweight conditioning.',
          exercises: isJoint ? ['Glute Bridges', 'Bird-Dog Hold'] : ['Standard Push-Ups', 'Glute Bridges'],
          category: 'full-body',
          sphere: 'physical' as const,
          duration: '15 mins',
          completed: false
        },
        {
          day: 7,
          title: 'Deep Sleep & Total Recharge',
          description: 'Quiet the nervous system and promote peaceful rest.',
          exercises: ['Deep Sleep Meditation', 'Progressive Muscle Relaxation'],
          category: 'sleep',
          sphere: 'mental' as const,
          duration: '20 mins',
          completed: false
        }
      ];

      setSevenDayPlan(daysData);
      localStorage.setItem('seven_day_plan', JSON.stringify(daysData));
      setIsGeneratingPlan(false);
      setSuccessToast('Successfully synthesized your personalized 7-day routine!');
      setTimeout(() => setSuccessToast(''), 3000);
    }, 2800);
  };

  const handleLoadExercisePreset = (presetId: string) => {
    const preset = EXERCISE_PLAN_VARIATIONS.find(p => p.id === presetId);
    if (!preset) return;
    
    setSevenDayPlan(preset.days);
    localStorage.setItem('seven_day_plan', JSON.stringify(preset.days));
    setSuccessToast(`Swapped active routine to "${preset.name}"!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCompletePlanDay = (dayNum: number) => {
    if (!sevenDayPlan) return;
    
    const dayObj = sevenDayPlan.find(d => d.day === dayNum);
    if (!dayObj) return;

    const logId = Math.random().toString(36).substring(2, 9);
    
    const newLog: LoggedActivity = {
      id: logId,
      name: `${dayObj.title} (Day ${dayNum})`,
      sphere: dayObj.sphere,
      category: dayObj.category,
      duration: dayObj.duration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    localStorage.setItem('activity_logs', JSON.stringify(updatedLogs));

    const updatedPlan = sevenDayPlan.map(day => {
      if (day.day === dayNum) {
        return { ...day, completed: true, completedWithLogId: logId };
      }
      return day;
    });
    setSevenDayPlan(updatedPlan);
    localStorage.setItem('seven_day_plan', JSON.stringify(updatedPlan));

    // Show Undo Toast
    setUndoTargetId(logId);
    setUndoMessage(`Completed Day ${dayNum}: ${dayObj.title}`);
    setUndoProgress(100);
    setShowUndoToast(true);
  };

  const handleResetPlan = () => {
    if (confirm('Are you sure you want to reset your 7-Day Plan progress?')) {
      if (sevenDayPlan) {
        const reset = sevenDayPlan.map(day => ({ ...day, completed: false, completedWithLogId: undefined }));
        setSevenDayPlan(reset);
        localStorage.setItem('seven_day_plan', JSON.stringify(reset));
      }
    }
  };

  const handleDeletePlan = () => {
    if (confirm('Are you sure you want to delete this custom routine?')) {
      setSevenDayPlan(null);
      localStorage.removeItem('seven_day_plan');
    }
  };

  const handleSaveExercisePlan = () => {
    if (!sevenDayPlan || sevenDayPlan.length === 0) {
      alert('No active training routine exists to save!');
      return;
    }
    const name = prompt('Enter a name for this custom 7-day exercise routine:', `Routine - ${new Date().toLocaleDateString()}`);
    if (name === null) return;
    const planName = name.trim() || `Routine - ${new Date().toLocaleDateString()}`;

    const newSavedPlan = {
      id: Math.random().toString(36).substring(2, 9),
      name: planName,
      date: new Date().toLocaleDateString(),
      days: sevenDayPlan
    };

    const updated = [...savedExercisePlans, newSavedPlan];
    setSavedExercisePlans(updated);
    localStorage.setItem('saved_exercise_plans', JSON.stringify(updated));
    setSuccessToast(`Saved routine "${planName}" to history!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleRestoreSavedExercisePlan = (savedPlan: any) => {
    if (confirm(`Activate "${savedPlan.name}" as your active 7-day exercise plan? This will overwrite the current active routine.`)) {
      setSevenDayPlan(savedPlan.days);
      localStorage.setItem('seven_day_plan', JSON.stringify(savedPlan.days));
      setSuccessToast(`Activated routine: ${savedPlan.name}`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleDeleteSavedExercisePlan = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from your saved routine list?`)) {
      const updated = savedExercisePlans.filter(p => p.id !== id);
      setSavedExercisePlans(updated);
      localStorage.setItem('saved_exercise_plans', JSON.stringify(updated));
      setSuccessToast(`Deleted "${name}" from history.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // Get dynamic days for the Calories chart
  const getLast7Days = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = weekdays[d.getDay()];
      result.push({
        dateStr,
        dayName,
        calories: 0
      });
    }
    return result;
  };

  const last7DaysChartData = getLast7Days();
  activityLogs.forEach((log) => {
    const logDate = log.date || new Date().toISOString().split('T')[0];
    const match = last7DaysChartData.find((d) => d.dateStr === logDate);
    if (match) {
      match.calories += getCaloriesForCategory(log.category);
    }
  });

  const maxCalories = Math.max(...last7DaysChartData.map((d) => d.calories), 150);

  // Get list of exercises logged today
  const todayStr = new Date().toISOString().split('T')[0];
  const logsToday = activityLogs.filter((log) => (log.date || todayStr) === todayStr);

  const filteredList = getFilteredExercises();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-left">
      
      <div
        className="hero-banner-responsive"
        style={{
          position: 'relative',
          borderRadius: radii.card,
          overflow: 'hidden',
          boxShadow: shadows.card,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: spacing[24],
        }}
      >
        <img
          src="/exercise_page_hero.png"
          alt="Fitness workout banner"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors.primary}f2 0%, ${colors.primary}77 70%, transparent 100%)`,
            zIndex: 1,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, color: colors.white, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing[16], width: '100%' }}>
          <div>
            <h2
              className="hch-heading"
              style={{
                fontSize: '2rem',
                fontWeight: 750,
                color: colors.white,
                margin: 0,
              }}
            >
              Exercise at Home
            </h2>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: fontSizes.sm,
                color: 'rgba(255, 255, 255, 0.9)',
                margin: `${spacing[8]} 0 0`,
                maxWidth: '480px',
                lineHeight: 1.5,
              }}
            >
              Simple bodyweight activities and stretches you can perform safely in your own room.
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing[8] }}>
            <button
              onClick={handleRepeatLastWorkout}
              disabled={activityLogs.length === 0}
              className="hch-btn hch-btn--outline"
              style={{
                fontSize: fontSizes.xs,
                padding: '12px 20px',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: colors.white,
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: activityLogs.length === 0 ? 0.4 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              <RotateCcw size={12} />
              <span>Repeat Last Workout</span>
            </button>
            <button
              onClick={() => setShowManualLog(true)}
              className="hch-btn hch-btn--primary"
              style={{
                fontSize: fontSizes.xs,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={12} />
              <span>Manual Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC SUCCESS/UNDO NOTIFICATIONS */}
      {successToast && (
        <div style={{ background: `${colors.success}15`, border: `1px solid ${colors.success}40`, borderRadius: radii.button, padding: spacing[16], color: colors.primary, fontSize: fontSizes.xs, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
          <CheckCircle size={14} />
          <span>{successToast}</span>
        </div>
      )}

      {/* VERTICAL FLOW FOR CONTENT AND CONTROLS */}
      <div className="flex flex-col gap-8 w-full">
        
        {/* MAIN CONTENT: ACTIVE PERSONALIZATION, SPHERE SELECTOR, EXERCISES LIST */}
        <div className="space-y-6 flex flex-col justify-start">
          
          {/* TODAY'S RECOMMENDED WORKOUT CARD */}
          {(() => {
            const getRecommendedExercise = () => {
              const isJoint = profile.healthConditions.includes('joint-pain') || profile.healthConditions.includes('back-pain');
              const hasHeart = profile.healthConditions.includes('heart-condition');
              const physicalExs = EXERCISES.filter(ex => ex.sphere === 'physical');
              if (isJoint) {
                return physicalExs.find(ex => ex.category === 'back' || ex.id === 'calf-raises') || physicalExs[0];
              }
              if (hasHeart) {
                return physicalExs.find(ex => ex.difficulty === 'Beginner') || physicalExs[0];
              }
              if (profile.goal === 'lose-weight') {
                return physicalExs.find(ex => ex.id === 'wall-squats') || physicalExs[0];
              }
              if (profile.goal === 'build-muscle') {
                return physicalExs.find(ex => ex.id === 'pushups') || physicalExs[0];
              }
              return physicalExs[0];
            };

            const recommendedEx = getRecommendedExercise();

            return (
              <div
                style={{
                  background: colors.white,
                  borderRadius: radii.card,
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.success}30`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '140px', width: '100%' }}>
                  <img
                    src="/male_workout.png"
                    alt="Recommended Workout"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to bottom, transparent, rgba(38,41,31,0.6))`,
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: spacing[12], left: spacing[16] }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.white, background: colors.accent, padding: '2px 8px', borderRadius: radii.full, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Recommended For You Today
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: spacing[24], display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
                  <div>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '1.125rem', fontWeight: 700, color: colors.text, margin: 0 }}>
                      {recommendedEx.name}
                    </h3>
                    <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, marginTop: spacing[4], margin: 0 }}>
                      Based on your goal to **{getGoalLabel(profile.goal)}** and active safeguards ({profile.healthConditions.length > 0 ? profile.healthConditions.map(c => c.split('-').join(' ')).join(', ') : 'None'}).
                    </p>
                    <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.text, marginTop: spacing[12], lineHeight: 1.5, margin: 0 }}>
                      {recommendedEx.description}
                    </p>
                  </div>

                  <button
                    id="start-recommended-btn"
                    onClick={() => handleStartExercise(recommendedEx)}
                    className="hch-btn hch-btn--primary"
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: fontSizes.xs,
                      padding: '12px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Start Recommended Workout ({recommendedEx.duration})</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* MAIN TABS SELECTOR (THREE WAY TOGGLE) */}
          <div className="flex bg-bg-card p-1 rounded-xl border border-white/[0.06] w-full">
            <button
              onClick={() => handleTabChange('physical')}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'physical'
                  ? 'bg-purple-600 text-purple-50 shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline'
              }`}
            >
              <span>💪</span>
              <span className="hidden sm:inline">Body Exercises</span>
              <span className="sm:hidden">Body</span>
            </button>
            <button
              onClick={() => handleTabChange('mental')}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'mental'
                  ? 'bg-purple-600 text-purple-50 shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline'
              }`}
            >
              <span>🧘</span>
              <span className="hidden sm:inline">Mind & Relaxation</span>
              <span className="sm:hidden">Mind</span>
            </button>
            <button
              onClick={() => handleTabChange('plan')}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'plan'
                  ? 'bg-purple-600 text-purple-50 shadow-md shadow-purple-500/20'
                  : 'text-text-body hover:text-text-headline'
              }`}
            >
              <span>📅</span>
              <span>7-Day Plan</span>
            </button>
          </div>

          {/* TAB 1: BODY EXERCISES & TAB 2: MIND & RELAXATION */}
          {(activeTab === 'physical' || activeTab === 'mental') && (
            <div className="space-y-6">
              {/* HEALTH RESTRICTION SECURITY LOGS (IF PRESENT) */}
              {profile.healthConditions.includes('heart-condition') && activeTab === 'physical' && (
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3 text-left">
                    <Shield className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-text-headline">Heart Condition Security Lock</h4>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        Workouts have been restricted to safe <span className="text-text-gold font-bold">Beginner</span> difficulty only.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setBypassHeartRestriction(!bypassHeartRestriction)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold font-mono transition ${
                      bypassHeartRestriction
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-indigo-500 text-bg-deep'
                    }`}
                  >
                    {bypassHeartRestriction ? '🛡️ Re-lock restrictions' : '🔓 Unlock (if cleared by doctor)'}
                  </button>
                </div>
              )}

              {profile.healthConditions.includes('joint-pain') && activeTab === 'physical' && (
                <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start space-x-3 text-left">
                  <AlertTriangle className="w-4.5 h-4.5 text-yellow-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-text-body">
                    ⚠️ Low-impact workouts only. Jump-based activities (Jump squats, burpees, high knees) are hidden due to <span className="text-text-gold font-bold">Knee/Joint Pain</span>.
                  </p>
                </div>
              )}

              {/* DIFFICULTY FILTER CONTROLS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', gap: spacing[16], borderTop: `1px solid ${colors.success}30`, borderBottom: `1px solid ${colors.success}30`, padding: `${spacing[16]} 0`, textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: '0.875rem', fontWeight: 700, color: colors.text, margin: 0 }}>Difficulty Level</h4>
                  <p style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, margin: 0 }}>Select a skill tier matching your endurance.</p>
                </div>
                
                <div style={{ display: 'flex', gap: spacing[8] }}>
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                    const isHeartRestricted = profile.healthConditions.includes('heart-condition') && !bypassHeartRestriction && activeTab === 'physical';
                    const isDisabled = isHeartRestricted && diff !== 'Beginner';
                    
                    const isActive = selectedDifficulty === diff;
                    
                    return (
                      <button
                        key={diff}
                        disabled={isDisabled}
                        onClick={() => setSelectedDifficulty(diff)}
                        style={{
                          padding: `6px ${spacing[12]}`,
                          borderRadius: radii.button,
                          border: isActive ? `1.5px solid ${colors.primary}` : `1px solid ${colors.success}40`,
                          background: isActive ? colors.primary : colors.white,
                          color: isActive ? colors.white : colors.text,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.35 : 1,
                          fontSize: '0.6875rem',
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          transition: 'all 0.2s',
                        }}
                        title={isDisabled ? 'Locked for safety (Heart Condition)' : ''}
                      >
                        <span>{diff.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HORIZONTAL CATEGORY PILLS */}
              <div style={{ display: 'flex', gap: spacing[8], overflowX: 'auto', paddingBottom: spacing[4] }} className="no-scrollbar">
                {getCategoriesList().map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: `6px ${spacing[16]}`,
                        borderRadius: radii.full,
                        border: isActive ? `1.5px solid ${colors.primary}` : `1px solid ${colors.success}40`,
                        background: isActive ? colors.primary : colors.white,
                        color: isActive ? colors.white : colors.muted,
                        cursor: 'pointer',
                        fontSize: '0.6875rem',
                        fontFamily: fonts.body,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* GROUPED EXERCISE SECTIONS */}
              {filteredList.length === 0 ? (
                <div style={{ background: colors.white, padding: spacing[24], borderRadius: radii.card, textAlign: 'center', border: `1px solid ${colors.success}30` }}>
                  <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, margin: 0 }}>No matching exercises available in this category.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[32] }}>
                  {(() => {
                    const categoriesInActiveTab = activeTab === 'physical'
                      ? ['legs', 'arms', 'core', 'back', 'chest', 'full-body']
                      : ['breathing', 'meditation', 'sleep', 'stress', 'energy'];

                    return categoriesInActiveTab.map(cat => {
                      const exercisesInCat = filteredList.filter(ex => ex.category === cat);
                      if (exercisesInCat.length === 0) return null;

                      let catFriendlyName = cat.charAt(0).toUpperCase() + cat.slice(1);
                      if (cat === 'legs') catFriendlyName = 'Leg Exercises';
                      else if (cat === 'arms') catFriendlyName = 'Arm Workouts';
                      else if (cat === 'core') catFriendlyName = 'Core & Abs';
                      else if (cat === 'back') catFriendlyName = 'Back & Posture';
                      else if (cat === 'chest') catFriendlyName = 'Chest Exercises';
                      else if (cat === 'full-body') catFriendlyName = 'Full Body Conditioning';
                      else if (cat === 'breathing') catFriendlyName = 'Breathing Stretches';
                      else if (cat === 'meditation') catFriendlyName = 'Mindfulness & Meditation';
                      else if (cat === 'sleep') catFriendlyName = 'Sleep Stretches';
                      else if (cat === 'stress') catFriendlyName = 'Stress Relief Stretches';
                      else if (cat === 'energy') catFriendlyName = 'Energy Builders';

                      return (
                        <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
                          <h3 style={{ fontFamily: fonts.heading, fontSize: '1rem', fontWeight: 700, color: colors.text, margin: 0, borderBottom: `1.5px solid ${colors.success}40`, paddingBottom: spacing[8] }}>
                            {catFriendlyName}
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing[24] }}>
                            {exercisesInCat.map((ex) => {
                              const showBackPainWarning = profile.healthConditions.includes('back-pain') && ex.isHeavyLift;
                              const showAsthmaWarning = profile.healthConditions.includes('asthma') && ex.category === 'full-body';
                              const isStrechForBack = profile.healthConditions.includes('back-pain') && ex.category === 'back';
                              const isBreathingForAsthma = profile.healthConditions.includes('asthma') && ex.category === 'breathing';

                              // Unique Card Image Mapping
                              let cardImg = ex.image;

                              return (
                                <div
                                  key={ex.id}
                                  style={{
                                    background: colors.white,
                                    borderRadius: radii.card,
                                    boxShadow: shadows.card,
                                    overflow: 'hidden',
                                    border: `1px solid ${colors.success}30`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                  <div>
                                    <div style={{ height: '120px', position: 'relative' }}>
                                      <img
                                        src={cardImg}
                                        alt={ex.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                      <div style={{
                                        position: 'absolute',
                                        top: spacing[8],
                                        right: spacing[8],
                                        background: colors.primary,
                                        color: colors.white,
                                        padding: '2px 8px',
                                        borderRadius: radii.button,
                                        fontSize: '0.625rem',
                                        fontWeight: 700,
                                      }}>
                                        {ex.difficulty}
                                      </div>
                                    </div>

                                    <div style={{ padding: spacing[16] }}>
                                      <h4 style={{ fontFamily: fonts.heading, fontSize: '0.9375rem', fontWeight: 700, color: colors.text, margin: 0, display: 'flex', flexWrap: 'wrap', gap: spacing[4], alignItems: 'center' }}>
                                        <span>{ex.name}</span>
                                        {isStrechForBack && (
                                          <span style={{ fontSize: '0.5625rem', background: `${colors.success}20`, color: colors.primary, padding: '1px 6px', borderRadius: radii.full, fontWeight: 700 }}>
                                            Safe Back Stretch
                                          </span>
                                        )}
                                        {isBreathingForAsthma && (
                                          <span style={{ fontSize: '0.5625rem', background: `${colors.success}20`, color: colors.primary, padding: '1px 6px', borderRadius: radii.full, fontWeight: 700 }}>
                                            Lung Friendly
                                          </span>
                                        )}
                                      </h4>

                                      <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, lineHeight: 1.5, marginTop: spacing[8], margin: 0 }}>
                                        {ex.description}
                                      </p>

                                      {showBackPainWarning && (
                                        <div style={{ background: '#fff9db', border: '1px solid #ffe066', borderRadius: radii.button, padding: spacing[8], marginTop: spacing[12], display: 'flex', gap: spacing[4], alignItems: 'flex-start' }}>
                                          <AlertTriangle size={14} style={{ color: '#f59f00', flexShrink: 0 }} />
                                          <span style={{ fontSize: '0.625rem', color: '#f59f00', fontWeight: 600 }}>Avoid curving your spine. Lift slowly.</span>
                                        </div>
                                      )}

                                      {showAsthmaWarning && (
                                        <div style={{ background: '#fff9db', border: '1px solid #ffe066', borderRadius: radii.button, padding: spacing[8], marginTop: spacing[12], display: 'flex', gap: spacing[4], alignItems: 'flex-start' }}>
                                          <AlertTriangle size={14} style={{ color: '#f59f00', flexShrink: 0 }} />
                                          <span style={{ fontSize: '0.625rem', color: '#f59f00', fontWeight: 600 }}>High stamina exercise. Keep inhaler nearby.</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div style={{ padding: `0 ${spacing[16]} ${spacing[16]}` }}>
                                    <button
                                      onClick={() => handleStartExercise(ex)}
                                      className="hch-btn hch-btn--outline"
                                      style={{ width: '100%', fontSize: fontSizes.xs, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                                    >
                                      <Clock size={12} />
                                      <span>Start Workout ({ex.duration})</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 7-DAY INTERACTIVE WORKOUT PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              
              {/* PLAN SUBTABS ACCORDING TO SCREENSHOT */}
              <div className="flex border-b border-white/[0.06] pb-1 gap-4">
                <button
                  onClick={() => setPlanSubTab('active')}
                  className={`pb-2.5 text-xs font-bold transition font-sans border-b-2 ${
                    planSubTab === 'active'
                      ? 'border-gold-primary text-gold-primary'
                      : 'border-transparent text-text-muted hover:text-text-body'
                  }`}
                >
                  Active Plan
                </button>
                <button
                  onClick={() => setPlanSubTab('past')}
                  className={`pb-2.5 text-xs font-bold transition font-sans border-b-2 ${
                    planSubTab === 'past'
                      ? 'border-gold-primary text-gold-primary'
                      : 'border-transparent text-text-muted hover:text-text-body'
                  }`}
                >
                  Past Plans
                </button>
              </div>

              {planSubTab === 'active' && (
                <div className="space-y-6">
                  {isGeneratingPlan ? (
                    /* 3D ORBIT LOADING CARD FOR EXERCISE */
                    <div className="p-8 md:p-12 rounded-2xl bg-bg-card border border-white/[0.08] shadow-deep text-center space-y-6 max-w-lg mx-auto overflow-hidden relative card-3d">
                      {/* Background radial glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-primary/5 rounded-full blur-[60px] pointer-events-none" />

                      {/* 3D Orbit Loading Stage */}
                      <div className="relative w-44 h-44 mx-auto flex items-center justify-center" style={{ perspective: '600px' }}>
                        {/* Ring X */}
                        <div className="absolute w-36 h-36 border-2 border-dashed border-gold-primary/30 rounded-full sub-ring-x flex items-center justify-center">
                          <div className="w-3 h-3 bg-gold-primary rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#F4A220]" />
                        </div>
                        {/* Ring Y */}
                        <div className="absolute w-28 h-28 border border-emerald-400/30 rounded-full sub-ring-y flex items-center justify-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-1/2 -left-1 -translate-y-1/2 shadow-[0_0_8px_#34d399]" />
                        </div>
                        {/* Central pulsing core */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-bg-surface to-bg-card border border-gold-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,162,32,0.15)] z-10 animate-pulse">
                          <Activity className="w-6 h-6 text-gold-primary" />
                        </div>
                      </div>

                      <div className="space-y-3 relative z-10">
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-widest font-mono block">
                          AI Routine Engineer
                        </span>
                        <h3 className="text-md font-extrabold text-text-headline">
                          Synthesizing Home Workouts
                        </h3>
                        <p className="text-xs text-text-gold font-mono min-h-[40px] px-4 leading-relaxed">
                          {EXERCISE_GENERATION_TIPS[generatingStep]}
                        </p>
                      </div>

                      {/* Loader progress bar simulation */}
                      <div className="w-full max-w-xs mx-auto space-y-1.5 pt-2">
                        <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: '100%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-text-muted">
                          <span>PHYSIOLOGY ENGINE</span>
                          <span className="animate-pulse">BUILDING PLAN...</span>
                        </div>
                      </div>
                    </div>
                  ) : !sevenDayPlan ? (
                    /* EMPTY STATE GENERATOR BLOCK */
                    <div className="p-8 rounded-2xl bg-bg-card border border-white/[0.06] text-center space-y-5 shadow-deep">
                      <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary mx-auto">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-md font-extrabold text-text-headline font-sans uppercase tracking-wider">
                          Get Your 7-Day Exercise Plan
                        </h3>
                        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                          Get a fully personalized training routine mixing cardio, strength, and breathing exercises adjusted for your health conditions.
                        </p>
                      </div>
                      <button
                        onClick={handleGeneratePlan}
                        className="py-3 px-6 btn-3d-gold rounded-xl text-xs font-extrabold shadow-md inline-block uppercase tracking-wider"
                      >
                        Generate My 7-Day Routine
                      </button>
                    </div>
                  ) : (
                    /* GENERATED 7-DAY WORKOUT LISTING */
                    <div className="space-y-5 animate-fade-in">
                      
                      {/* Workout Presets Catalog Switcher */}
                      <div className="p-4 rounded-2xl bg-bg-card border border-white/[0.06] space-y-3 shadow-md">
                        <div className="flex items-center space-x-1.5 text-text-headline">
                          <Activity className="w-4 h-4 text-gold-primary" />
                          <span className="text-xs font-extrabold uppercase tracking-wider font-sans">Active Training Track</span>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          Choose a pre-designed, ready-made training program tailored to your goals. You can hot-swap at any time!
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {EXERCISE_PLAN_VARIATIONS.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => {
                                setSelectedExercisePresetId(preset.id);
                                handleLoadExercisePreset(preset.id);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                selectedExercisePresetId === preset.id
                                  ? 'border-gold-primary bg-gold-primary/[0.02] text-text-headline'
                                  : 'border-white/[0.04] bg-bg-surface hover:border-white/10 text-text-muted hover:text-text-headline'
                              }`}
                            >
                              <div style={{ width: '100%', height: '60px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                                <img src={preset.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wide ${
                                  selectedExercisePresetId === preset.id
                                    ? 'bg-gold-primary/20 text-text-gold'
                                    : 'bg-white/[0.05] text-text-muted'
                                }`}>
                                  {preset.tag}
                                </span>
                                {selectedExercisePresetId === preset.id && <Check className="w-3 h-3 text-gold-primary" />}
                              </div>
                              <h5 className="text-[11px] font-extrabold tracking-tight block">{preset.name}</h5>
                              <span className="text-[9px] text-text-muted block mt-0.5 font-mono">7 Days Program</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white/[0.01] p-3 rounded-lg border border-white/[0.04]">
                        <span className="text-[10px] font-mono text-text-muted uppercase">
                          Progress target: 7 Days Challenge
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={handleSaveExercisePlan}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 font-mono"
                          >
                            Save Routine
                          </button>
                          <span className="text-[10px] text-white/[0.1]">|</span>
                          <button
                            onClick={handleResetPlan}
                            className="text-[10px] font-bold text-text-gold hover:text-gold-light font-mono"
                          >
                            Reset Progress
                          </button>
                          <span className="text-[10px] text-white/[0.1]">|</span>
                          <button
                            onClick={handleDeletePlan}
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 font-mono"
                          >
                            Delete Plan
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {sevenDayPlan.map((day) => (
                          <div 
                            key={day.day}
                            className={`p-4 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              day.completed 
                                ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70' 
                                : 'bg-bg-card border-white/[0.06] hover:border-white/[0.1]'
                            }`}
                          >
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-[9px] font-bold font-mono text-text-gold">
                                  DAY {day.day}
                                </span>
                                <span className="text-xs text-text-muted font-mono">{day.duration}</span>
                                {day.completed && (
                                  <span className="text-emerald-400 text-[10px] font-bold font-mono uppercase flex items-center">
                                    <Check className="w-3 h-3 mr-1" /> COMPLETED
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-text-headline">{day.title}</h4>
                              <p className="text-xs text-text-muted leading-relaxed max-w-xl">{day.description}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {day.exercises.map((exName: string, i: number) => (
                                  <span key={i} className="text-[9px] font-mono bg-white/[0.02] border border-white/[0.04] text-text-body px-2 py-0.5 rounded">
                                    {exName}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center">
                              {day.completed ? (
                                <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleCompletePlanDay(day.day)}
                                  className="w-full sm:w-auto py-1.5 px-4 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.08] hover:border-gold-primary rounded-lg text-xs font-bold transition whitespace-nowrap"
                                >
                                  Complete Workout
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {planSubTab === 'past' && (
                <div className="space-y-4">
                  {savedExercisePlans.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: spacing[24], background: '#FAF7F2', border: `1.5px dashed ${colors.success}50`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                      <Calendar className="w-8 h-8" style={{ color: colors.muted }} />
                      <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.text }}>No saved workouts in your history yet. Archive your active routine to see it here.</span>
                      <button
                        onClick={handleSaveExercisePlan}
                        className="hch-btn hch-btn--primary"
                        style={{ fontSize: fontSizes.xs, padding: '12px 20px', whiteSpace: 'nowrap' }}
                      >
                        Save Current Workout Program
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedExercisePlans.map((plan) => (
                        <div 
                          key={plan.id}
                          className="p-4 rounded-xl bg-bg-card border border-white/[0.04] hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                        >
                          <div className="space-y-1 text-left">
                            <h4 className="text-xs font-bold text-text-headline">{plan.name}</h4>
                            <span className="text-[10px] text-text-muted font-mono block">Saved: {plan.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleRestoreSavedExercisePlan(plan)}
                              className="py-1 px-3 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Load Plan</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSavedExercisePlan(plan.id, plan.name)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/10 transition"
                              title="Delete plan from archive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* BOTTOM FULL-WIDTH SECTIONS: SAFEGUARDS, MATCHER, REST TIMER, LOGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start w-full pt-8 border-t border-white/[0.06]">
          
          {/* INTERACTIVE BODY MAP CARD */}
          <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col space-y-4">
            <div style={{ width: '100%', height: '80px', borderRadius: radii.card, overflow: 'hidden' }}>
              <img src={mediaMap.tool_joint_filter} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block">Pain Safeguards Map</span>
              <h3 className="text-md font-bold text-text-headline mt-0.5">Filter Workouts by Joint Pain</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Click glowing joints to instantly filter out strain-heavy exercises.
              </p>
            </div>

            <div className="flex flex-col items-center bg-bg-deep/45 border border-white/[0.04] p-3 rounded-xl relative">
              <svg viewBox="0 0 120 220" className="w-28 h-48 select-none">
                {/* Silhouette outline */}
                <path
                  d="M60,20 C64,20 67,23 67,28 C67,33 64,36 60,36 C56,36 53,33 53,28 C53,23 56,20 60,20 Z 
                     M60,37 C54,37 47,43 45,55 L43,90 C42,95 45,98 48,96 L51,94 L51,140 L44,200 C43,205 47,208 50,205 L60,155 L70,205 C73,208 77,205 76,200 L69,140 L69,94 L72,96 C75,98 78,95 77,90 L75,55 C73,43 66,37 60,37 Z"
                  className="fill-white/[0.04] stroke-white/20 stroke-[1.5]"
                />
                
                {/* Neck -> high-blood-pressure */}
                <g className="cursor-pointer group" onClick={() => toggleHealthCondition('high-blood-pressure')}>
                  <circle cx="60" cy="45" r="9" className={`transition fill-purple-500/10 ${profile.healthConditions.includes('high-blood-pressure') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                  <circle cx="60" cy="45" r="4.5" className={`stroke-2 transition-all ${profile.healthConditions.includes('high-blood-pressure') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                </g>

                {/* Heart -> heart-condition */}
                <g className="cursor-pointer group" onClick={() => toggleHealthCondition('heart-condition')}>
                  <circle cx="60" cy="65" r="10" className={`transition fill-purple-500/10 ${profile.healthConditions.includes('heart-condition') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                  <circle cx="60" cy="65" r="4.5" className={`stroke-2 transition-all ${profile.healthConditions.includes('heart-condition') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                </g>

                {/* Back -> back-pain */}
                <g className="cursor-pointer group" onClick={() => toggleHealthCondition('back-pain')}>
                  <circle cx="60" cy="98" r="11" className={`transition fill-purple-500/10 ${profile.healthConditions.includes('back-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                  <circle cx="60" cy="98" r="4.5" className={`stroke-2 transition-all ${profile.healthConditions.includes('back-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                </g>

                {/* Left Knee -> joint-pain */}
                <g className="cursor-pointer group" onClick={() => toggleHealthCondition('joint-pain')}>
                  <circle cx="51" cy="155" r="10" className={`transition fill-purple-500/10 ${profile.healthConditions.includes('joint-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                  <circle cx="51" cy="155" r="4" className={`stroke-2 transition-all ${profile.healthConditions.includes('joint-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                </g>

                {/* Right Knee -> joint-pain */}
                <g className="cursor-pointer group" onClick={() => toggleHealthCondition('joint-pain')}>
                  <circle cx="69" cy="155" r="10" className={`transition fill-purple-500/10 ${profile.healthConditions.includes('joint-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                  <circle cx="69" cy="155" r="4" className={`stroke-2 transition-all ${profile.healthConditions.includes('joint-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                </g>
              </svg>

              <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
                {[
                  { id: 'high-blood-pressure', label: 'Neck' },
                  { id: 'heart-condition', label: 'Chest' },
                  { id: 'back-pain', label: 'Back' },
                  { id: 'joint-pain', label: 'Knees' }
                ].map(item => {
                  const active = profile.healthConditions.includes(item.id);
                  return (
                    <span 
                      key={item.id} 
                      className={`text-[8px] px-2 py-0.5 rounded font-mono font-bold transition-all uppercase ${
                        active 
                          ? 'bg-purple-500/25 text-purple-300 border border-purple-500/35' 
                          : 'bg-white/[0.02] text-text-muted border border-white/[0.04]'
                      }`}
                    >
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CALORIE BURN MATCHER (WORKOUT SWAPPER) */}
          <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col space-y-4">
            <div style={{ width: '100%', height: '80px', borderRadius: radii.card, overflow: 'hidden' }}>
              <img src={mediaMap.tool_burn_matcher} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-text-gold uppercase tracking-widest font-mono block">Workout Swapper</span>
              <h3 className="text-md font-bold text-text-headline mt-0.5">Calorie Burn Matcher</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                See exactly how much exercise is needed to burn off traditional Pakistani foods.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1.5 font-mono">Select Food Item</label>
                <select
                  value={selectedBurnFood}
                  onChange={(e) => setSelectedBurnFood(e.target.value)}
                  className="w-full bg-bg-surface border border-white/[0.06] focus:border-purple-500/30 outline-none rounded-lg p-2.5 text-xs text-text-headline font-semibold cursor-pointer"
                >
                  <option value="chai">🍵 Cardamom Sweet Chai (150 kcal)</option>
                  <option value="roti">🫓 Whole-Wheat Roti (120 kcal)</option>
                  <option value="samosa">📐 Crispy Potato Samosa (260 kcal)</option>
                  <option value="paratha">🥞 Desi Ghee Paratha (320 kcal)</option>
                  <option value="gulab">🔴 Sweet Gulab Jamun (180 kcal)</option>
                  <option value="biryani">🍚 Chicken Biryani Plate (550 kcal)</option>
                </select>
              </div>

              {/* Workout equivalence results grid */}
              <div className="bg-bg-deep/45 border border-white/[0.04] p-3 rounded-xl space-y-2.5">
                <div className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider border-b border-white/[0.04] pb-1.5 flex justify-between">
                  <span>To burn {getBurnFoodCalories()} kcal:</span>
                  <span>Equivalence</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-body">🚶 Brisk Walking</span>
                    <span className="font-bold text-text-headline font-mono whitespace-nowrap shrink-0">{Math.round(getBurnFoodCalories() / 5)} mins</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-body">🦵 Body Squats</span>
                    <span className="font-bold text-text-headline font-mono whitespace-nowrap shrink-0">{Math.round(getBurnFoodCalories() / 10)} mins</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-body">🧘 Soothing Yoga</span>
                    <span className="font-bold text-text-headline font-mono whitespace-nowrap shrink-0">{Math.round(getBurnFoodCalories() / 3)} mins</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-body">🏃 High Knees Cardio</span>
                    <span className="font-bold text-text-headline font-mono whitespace-nowrap shrink-0">{Math.round(getBurnFoodCalories() / 12)} mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE REST INTERVAL TIMER */}
          <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col space-y-5 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-text-gold font-bold text-xs uppercase tracking-wider font-mono">
              <Timer className="w-4 h-4 text-gold-primary" />
              <span>Active Rest Interval Timer</span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 relative">
              <div 
                className="relative w-32 h-32 flex items-center justify-center"
                style={{ minWidth: '120px', minHeight: '120px', flexShrink: 0 }}
              >
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-white/[0.04]"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-gold-primary transition-all duration-1000 ease-linear"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={(2 * Math.PI * 54) * (1 - restSeconds / restMaxSeconds)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-mono text-text-headline">{restSeconds}</span>
                  <span className="text-[9px] text-text-muted font-mono uppercase tracking-widest whitespace-nowrap">Seconds</span>
                </div>
              </div>

              {/* Countdown controls */}
              <div className="flex space-x-3 mt-5">
                <button
                  onClick={() => {
                    setRestSeconds(restMaxSeconds);
                    setRestRunning(false);
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.1] text-text-body transition"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRestRunning(!restRunning)}
                  className="py-2 px-6 bg-gold-primary hover:bg-gold-light text-bg-deep rounded-xl font-bold text-xs transition active:scale-95 shadow-md flex items-center space-x-1"
                >
                  {restRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{restRunning ? 'Pause' : 'Start'}</span>
                </button>
              </div>
            </div>

            {/* Quick selectors pills list */}
            <div className="grid grid-cols-4 gap-1.5">
              {[30, 45, 60, 90].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setRestMaxSeconds(sec);
                    setRestSeconds(sec);
                    setRestRunning(false);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-bold font-mono transition border ${
                    restMaxSeconds === sec
                      ? 'bg-gold-primary/10 border-gold-primary text-gold-primary'
                      : 'bg-bg-surface border-white/[0.04] text-text-muted hover:border-white/[0.08] hover:text-text-body'
                  }`}
                >
                  {sec}s select
                </button>
              ))}
            </div>
          </div>

          {/* COMPLETED LOGS TODAY LIST */}
          <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] shadow-card flex flex-col space-y-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono text-left block">
              Completed Logs Today
            </span>

            {logsToday.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing[16], background: '#FAF7F2', border: `1.5px dashed ${colors.success}30`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[8], alignItems: 'center' }}>
                <span style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted }}>You haven't logged any exercises yet today. Let's get active!</span>
                <button
                  onClick={() => {
                    const recBtn = document.getElementById('start-recommended-btn');
                    if (recBtn) {
                      recBtn.click();
                    } else {
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                  }}
                  className="hch-btn hch-btn--primary"
                  style={{ fontSize: fontSizes.xs, padding: '12px 20px', whiteSpace: 'nowrap' }}
                >
                  Start Recommended Workout
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar pr-1">
                {logsToday.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] flex items-center justify-between gap-3 min-w-0"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <div className="w-5 h-5 rounded-full bg-gold-primary/10 flex items-center justify-center text-[10px] shrink-0 text-gold-primary">
                        ✓
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-xs font-bold text-text-headline block truncate">
                          {log.name}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider block truncate">
                          {log.category} · {log.duration}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-text-gold font-mono whitespace-nowrap shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DETAILED DIALOG: WORKOUT IN PROGRESS COUNTDOWN AND INSTRUCTIONS */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/85 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-xl bg-bg-surface border border-white/[0.08] shadow-deep flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div>
                  <h3 className="text-md font-bold text-text-headline">{activeExercise.name}</h3>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    {activeTab === 'physical' ? 'Physical Exercise' : 'Mental Relaxation'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveExercise(null)}
                  className="text-text-muted hover:text-text-headline text-lg font-mono"
                >
                  ×
                </button>
              </div>

              {/* Countdown Timer Widget inside in-progress details view */}
              {activeExercise.hasTimer && (
                <div className="flex flex-col items-center justify-center py-6 bg-bg-card border border-white/[0.04] rounded-xl mb-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        className="stroke-current text-white/[0.04]"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        className="stroke-current text-gold-primary"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={263.8}
                        strokeDashoffset={263.8 - (263.8 * timerSeconds) / (activeExercise.timerSeconds || 60)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-3xl font-bold font-mono text-text-headline">
                      {timerSeconds}s
                    </span>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="px-4 py-1.5 bg-gold-primary text-bg-deep font-bold text-xs rounded-lg hover:bg-gold-light transition flex items-center space-x-1"
                    >
                      {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{timerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTimerSeconds(activeExercise.timerSeconds || 60);
                        setTimerRunning(false);
                      }}
                      className="px-4 py-1.5 border border-white/[0.08] text-text-body hover:bg-white/[0.02] text-xs rounded-lg transition flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Cardio Heart Rate Zone Ticker */}
                  <div className="w-full max-w-[280px] mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="animate-ping absolute inline-flex h-4.5 w-4.5 rounded-full bg-rose-500 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Heart Rate</span>
                        <span className="text-md font-extrabold font-mono text-rose-400 tracking-tight">{heartRate} <span className="text-[9px] text-text-body font-normal font-sans">bpm</span></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Zone</span>
                      <span className="text-[11px] font-bold text-text-headline uppercase font-sans">
                        {heartRate <= 75 && 'Resting'}
                        {heartRate > 75 && heartRate <= 100 && 'Warm Up 🧘'}
                        {heartRate > 100 && heartRate <= 125 && 'Fat Burn 🔥'}
                        {heartRate > 125 && heartRate <= 145 && 'Cardio Aerobic 💪'}
                        {heartRate > 145 && 'Peak Endurance ⚡'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Exercise instructions step guides */}
              <div className="space-y-3 mb-6">
                <span className="text-[10px] font-bold text-text-gold uppercase tracking-wider font-mono">Instructions</span>
                <ol className="list-decimal list-inside space-y-2 text-xs text-text-body pl-1">
                  {activeExercise.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {inst}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* In-progress actions */}
            <div className="flex space-x-3 pt-4 border-t border-white/[0.06] mt-4">
              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="w-1/3 py-2.5 rounded-lg text-xs font-bold text-text-body bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition animate-pulse"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogExerciseSubmit}
                className="w-2/3 py-2.5 rounded-lg text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light transition flex items-center justify-center space-x-1.5 active:scale-95 shadow-md"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Log Exercise Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG DETAILED POPUP: MANUAL WORKOUT LOG FORM */}
      {showManualLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-bg-surface border border-white/[0.08] shadow-deep space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-md font-bold text-text-headline flex items-center">
                <PlusCircle className="w-4.5 h-4.5 text-gold-primary mr-2" />
                <span>Manual Workout Log Entry</span>
              </h3>
              <button
                onClick={() => setShowManualLog(false)}
                className="text-text-muted hover:text-text-headline text-xl leading-none font-mono"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleManualLogSubmit} className="space-y-4">
              {/* Workout name */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
                  Workout / Activity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Jog, Cardio HIIT, Treadmill"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-xl p-3 text-sm text-text-headline placeholder-text-muted"
                />
              </div>

              {/* Sphere and Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
                    Activity Sphere
                  </label>
                  <select
                    value={manualSphere}
                    onChange={(e) => setManualSphere(e.target.value as 'physical' | 'mental')}
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-xl p-3 text-sm text-text-headline font-mono"
                  >
                    <option value="physical">💪 Physical</option>
                    <option value="mental">🧘 Mental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
                    Sub-Category
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-xl p-3 text-sm text-text-headline font-mono"
                  >
                    {manualSphere === 'physical' ? (
                      <>
                        <option value="legs">Legs</option>
                        <option value="arms">Arms</option>
                        <option value="chest">Chest</option>
                        <option value="back">Back</option>
                        <option value="core">Core</option>
                        <option value="full-body">Full Body</option>
                      </>
                    ) : (
                      <>
                        <option value="breathing">Breathing</option>
                        <option value="meditation">Meditation</option>
                        <option value="sleep">Sleep</option>
                        <option value="stress">Stress</option>
                        <option value="energy">Energy</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Estimated duration */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 font-mono">
                  Duration (e.g. minutes / sets)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 mins, 3 sets"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none rounded-xl p-3 text-sm text-text-headline placeholder-text-muted"
                />
              </div>

              {/* Form submit footer */}
              <div className="flex space-x-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowManualLog(false)}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-text-body bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light transition shadow-md"
                >
                  Confirm Log workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WEEKLY ENERGY BURNED CHART (Below the fold) */}
      <div
        style={{
          background: colors.white,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          padding: spacing[24],
          border: `1px solid ${colors.success}30`,
          marginTop: spacing[32],
        }}
      >
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[24] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
            <TrendingUp size={16} style={{ color: colors.primary }} />
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Weekly Energy Burned (kcal)
            </span>
          </div>
          <span style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted }}>
            Last 7 Days Challenge
          </span>
        </div>

        <div style={{ position: 'relative', height: '140px', display: 'flex', flexDirection: 'row' }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: `0 0 0 32px`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
            <div style={{ borderTop: `1px dashed ${colors.success}30`, width: '100%' }} />
            <div style={{ borderBottom: `1.5px solid ${colors.success}60`, width: '100%' }} />
          </div>

          {/* Y Axis Labels */}
          <div style={{ width: '32px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.625rem', fontFamily: fonts.body, color: colors.muted, textAlign: 'right', paddingRight: spacing[8] }}>
            <span>{maxCalories}</span>
            <span>0</span>
          </div>

          {/* Graphical Bars */}
          <div style={{ flexGrow: 1, height: '120px', display: 'flex', justifyContent: 'space-around', alignItems: 'end' }}>
            {last7DaysChartData.map((day, idx) => {
              const heightPercent = day.calories > 0 ? Math.max(8, (day.calories / maxCalories) * 100) : 0;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', position: 'relative' }} className="group">
                  {/* Tooltip */}
                  <div style={{ position: 'absolute', bottom: '100%', marginBottom: '4px', background: colors.text, color: colors.white, fontSize: '0.625rem', padding: '2px 6px', borderRadius: radii.button, opacity: 0, pointerEvents: 'none', transition: 'opacity 0.15s' }} className="group-hover:opacity-100">
                    {day.calories} kcal
                  </div>
                  
                  {/* Bar */}
                  {day.calories > 0 ? (
                    <div 
                      style={{
                        width: '18px',
                        height: `${heightPercent}%`,
                        background: colors.primary,
                        borderRadius: `${radii.button} ${radii.button} 0 0`,
                        transition: 'all 0.4s ease',
                      }}
                    />
                  ) : (
                    <div style={{ width: '18px', height: '4px', background: `${colors.success}30`, borderRadius: radii.button }} />
                  )}
                  
                  {/* Day label */}
                  <span style={{ position: 'absolute', top: '100%', marginTop: spacing[8], fontSize: '0.625rem', color: colors.muted, fontWeight: 650 }}>
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5-SECOND FLUID UNDO TOAST NOTIFICATION */}
      {showUndoToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md bg-bg-surface border border-gold-primary/30 rounded-2xl shadow-deep p-4 space-y-3 animate-slide-up" style={{ background: colors.white, border: `1px solid ${colors.success}40` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gold-primary animate-ping" style={{ background: colors.accent }} />
              <p className="text-xs text-text-headline font-medium" style={{ color: colors.text }}>
                {undoMessage}
              </p>
            </div>
            <button
              onClick={handleUndo}
              className="px-3 py-1.5 text-white font-extrabold text-[10px] uppercase rounded-lg transition flex items-center space-x-1"
              style={{ background: colors.accent }}
            >
              <span>Undo Action</span>
            </button>
          </div>

          {/* Slipped Smooth Linear Countdown Slider Bar */}
          <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-100 ease-linear"
              style={{ width: `${undoProgress}%`, background: colors.accent }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
