/**
 * MealPlanView.tsx — Blended Wellness Meals Page
 * ═══════════════════════════════════════════════
 *
 * Visual blend:
 *   - MyFitnessPal: clean diary-style meal list, simple macro totals
 *   - Noom: green/yellow/orange color-coded food groups, encouraging copy, coach tone
 *   - Headspace: rounded shapes, calm gradients, generous whitespace, micro-animations
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserMetrics, MealPlan } from '../types';
import { PAKISTANI_FOODS_DB_EXPANDED as PAKISTANI_FOODS_DB, DIET_PLAN_VARIATIONS } from '../data/nutrition';
import { theme } from '../styles/theme';
import '../styles/design-system.css';
import {
  Sparkles,
  RefreshCw,
  ChefHat,
  Moon,
  Sun,
  Flame,
  CheckCircle,
  Search,
  Camera,
  ArrowLeftRight,
  Heart,
  BookOpen,
  Plus,
  Trash2,
  Info,
  Calendar,
  AlertCircle,
  Clock,
  ChevronRight,
  Check,
  Save,
  FolderOpen
} from 'lucide-react';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface MealPlanViewProps {
  profile: UserProfile;
  metrics: UserMetrics;
  onAddCalories: (cal: number, prot: number) => void;
}

const LOADING_TIPS = [
  "Picking fresh ingredients for your recipes… 🥬",
  "Balancing protein and fibre for your goals…",
  "Adding traditional Pakistani flavours you'll love…",
  "Almost there — plating up your personalised plan! 🍽️"
];

/* ─── Noom-style food color category helper ──────────────────────── */
const getNoomColor = (category: string): { bg: string; text: string; border: string; label: string } => {
  const cat = category.toLowerCase();
  if (cat.includes('veg') || cat.includes('fruit') || cat.includes('salad') || cat.includes('lentil') || cat.includes('daal')) {
    return { bg: '#e8f5e8', text: '#2d6a2d', border: '#c8e6c8', label: 'Go often' };
  }
  if (cat.includes('grain') || cat.includes('bread') || cat.includes('rice') || cat.includes('roti') || cat.includes('dairy') || cat.includes('yogurt')) {
    return { bg: '#fef9e7', text: '#8a6d1b', border: '#f7e3a0', label: 'Moderate' };
  }
  return { bg: '#fef0e8', text: '#8a4520', border: '#f5cfb8', label: 'Enjoy less' };
};

/* ─── Healthy recipes data ──────────────────────────────────────── */
const RECIPES = [
  {
    title: "Low-Oil Chicken Karahi",
    time: "25 mins",
    calories: "320 kcal",
    protein: "32g",
    ingredients: ["250g Chicken pieces", "3 Fresh tomatoes", "1 tsp Ginger garlic paste", "2 Green chilies", "1 tsp Oil"],
    steps: [
      "Heat one teaspoon of oil in a pan.",
      "Add ginger garlic paste. Stir well.",
      "Add chicken pieces. Cook until gold.",
      "Add tomato slices and cover.",
      "Simmer on low heat for ten minutes.",
      "Garnish with green chilies and serve."
    ]
  },
  {
    title: "High-Protein Lentil Daal Soup",
    time: "20 mins",
    calories: "180 kcal",
    protein: "10g",
    ingredients: ["1 cup Yellow split lentils", "1 Chopped onion", "1 tsp Cumin seeds", "1/2 tsp Turmeric", "1 tsp Lemon juice"],
    steps: [
      "Wash lentils. Boil with turmeric.",
      "Sauté chopped onions and cumin in light oil.",
      "Mix onion paste into boiled lentils.",
      "Simmer for five minutes.",
      "Squeeze fresh lemon juice.",
      "Serve hot with spoon."
    ]
  },
  {
    title: "Healthy Mint Lassi",
    time: "5 mins",
    calories: "110 kcal",
    protein: "5g",
    ingredients: ["1 cup Low-fat yogurt", "10 Fresh mint leaves", "1 cup Cold water", "1 pinch Salt"],
    steps: [
      "Put yogurt in a blender.",
      "Add fresh mint leaves.",
      "Add cold water.",
      "Blend for one minute.",
      "Pour into a glass.",
      "Drink to stay cool."
    ]
  },
  {
    title: "Oatmeal porridge",
    time: "10 mins",
    calories: "220 kcal",
    protein: "9g",
    ingredients: ["1/2 cup Rolled oats", "1 cup Low-fat milk", "6 Sliced almonds", "1/2 Sliced banana"],
    steps: [
      "Boil milk in a pot.",
      "Add oats. Stir gently.",
      "Cook on low heat.",
      "Pour into a bowl.",
      "Top with sliced almonds.",
      "Top with sliced banana."
    ]
  }
];

/* ─── Shared section card style ──────────────────────────────────── */
const sectionCard: React.CSSProperties = {
  background: colors.white,
  borderRadius: radii.card,
  boxShadow: shadows.card,
  padding: spacing[24],
};

const pillToggle = (isActive: boolean): React.CSSProperties => ({
  padding: `${spacing[12]} ${spacing[16]}`,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: radii.button,
  border: 'none',
  cursor: 'pointer',
  background: isActive ? colors.primary : 'transparent',
  color: isActive ? colors.white : colors.muted,
  transition: 'all 0.25s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[8],
  fontFamily: fonts.body,
  whiteSpace: 'nowrap' as const,
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: colors.background,
  border: `1.5px solid ${colors.success}40`,
  borderRadius: '12px',
  padding: spacing[12],
  fontSize: '0.8125rem',
  fontFamily: fonts.body,
  color: colors.text,
  outline: 'none',
  transition: 'border-color 0.2s',
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function MealPlanView({
  profile,
  metrics,
  onAddCalories
}: MealPlanViewProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'7day' | 'lookup' | 'photo' | 'ramadan' | 'compare'>('7day');
  const [secondaryTab, setSecondaryTab] = useState<'cooking' | 'favorites' | null>(null);

  // 7-Day Food Plan input states
  const [foodPreference, setFoodPreference] = useState('A Mix of Both Desi and Western (Recommended)');
  const [mealCount, setMealCount] = useState('4 Meals (Breakfast, Lunch, Dinner, and Snack)');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [planMode, setPlanMode] = useState<'presets' | 'ai'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fat-loss-desi');

  // Loading / notifications
  const [loading, setLoading] = useState(false);
  const [generateMode, setGenerateMode] = useState<'all' | 'single'>('all');
  const [currentGeneratingDay, setCurrentGeneratingDay] = useState<number | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [error, setError] = useState('');
  const [loggedNotification, setLoggedNotification] = useState('');

  // Meal plans
  const [mealPlans, setMealPlans] = useState<{[key: number]: MealPlan}>({});

  // Saved plans
  const [savedMealPlans, setSavedMealPlans] = useState<{id: string, name: string, date: string, days: {[key: number]: MealPlan}}[]>([]);

  // Look Up Food
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Photo Scan
  const [scanningPhoto, setScanningPhoto] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);

  // Ramadan
  const [ramadanWaterGlasses, setRamadanWaterGlasses] = useState(0);

  // Compare
  const [foodAId, setFoodAId] = useState('paratha');
  const [foodBId, setFoodBId] = useState('roti');

  const [plateComposition, setPlateComposition] = useState({ fibers: 0, protein: 0, carbs: 0 });

  const addFoodToPlate = (foodCategory: string) => {
    setPlateComposition(prev => {
      let { fibers, protein, carbs } = prev;
      const lowerCat = foodCategory.toLowerCase();
      if (lowerCat.includes('veg') || lowerCat.includes('fruit') || lowerCat.includes('salad')) {
        fibers = Math.min(100, fibers + 25);
      } else if (lowerCat.includes('meat') || lowerCat.includes('poultry') || lowerCat.includes('chicken') || lowerCat.includes('egg') || lowerCat.includes('fish') || lowerCat.includes('lentil') || lowerCat.includes('daal') || lowerCat.includes('protein')) {
        protein = Math.min(100, protein + 25);
      } else {
        carbs = Math.min(100, carbs + 25);
      }
      return { fibers, protein, carbs };
    });
  };

  const resetPlate = () => {
    setPlateComposition({ fibers: 0, protein: 0, carbs: 0 });
  };

  // Load plans, favorites, and hydration on startup
  useEffect(() => {
    const loadedPlans: {[key: number]: MealPlan} = {};
    let hasSaved = false;
    for (let day = 1; day <= 7; day++) {
      const saved = localStorage.getItem(`meal_plan_${profile.name}_day_${day}`);
      if (saved) {
        try {
          loadedPlans[day] = JSON.parse(saved);
          hasSaved = true;
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (!hasSaved) {
      const targetPresetId = 
        profile.goal === 'lose-weight' ? 'fat-loss-desi' :
        profile.goal === 'build-muscle' ? 'lean-muscle' :
        profile.goal === 'stay-healthy' ? 'heart-healthy' : 'diabetes-safe';
        
      const matchedPreset = DIET_PLAN_VARIATIONS.find(v => v.id === targetPresetId) || DIET_PLAN_VARIATIONS[0];
      for (let day = 1; day <= 7; day++) {
        const meal = matchedPreset.days[day];
        if (meal) {
          loadedPlans[day] = meal;
          localStorage.setItem(`meal_plan_${profile.name}_day_${day}`, JSON.stringify(meal));
        }
      }
    }
    setMealPlans(loadedPlans);

    const savedFavs = localStorage.getItem(`favorites_${profile.name}`);
    if (savedFavs) {
      try { setFavoriteIds(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedWater = localStorage.getItem(`ramadan_water_${profile.name}`);
    if (savedWater) { setRamadanWaterGlasses(parseInt(savedWater, 10)); }

    const savedPlansRaw = localStorage.getItem(`saved_meal_plans_${profile.name}`);
    if (savedPlansRaw) {
      try { setSavedMealPlans(JSON.parse(savedPlansRaw)); } catch (e) { console.error(e); }
    }
  }, [profile.name]);

  // Cycle loading tips
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const generatePlanForDay = async (dayNum: number) => {
    setLoading(true);
    setError('');
    setTipIndex(0);
    setCurrentGeneratingDay(dayNum);

    const isRamadanSelected = mealCount.includes('Ramadan');

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, metrics, isRamadan: isRamadanSelected, foodPrefOverride: foodPreference, mealCount: mealCount, day: dayNum })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate meal plan.');

      if (data.mealPlan) {
        const updatedPlans = { ...mealPlans, [dayNum]: data.mealPlan };
        setMealPlans(updatedPlans);
        localStorage.setItem(`meal_plan_${profile.name}_day_${dayNum}`, JSON.stringify(data.mealPlan));
        showLogToast(`Day ${dayNum} recipes are ready — enjoy! 🎉`);
      } else {
        throw new Error('No meal plan returned from server.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setCurrentGeneratingDay(null);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setTipIndex(0);

    const isRamadanSelected = mealCount.includes('Ramadan');

    if (generateMode === 'single') {
      await generatePlanForDay(activeDay);
    } else {
      const tempPlans = { ...mealPlans };
      try {
        for (let d = 1; d <= 7; d++) {
          setCurrentGeneratingDay(d);
          const response = await fetch('/api/generate-meal-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, metrics, isRamadan: isRamadanSelected, foodPrefOverride: foodPreference, mealCount: mealCount, day: d })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || `Failed to generate meal plan for Day ${d}.`);

          if (data.mealPlan) {
            tempPlans[d] = data.mealPlan;
            setMealPlans({ ...tempPlans });
            localStorage.setItem(`meal_plan_${profile.name}_day_${d}`, JSON.stringify(data.mealPlan));
          } else {
            throw new Error(`No meal plan returned for Day ${d}.`);
          }
        }
        showLogToast('Your full week is ready! 🎉');
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
        setCurrentGeneratingDay(null);
      }
    }
  };

  const handleLogMealCalories = (mealName: string, calories: number, protein: number) => {
    onAddCalories(calories, protein);
    showLogToast(`Nice! Logged ${calories} kcal and ${protein}g protein 👏`);
  };

  const showLogToast = (msg: string) => {
    setLoggedNotification(msg);
    setTimeout(() => setLoggedNotification(''), 3000);
  };

  const toggleFavorite = (foodId: string) => {
    let updated: string[];
    if (favoriteIds.includes(foodId)) {
      updated = favoriteIds.filter(id => id !== foodId);
    } else {
      updated = [...favoriteIds, foodId];
    }
    setFavoriteIds(updated);
    localStorage.setItem(`favorites_${profile.name}`, JSON.stringify(updated));
    showLogToast(favoriteIds.includes(foodId) ? "Removed from favourites." : "Saved to favourites! ❤️");
  };

  const simulatePhotoScan = (foodObj: any) => {
    setScanningPhoto(true);
    setScannedResult(null);
    setTimeout(() => {
      setScanningPhoto(false);
      setScannedResult({
        name: foodObj.name,
        calories: foodObj.calories,
        protein: foodObj.protein,
        carbs: foodObj.carbs,
        fat: foodObj.fat,
        notes: "Scan shows direct nutrition. Protein is high. Fats are within healthy budget."
      });
    }, 2000);
  };

  const addRamadanWater = () => {
    const nextVal = ramadanWaterGlasses + 1;
    setRamadanWaterGlasses(nextVal);
    localStorage.setItem(`ramadan_water_${profile.name}`, nextVal.toString());
    showLogToast("Great job! +1 glass of water 💧");
  };

  const resetRamadanWater = () => {
    setRamadanWaterGlasses(0);
    localStorage.removeItem(`ramadan_water_${profile.name}`);
    showLogToast("Hydration total reset.");
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = DIET_PLAN_VARIATIONS.find(p => p.id === presetId);
    if (!preset) return;
    const updated = { ...mealPlans };
    for (let day = 1; day <= 7; day++) {
      const meal = preset.days[day];
      if (meal) {
        updated[day] = meal;
        localStorage.setItem(`meal_plan_${profile.name}_day_${day}`, JSON.stringify(meal));
      }
    }
    setMealPlans(updated);
    showLogToast(`${preset.name} activated — your week is set! ✅`);
  };

  const handleSaveCurrentPlan = () => {
    if (Object.keys(mealPlans).length === 0) {
      showLogToast('No meal plan days exist to save!');
      return;
    }
    const name = prompt('Give this plan a name:', `Custom Plan - ${new Date().toLocaleDateString()}`);
    if (name === null) return;
    const planName = name.trim() || `Custom Plan - ${new Date().toLocaleDateString()}`;
    const newSavedPlan = {
      id: Math.random().toString(36).substring(2, 9),
      name: planName,
      date: new Date().toLocaleDateString(),
      days: mealPlans
    };
    const updated = [...savedMealPlans, newSavedPlan];
    setSavedMealPlans(updated);
    localStorage.setItem(`saved_meal_plans_${profile.name}`, JSON.stringify(updated));
    showLogToast(`Saved "${planName}" to your archive! 📁`);
  };

  const handleRestoreSavedPlan = (savedPlan: any) => {
    if (window.confirm(`Load "${savedPlan.name}" as your active meal plan? This replaces your current week.`)) {
      setMealPlans(savedPlan.days);
      for (let day = 1; day <= 7; day++) {
        const meal = savedPlan.days[day];
        if (meal) {
          localStorage.setItem(`meal_plan_${profile.name}_day_${day}`, JSON.stringify(meal));
        } else {
          localStorage.removeItem(`meal_plan_${profile.name}_day_${day}`);
        }
      }
      showLogToast(`Restored "${savedPlan.name}" ✅`);
    }
  };

  const handleDeleteSavedPlan = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from your saved archive?`)) {
      const updated = savedMealPlans.filter(p => p.id !== id);
      setSavedMealPlans(updated);
      localStorage.setItem(`saved_meal_plans_${profile.name}`, JSON.stringify(updated));
      showLogToast(`Deleted "${name}" from archive.`);
    }
  };

  const handleDeleteActivePlan = () => {
    if (window.confirm('Clear all 7 days? You can always regenerate or load a saved plan.')) {
      for (let day = 1; day <= 7; day++) {
        localStorage.removeItem(`meal_plan_${profile.name}_day_${day}`);
      }
      setMealPlans({});
      showLogToast('Weekly plan cleared.');
    }
  };

  // Filtered food list
  const filteredFoods = PAKISTANI_FOODS_DB.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compare variables
  const foodA = PAKISTANI_FOODS_DB.find(f => f.id === foodAId) || PAKISTANI_FOODS_DB[0];
  const foodB = PAKISTANI_FOODS_DB.find(f => f.id === foodBId) || PAKISTANI_FOODS_DB[1];

  const getComparisonTip = (fa: any, fb: any) => {
    if (fa.id === 'paratha' && fb.id === 'roti') {
      return "Great comparison! Paratha has over double the calories and 12× the fat of whole-wheat roti. Swapping just one paratha per day could save you 200+ kcal. Your heart will thank you! 💚";
    }
    if (fa.calories > fb.calories) {
      return `${fb.name} is the lighter choice at ${fb.calories} kcal vs ${fa.calories} kcal. Small swaps like this add up — you're making smart choices! 🌟`;
    }
    return `${fa.name} is a solid pick with ${fa.protein}g protein. Try pairing it with a green salad for a balanced plate. You're doing great! 🥗`;
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
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
        fontFamily: fonts.body,
        textAlign: 'left',
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          HEADER — Warm coach-style greeting
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
        {/* Blob accents */}
        <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-10px', width: '100px', height: '100px', borderRadius: '50%', background: `${colors.accent}12`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: '1.5rem', fontWeight: 700, color: colors.white, margin: 0, lineHeight: 1.2 }}>
            Your Wellness Kitchen 🍳
          </h2>
          <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: 'rgba(255,255,255,0.85)', margin: `${spacing[8]} 0 0`, lineHeight: 1.6, maxWidth: '480px' }}>
            Personalised recipes matched to your daily budget of{' '}
            <strong style={{ color: colors.success }}>{metrics.calories} kcal</strong> and{' '}
            <strong style={{ color: colors.success }}>{metrics.protein}g protein</strong>.
            Every meal here is made for you.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION TABS — Pill-shaped, Headspace rounded
         ═══════════════════════════════════════════════════════ */}
      <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
          {[
            { id: '7day', label: 'Weekly Meals', icon: Calendar },
            { id: 'lookup', label: 'Search Foods', icon: Search },
            { id: 'ramadan', label: 'Fasting Helper', icon: Moon },
            { id: 'compare', label: 'Compare', icon: ArrowLeftRight },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !secondaryTab;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSecondaryTab(null); }}
                style={{
                  padding: `${spacing[8]} ${spacing[16]}`,
                  borderRadius: radii.button,
                  border: isActive ? `2px solid ${colors.primary}` : `1.5px solid ${colors.success}30`,
                  background: isActive ? colors.primary : colors.white,
                  color: isActive ? colors.white : colors.muted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[8],
                  fontWeight: 600,
                  fontSize: fontSizes.xs,
                  fontFamily: fonts.body,
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? shadows.card : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
          <span style={{ fontFamily: fonts.body, color: colors.muted, fontWeight: 600, fontSize: '0.6875rem', letterSpacing: '0.03em' }}>
            Tools:
          </span>
          {[
            { id: 'favorites', label: 'Favourites', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = secondaryTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSecondaryTab(tab.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: spacing[4],
                  padding: `6px ${spacing[12]}`, borderRadius: radii.button,
                  border: 'none',
                  background: isActive ? `${colors.primary}12` : 'transparent',
                  color: isActive ? colors.primary : colors.muted,
                  fontWeight: 600, fontSize: fontSizes.xs, fontFamily: fonts.body,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Icon size={14} style={tab.id === 'favorites' ? { fill: isActive ? colors.primary : 'none' } : {}} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TOAST NOTIFICATION — Noom-style encouraging
         ═══════════════════════════════════════════════════════ */}
      {loggedNotification && (
        <div
          className="hch-animate-in"
          style={{
            ...sectionCard,
            background: `${colors.success}15`,
            border: `1px solid ${colors.success}40`,
            padding: `${spacing[12]} ${spacing[20]}`,
            display: 'flex', alignItems: 'center', gap: spacing[12],
            fontSize: fontSizes.sm, fontWeight: 600, color: colors.primary,
          }}
        >
          <CheckCircle size={16} />
          <span>{loggedNotification}</span>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ ...sectionCard, background: '#fef2f2', border: '1px solid #fecaca', padding: `${spacing[12]} ${spacing[20]}`, fontSize: fontSizes.sm, color: '#b91c1c' }}>
          ⚠️ {error}
        </div>
      )}



      {/* ═══════════════════════════════════════════════════════
          B. FAVOURITES (Secondary Tab)
         ═══════════════════════════════════════════════════════ */}
      {secondaryTab === 'favorites' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Heart size={20} color="#e54d2e" /> Your Favourite Foods
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Saved foods for quick one-tap logging. Build your personal shortcut list! ❤️
            </p>
          </div>

          {favoriteIds.length === 0 ? (
            <div style={{ ...sectionCard, textAlign: 'center', padding: spacing[48], display: 'flex', flexDirection: 'column', gap: spacing[16], alignItems: 'center', border: `1.5px dashed ${colors.success}50` }}>
              <div style={{ fontSize: '2.5rem' }}>💛</div>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 600, color: colors.text, margin: 0 }}>No favourites yet — that's okay!</h4>
              <p style={{ fontSize: fontSizes.sm, color: colors.muted, margin: 0, maxWidth: '300px', lineHeight: 1.6 }}>Search foods and tap the heart icon to save them here for instant logging.</p>
              <button onClick={() => setActiveTab('lookup')} className="hch-btn hch-btn--primary" style={{ marginTop: spacing[4] }}>
                <Search size={14} /> Search Foods
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing[12] }}>
              {PAKISTANI_FOODS_DB.filter(f => favoriteIds.includes(f.id)).map(food => {
                const noom = getNoomColor(food.category);
                return (
                  <div key={food.id} style={{ ...sectionCard, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: spacing[16] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12] }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: noom.bg, color: noom.text, border: `1px solid ${noom.border}`, whiteSpace: 'nowrap' }}>{noom.label}</span>
                      <div>
                        <h4 style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>{food.name}</h4>
                        <span style={{ fontSize: '0.6875rem', color: colors.muted }}>{food.calories} kcal · {food.protein}g protein</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                      <button
                        onClick={() => handleLogMealCalories(food.name, food.calories, food.protein)}
                        style={{ padding: '6px 14px', borderRadius: radii.button, background: colors.primary, color: colors.white, border: 'none', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Log
                      </button>
                      <button onClick={() => toggleFavorite(food.id)} style={{ padding: '6px', borderRadius: radii.full, border: 'none', background: 'transparent', cursor: 'pointer', color: '#e54d2e' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          C. WEEKLY MEALS (Main Tab: 7-Day Plan)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === '7day' && !secondaryTab && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[20] }}>

          {/* Mode toggle: Presets vs Custom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4], background: colors.background, padding: '4px', borderRadius: radii.button }}>
            <button onClick={() => setPlanMode('presets')} style={pillToggle(planMode === 'presets')}>
              <BookOpen size={14} /> Expert Plans
            </button>
            <button onClick={() => setPlanMode('ai')} style={pillToggle(planMode === 'ai')}>
              <Sparkles size={14} /> Custom Builder
            </button>
          </div>

          {planMode === 'presets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              {/* Coach info banner */}
              <div style={{ background: `${colors.success}15`, borderRadius: radii.card, padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
                <Sparkles size={18} style={{ color: colors.primary, marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Dietitian-designed plans</h4>
                  <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.6, margin: `${spacing[4]} 0 0` }}>
                    Each plan features traditional Pakistani foods balanced for your goals. Tap to activate — your whole week updates instantly! 🎯
                  </p>
                </div>
              </div>

              {/* Preset cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing[16] }}>
                {DIET_PLAN_VARIATIONS.map((preset) => {
                  let presetImg = '/nutrition_plate.png';
                  if (preset.id === 'fat-loss-desi') presetImg = '/quick_action_meal.png';
                  else if (preset.id === 'lean-muscle') presetImg = '/male_meal_prep.png';
                  else if (preset.id === 'diabetes-safe') presetImg = '/nutrition_plate.png';
                  else if (preset.id === 'heart-healthy') presetImg = '/quick_action_workout.png';

                  let friendlyName = preset.name;
                  if (preset.id === 'fat-loss-desi') friendlyName = 'Weight Loss Plan';
                  else if (preset.id === 'lean-muscle') friendlyName = 'Muscle Building Plan';
                  else if (preset.id === 'diabetes-safe') friendlyName = 'Blood Sugar Balance';
                  else if (preset.id === 'heart-healthy') friendlyName = 'Heart-Healthy Plan';

                  const isSelected = selectedPresetId === preset.id;

                  return (
                    <div key={preset.id} style={{
                      ...sectionCard,
                      padding: 0,
                      overflow: 'hidden',
                      border: isSelected ? `2.5px solid ${colors.primary}` : `1px solid ${colors.success}25`,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(38,41,31,0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = shadows.card; }}
                    >
                      <div style={{ height: '120px', position: 'relative' }}>
                        <img src={presetImg} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: spacing[8], right: spacing[8], background: colors.primary, color: colors.white, padding: `3px ${spacing[12]}`, borderRadius: radii.button, fontSize: '0.625rem', fontWeight: 700, fontFamily: fonts.body }}>
                          {preset.tag}
                        </span>
                      </div>
                      <div style={{ padding: spacing[20], display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
                        <div>
                          <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>{friendlyName}</h4>
                          <span style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, display: 'block', marginTop: '4px' }}>
                            {preset.targetCalories} kcal · {preset.targetProtein}g Protein
                          </span>
                          <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, marginTop: spacing[8], margin: `${spacing[8]} 0 0` }}>{preset.description}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedPresetId(preset.id); handleLoadPreset(preset.id); }}
                          style={{
                            width: '100%', padding: '12px 20px', borderRadius: radii.button,
                            background: isSelected ? colors.primary : 'transparent',
                            color: isSelected ? colors.white : colors.primary,
                            border: `1.5px solid ${colors.primary}`,
                            fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.25s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[8], whiteSpace: 'nowrap',
                          }}
                        >
                          {isSelected ? <><Check size={14} /> Plan Active</> : 'Activate Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Custom Plan Builder */
            <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Custom Plan Builder</h3>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.primary, background: `${colors.primary}10`, padding: '3px 10px', borderRadius: radii.full, letterSpacing: '0.03em' }}>INTERACTIVE</span>
              </div>

              <div style={{ background: `${colors.success}10`, borderRadius: '12px', padding: spacing[12], display: 'flex', gap: spacing[8], alignItems: 'center' }}>
                <Sparkles size={16} style={{ color: colors.primary, flexShrink: 0 }} />
                <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5 }}>Customise your preferences below and we'll create meals you'll actually enjoy cooking! 🧑‍🍳</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[16] }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  <label style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Food style</label>
                  <select value={foodPreference} onChange={(e) => setFoodPreference(e.target.value)} style={inputStyle}>
                    <option value="A Mix of Both Desi and Western (Recommended)">Mix of Local and Western</option>
                    <option value="Purely Traditional Pakistani (Desi)">Traditional Pakistani Only</option>
                    <option value="Low-Oil & Healthy Traditional">Healthy Local (Low Oil)</option>
                    <option value="Keto-friendly High-Protein Desi">High-Protein Pakistani</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  <label style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Meals per day</label>
                  <select value={mealCount} onChange={(e) => setMealCount(e.target.value)} style={inputStyle}>
                    <option value="3-Meals (Breakfast, Lunch, Dinner)">3 meals</option>
                    <option value="4 Meals (Breakfast, Lunch, Dinner, and Snack)">4 meals (with snack)</option>
                    <option value="Standard (Breakfast, Snack, Lunch, Snack, Dinner)">5 meals (lighter portions)</option>
                    <option value="Ramadan (Sehri and Iftari only)">Ramadan Fasting</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Plan duration</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4], background: colors.background, padding: '4px', borderRadius: radii.button }}>
                  <button onClick={() => setGenerateMode('all')} style={pillToggle(generateMode === 'all')}>Full week</button>
                  <button onClick={() => setGenerateMode('single')} style={pillToggle(generateMode === 'single')}>Today only</button>
                </div>
              </div>

              <button onClick={generatePlan} className="hch-btn hch-btn--primary" style={{ width: '100%', padding: '14px 24px' }}>
                <ChefHat size={16} /> Generate Healthy Recipes
              </button>
            </div>
          )}

          {/* Plan action bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], background: colors.white, padding: spacing[16], borderRadius: radii.card, boxShadow: shadows.card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Calendar size={16} style={{ color: colors.primary }} />
              <span style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text }}>Weekly Plan</span>
            </div>
            <div style={{ display: 'flex', gap: spacing[8] }}>
              <button onClick={handleSaveCurrentPlan} className="hch-btn hch-btn--outline" style={{ fontSize: fontSizes.xs, padding: '10px 16px' }}>
                <Save size={12} /> Save
              </button>
              <button
                onClick={handleDeleteActivePlan}
                style={{
                  fontSize: fontSizes.xs, padding: '10px 16px', borderRadius: radii.button,
                  border: '1.5px solid #e54d2e', background: 'transparent', color: '#e54d2e',
                  display: 'flex', alignItems: 'center', gap: spacing[8],
                  cursor: 'pointer', fontFamily: fonts.body, fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>

          {/* Day Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.muted, letterSpacing: '0.03em' }}>
              Select day
            </span>
            <div style={{ display: 'flex', gap: spacing[8], overflowX: 'auto', paddingBottom: spacing[4] }}>
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const dayName = dayNames[dayNum - 1];
                const activeDayNum = new Date().getDay() === 0 ? 7 : new Date().getDay();
                const isToday = dayNum === activeDayNum;
                const isActive = activeDay === dayNum;
                const isSaved = !!mealPlans[dayNum];

                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    style={{
                      flexShrink: 0, minWidth: '64px',
                      padding: `${spacing[8]} ${spacing[12]}`,
                      borderRadius: '12px',
                      border: isActive ? `2px solid ${colors.primary}` : isToday ? `1.5px solid ${colors.accent}` : `1.5px solid ${colors.success}40`,
                      background: isActive ? colors.primary : colors.white,
                      color: isActive ? colors.white : colors.text,
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                      boxShadow: isActive ? shadows.card : 'none',
                      transition: 'all 0.25s ease', fontFamily: fonts.body,
                    }}
                  >
                    <span style={{ fontSize: fontSizes.xs, fontWeight: 700 }}>{dayName}</span>
                    {isToday && (
                      <span style={{ fontSize: '0.5625rem', fontWeight: 700, background: isActive ? colors.white : colors.accent, color: isActive ? colors.primary : colors.white, padding: '1px 6px', borderRadius: radii.full, marginTop: '2px' }}>Today</span>
                    )}
                    {!isToday && isSaved && (
                      <span style={{ fontSize: '0.5625rem', color: isActive ? colors.success : colors.primary, fontWeight: 600 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MEAL CARDS FOR ACTIVE DAY */}
          {loading ? (
            <div style={{ ...sectionCard, textAlign: 'center', padding: spacing[48] }}>
              <ChefHat size={36} style={{ color: colors.primary, margin: '0 auto 16px', animation: 'hch-fade-up 0.5s ease-out' }} />
              <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>
                {currentGeneratingDay !== null ? `Crafting Day ${currentGeneratingDay} of 7…` : 'Designing recipes…'}
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, marginTop: spacing[8] }}>{LOADING_TIPS[tipIndex]}</p>
            </div>
          ) : mealPlans[activeDay] ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0 }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][activeDay - 1]}'s meals
                </h4>
                <button onClick={() => generatePlanForDay(activeDay)} className="hch-btn hch-btn--ghost" style={{ fontSize: fontSizes.xs }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
                {[
                  { key: 'breakfast', label: 'Breakfast', emoji: '🍳', text: mealPlans[activeDay].breakfast, pctCal: 0.25, pctProt: 0.25 },
                  { key: 'sehri', label: 'Sehri', emoji: '🥣', text: mealPlans[activeDay].sehri, pctCal: 0.45, pctProt: 0.40 },
                  { key: 'lunch', label: 'Lunch', emoji: '🍛', text: mealPlans[activeDay].lunch, pctCal: 0.30, pctProt: 0.30 },
                  { key: 'snack', label: 'Snack', emoji: '🍎', text: mealPlans[activeDay].snack, pctCal: 0.15, pctProt: 0.15 },
                  { key: 'iftari', label: 'Iftari', emoji: '🍢', text: mealPlans[activeDay].iftari, pctCal: 0.25, pctProt: 0.25 },
                  { key: 'dinner', label: 'Dinner', emoji: '🍲', text: mealPlans[activeDay].dinner, pctCal: 0.35, pctProt: 0.35 },
                ].map((meal) => {
                  if (!meal.text || meal.text === 'N/A') return null;
                  const cal = Math.round(metrics.calories * meal.pctCal);
                  const prot = Math.round(metrics.protein * meal.pctProt);

                  return (
                    <div key={meal.key} style={{ ...sectionCard, display: 'flex', alignItems: 'flex-start', gap: spacing[16], padding: spacing[20] }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: `${colors.accent}10`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', flexShrink: 0,
                      }}>
                        {meal.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
                          <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>{meal.label}</h5>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.accent, background: `${colors.accent}10`, padding: '2px 10px', borderRadius: radii.full, whiteSpace: 'nowrap' }}>{cal} kcal</span>
                        </div>
                        <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, lineHeight: 1.65, margin: 0 }}>{meal.text}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing[12] }}>
                          <span style={{ fontSize: '0.6875rem', color: colors.muted }}>~{prot}g protein</span>
                          <button
                            onClick={() => handleLogMealCalories(meal.label, cal, prot)}
                            style={{
                              padding: '8px 16px', borderRadius: radii.button,
                              border: `1.5px solid ${colors.primary}`,
                              background: 'transparent', color: colors.primary,
                              fontFamily: fonts.body, fontSize: '0.6875rem', fontWeight: 700,
                              cursor: 'pointer', transition: 'all 0.2s',
                              display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                            }}
                          >
                            <Flame size={12} /> Log this meal
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {mealPlans[activeDay].notes && (
                <div style={{ background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`, borderRadius: radii.card, padding: spacing[16] }}>
                  <span style={{ fontFamily: fonts.heading, fontSize: fontSizes.xs, fontWeight: 700, color: colors.primary, display: 'block', marginBottom: spacing[4] }}>💡 Healthy tip</span>
                  <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.text, lineHeight: 1.6, margin: 0 }}>{mealPlans[activeDay].notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty state — Headspace mascot */
            <div style={{ ...sectionCard, textAlign: 'center', padding: spacing[48], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[16] }}>
              <div style={{ fontSize: '3rem' }}>🥘</div>
              <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 600, color: colors.text, margin: 0 }}>
                Nothing planned yet for {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][activeDay - 1]}
              </h3>
              <p style={{ fontSize: fontSizes.sm, color: colors.muted, margin: 0, maxWidth: '320px', lineHeight: 1.6 }}>
                Choose an expert plan above or build your own custom recipes. Your body will love the attention! 🌿
              </p>
            </div>
          )}

          {/* Saved Plans Archive */}
          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                <FolderOpen size={18} style={{ color: colors.primary }} />
                <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Saved Plans</h4>
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, background: colors.background, padding: '3px 10px', borderRadius: radii.full }}>{savedMealPlans.length} archived</span>
            </div>

            {savedMealPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing[24], background: colors.background, border: `1.5px dashed ${colors.success}50`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                <Calendar size={28} style={{ color: colors.muted }} />
                <span style={{ fontSize: fontSizes.xs, color: colors.muted }}>No saved plans yet. Save your active week to archive it.</span>
                <button onClick={handleSaveCurrentPlan} className="hch-btn hch-btn--primary" style={{ fontSize: fontSizes.xs }}>
                  <Save size={12} /> Save Current Week
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], maxHeight: '200px', overflowY: 'auto' }}>
                {savedMealPlans.map((plan) => (
                  <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: spacing[12], borderRadius: '12px', background: colors.background, border: `1px solid ${colors.success}25` }}>
                    <div>
                      <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>{plan.name}</span>
                      <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block' }}>Saved: {plan.date} · {Object.keys(plan.days).length} days</span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[4] }}>
                      <button
                        onClick={() => handleRestoreSavedPlan(plan)}
                        style={{ padding: '6px 12px', borderRadius: radii.button, background: colors.primary, color: colors.white, border: 'none', fontSize: '0.625rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                      >
                        <RefreshCw size={10} /> Load
                      </button>
                      <button
                        onClick={() => handleDeleteSavedPlan(plan.id, plan.name)}
                        style={{ padding: '6px', borderRadius: radii.full, border: 'none', background: 'transparent', cursor: 'pointer', color: '#e54d2e' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          D. SEARCH FOODS — with Noom color coding
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'lookup' && !secondaryTab && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Search size={20} color={colors.primary} /> Food Directory
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Search traditional foods, see Noom-style colour codes, and log instantly. 🥗
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search food (e.g. roti, biryani, daal)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.muted }} />
          </div>

          {/* Plate composition widget */}
          <div style={{ ...sectionCard, display: 'flex', alignItems: 'center', gap: spacing[20], flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: spacing[4] }}>Plate Composition</span>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Build your balanced plate</h4>
              <p style={{ fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing[4], lineHeight: 1.5 }}>Log foods below to see your plate fill up. Aim for balance! 🍽️</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: spacing[8] }}>
                <span style={{ fontSize: '0.625rem', padding: '3px 8px', borderRadius: '6px', background: '#e8f5e8', color: '#2d6a2d', border: '1px solid #c8e6c8', fontWeight: 600 }}>Fibre: {plateComposition.fibers}%</span>
                <span style={{ fontSize: '0.625rem', padding: '3px 8px', borderRadius: '6px', background: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe', fontWeight: 600 }}>Protein: {plateComposition.protein}%</span>
                <span style={{ fontSize: '0.625rem', padding: '3px 8px', borderRadius: '6px', background: '#fef9e7', color: '#8a6d1b', border: '1px solid #f7e3a0', fontWeight: 600 }}>Carbs: {plateComposition.carbs}%</span>
              </div>
            </div>
            <div style={{ width: '100px', height: '100px', position: 'relative', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="46" fill="none" stroke={`${colors.success}20`} strokeWidth="3" />
                <path d="M50,50 L91,50 A41,41 0 0,1 9,50 Z" fill={plateComposition.fibers > 0 ? `${colors.primary}40` : 'transparent'} stroke={colors.primary} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
                <path d="M50,50 L9,50 A41,41 0 0,1 50,91 Z" fill={plateComposition.protein > 0 ? `${colors.blue}40` : 'transparent'} stroke={colors.blue} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
                <path d="M50,50 L50,91 A41,41 0 0,1 91,50 Z" fill={plateComposition.carbs > 0 ? `${colors.accent}40` : 'transparent'} stroke={colors.accent} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, color: colors.muted, textTransform: 'uppercase' }}>Portions</span>
                <button onClick={resetPlate} style={{ fontSize: '0.5rem', fontWeight: 600, color: colors.primary, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>Reset</button>
              </div>
            </div>
          </div>

          {/* Food list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing[12] }}>
            {filteredFoods.map((food) => {
              const noom = getNoomColor(food.category);
              return (
                <div key={food.id} style={{ ...sectionCard, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: spacing[12], padding: spacing[16], transition: 'all 0.25s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(38,41,31,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadows.card; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: noom.bg, color: noom.text, border: `1px solid ${noom.border}` }}>{noom.label}</span>
                    <button onClick={() => toggleFavorite(food.id)} style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', color: favoriteIds.includes(food.id) ? '#e54d2e' : colors.muted, transition: 'color 0.2s' }}>
                      <Heart size={16} style={{ fill: favoriteIds.includes(food.id) ? '#e54d2e' : 'none' }} />
                    </button>
                  </div>

                  <div>
                    <h4 style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>{food.name}</h4>
                    <p style={{ fontSize: fontSizes.xs, color: colors.muted, marginTop: '4px', lineHeight: 1.5 }}>{food.description}</p>
                  </div>

                  <div style={{ borderTop: `1px solid ${colors.success}20`, paddingTop: spacing[12], display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text }}>{food.calories}</span>
                      <span style={{ fontSize: '0.625rem', color: colors.muted, marginLeft: '4px' }}>kcal</span>
                      <span style={{ display: 'block', fontSize: '0.6875rem', color: colors.muted }}>Protein: {food.protein}g</span>
                    </div>
                    <button
                      onClick={() => { handleLogMealCalories(food.name, food.calories, food.protein); addFoodToPlate(food.category); }}
                      style={{
                        padding: '8px 14px', borderRadius: radii.button,
                        background: colors.primary, color: colors.white, border: 'none',
                        fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                      }}
                    >
                      <Plus size={12} /> Log
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredFoods.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: spacing[32], color: colors.muted, fontSize: fontSizes.sm }}>
                No foods match your search. Try a different keyword! 🔍
              </div>
            )}
          </div>
        </div>
      )}



      {/* ═══════════════════════════════════════════════════════
          F. RAMADAN HEALTH HELPER
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'ramadan' && !secondaryTab && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Moon size={20} color={colors.primary} /> Ramadan Health Helper
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Stay hydrated and energetic while fasting. Your body deserves extra care during Ramadan. 🌙
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing[16] }}>
            {/* Hydration tracker */}
            <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Hydration Timeline</h4>
                  <span style={{ fontSize: fontSizes.xs, color: colors.muted }}>Tap checkpoints between sunset and dawn</span>
                </div>
                <span style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.blue }}>
                  {ramadanWaterGlasses}/8 <span style={{ fontSize: fontSizes.xs, fontWeight: 400, color: colors.muted }}>cups</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], maxHeight: '260px', overflowY: 'auto' }}>
                {[
                  { glassNum: 1, time: "7:15 PM", event: "Iftari (Break Fast)" },
                  { glassNum: 2, time: "7:45 PM", event: "After Maghrib Prayer" },
                  { glassNum: 3, time: "8:30 PM", event: "Before Isha / Taraweeh" },
                  { glassNum: 4, time: "10:00 PM", event: "After Isha / Taraweeh" },
                  { glassNum: 5, time: "11:30 PM", event: "Late Night Check" },
                  { glassNum: 6, time: "1:00 AM", event: "Before Winding Down" },
                  { glassNum: 7, time: "3:30 AM", event: "Suhoor Waking Cup" },
                  { glassNum: 8, time: "4:15 AM", event: "Sehri (Last Call)" },
                ].map((item) => {
                  const completed = item.glassNum <= ramadanWaterGlasses;
                  return (
                    <div
                      key={item.glassNum}
                      onClick={() => {
                        setRamadanWaterGlasses(item.glassNum);
                        localStorage.setItem(`ramadan_water_${profile.name}`, item.glassNum.toString());
                        showLogToast(`Glass ${item.glassNum} done! 💧`);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: `${spacing[8]} ${spacing[12]}`, borderRadius: '12px',
                        border: completed ? `1.5px solid ${colors.primary}30` : `1px solid ${colors.success}20`,
                        background: completed ? `${colors.primary}06` : 'transparent',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.625rem', fontWeight: 700,
                          background: completed ? colors.primary : colors.background,
                          color: completed ? colors.white : colors.muted,
                          border: completed ? 'none' : `1.5px solid ${colors.success}40`,
                        }}>{item.glassNum}</div>
                        <div>
                          <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: completed ? colors.primary : colors.text, display: 'block' }}>{item.event}</span>
                          <span style={{ fontSize: '0.625rem', color: colors.muted }}>{item.time}</span>
                        </div>
                      </div>
                      {completed && <Check size={14} style={{ color: colors.primary }} />}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: spacing[8], borderTop: `1px solid ${colors.success}15`, paddingTop: spacing[12] }}>
                <button
                  onClick={() => {
                    const nextVal = Math.min(8, ramadanWaterGlasses + 1);
                    setRamadanWaterGlasses(nextVal);
                    localStorage.setItem(`ramadan_water_${profile.name}`, nextVal.toString());
                    showLogToast("Great! +1 glass 💧");
                  }}
                  className="hch-btn hch-btn--primary"
                  style={{ flex: 1, padding: '10px 16px', fontSize: fontSizes.xs }}
                >
                  Quick Add +1
                </button>
                <button onClick={resetRamadanWater} className="hch-btn hch-btn--ghost" style={{ fontSize: fontSizes.xs }}>Reset</button>
              </div>
            </div>

            {/* Health rules */}
            <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                <AlertCircle size={16} color={colors.accent} /> Summer Fasting Safety
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
                <div style={{ background: '#fef9e7', borderRadius: '12px', padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
                  <span>⚠️</span>
                  <div>
                    <h5 style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, margin: 0 }}>Warning Signs</h5>
                    <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.6, marginTop: '4px' }}>Dark-coloured urine, strong headaches, severe dry mouth, and confusion.</p>
                  </div>
                </div>

                <div style={{ background: `${colors.success}10`, borderRadius: '12px', padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
                  <span>💡</span>
                  <div>
                    <h5 style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, margin: 0 }}>Sehri Advice</h5>
                    <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.6, marginTop: '4px' }}>Eat slow-release carbs like barley porridge. Avoid tea — it speeds up water loss.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          G. COMPARE FOODS — Side by side
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'compare' && !secondaryTab && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <ArrowLeftRight size={20} color={colors.primary} /> Compare Foods
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Put two foods side by side and see which is the healthier swap. Knowledge is power! 💪
            </p>
          </div>

          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[20] }}>
            {/* Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[16] }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>First food</label>
                <select value={foodAId} onChange={(e) => setFoodAId(e.target.value)} style={inputStyle}>
                  {PAKISTANI_FOODS_DB.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Second food</label>
                <select value={foodBId} onChange={(e) => setFoodBId(e.target.value)} style={inputStyle}>
                  {PAKISTANI_FOODS_DB.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
                </select>
              </div>
            </div>

            {/* Side-by-side cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[16] }}>
              {[foodA, foodB].map((food, idx) => {
                const noom = getNoomColor(food.category || 'other');
                const grade = food.healthGrade || 'B';
                const gradeColor = grade.startsWith('A') || grade.startsWith('B') ? colors.primary : grade.startsWith('C') ? '#b59b1b' : '#e54d2e';
                return (
                  <div key={idx} style={{ background: colors.background, borderRadius: radii.card, padding: spacing[16], display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: noom.bg, color: noom.text, border: `1px solid ${noom.border}` }}>{food.category || 'Food'}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSizes.xs, fontWeight: 800, border: `2px solid ${gradeColor}30`, background: `${gradeColor}08`, color: gradeColor }}>{grade}</div>
                    </div>
                    <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>{food.name}</h4>
                    <p style={{ fontSize: fontSizes.xs, color: colors.muted, fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>"{food.description}"</p>

                    {/* Macro bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], borderTop: `1px solid ${colors.success}15`, paddingTop: spacing[12] }}>
                      {[
                        { label: 'Calories', value: food.calories, max: 600, unit: 'kcal', color: colors.accent },
                        { label: 'Protein', value: food.protein, max: 35, unit: 'g', color: colors.primary },
                      ].map((macro) => (
                        <div key={macro.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSizes.xs }}>
                            <span style={{ color: colors.muted }}>{macro.label}</span>
                            <span style={{ fontWeight: 700, color: colors.text }}>{macro.value} {macro.unit}</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: `${colors.success}15`, borderRadius: radii.full, overflow: 'hidden', marginTop: '4px' }}>
                            <div style={{ width: `${Math.min(100, (macro.value / macro.max) * 100)}%`, height: '100%', background: macro.color, borderRadius: radii.full, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ))}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[4], marginTop: spacing[4] }}>
                        {[
                          { label: 'Carbs', value: `${food.carbs}g` },
                          { label: 'Fat', value: `${food.fat}g` },
                          { label: 'Fibre', value: `${food.fiber || 0}g` },
                        ].map((m) => (
                          <div key={m.label} style={{ textAlign: 'center', padding: '8px', background: colors.white, borderRadius: '8px', fontSize: '0.625rem' }}>
                            <span style={{ color: colors.muted, display: 'block' }}>{m.label}</span>
                            <span style={{ fontWeight: 700, color: colors.text, display: 'block', marginTop: '2px' }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coach verdict */}
            <div style={{ background: `${colors.success}10`, borderRadius: radii.card, padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
              <ChefHat size={20} style={{ color: colors.primary, marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.primary, letterSpacing: '0.03em' }}>Coach's Verdict</span>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, lineHeight: 1.65, marginTop: spacing[4], margin: `${spacing[4]} 0 0` }}>{getComparisonTip(foodA, foodB)}</p>
              </div>
            </div>

            {((foodA.healthGrade || 'B').startsWith('D') || (foodA.healthGrade || 'B').startsWith('F') || (foodB.healthGrade || 'B').startsWith('D') || (foodB.healthGrade || 'B').startsWith('F')) && (
              <div style={{ background: `${colors.accent}08`, border: `1px solid ${colors.accent}20`, borderRadius: radii.card, padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>💡</span>
                <div>
                  <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.accent }}>Smart Swap Tip</span>
                  <p style={{ fontSize: fontSizes.xs, color: colors.text, lineHeight: 1.6, marginTop: spacing[4], margin: `${spacing[4]} 0 0` }}>
                    You're comparing items with lower health grades. Try swapping fried or refined options for whole grains like <strong>Whole-wheat Roti (Grade A)</strong> — it can save up to 15g fat per meal! 🌾
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
