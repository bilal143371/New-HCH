import React, { useState, useEffect } from 'react';
import { UserProfile, UserMetrics, MealPlan } from '../types';
import { PAKISTANI_FOODS_DB_EXPANDED as PAKISTANI_FOODS_DB, DIET_PLAN_VARIATIONS } from '../data/nutrition';
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

interface MealPlanViewProps {
  profile: UserProfile;
  metrics: UserMetrics;
  onAddCalories: (cal: number, prot: number) => void;
}

const LOADING_TIPS = [
  "Designing low-fat traditional Pakistani recipe ideas...",
  "Applying high-protein options based on your physical goals...",
  "Reviewing heart-healthy and diabetes-safe food guidelines...",
  "Structuring customized meal proportions for you..."
];

// Database of common Pakistani foods is now imported from staticPlans.ts as PAKISTANI_FOODS_DB


// Healthy recipes data
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

export default function MealPlanView({
  profile,
  metrics,
  onAddCalories
}: MealPlanViewProps) {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'7day' | 'lookup' | 'photo' | 'ramadan' | 'compare'>('7day');
  const [secondaryTab, setSecondaryTab] = useState<'cooking' | 'favorites' | null>(null);

  // 7-Day Food Plan input states
  const [foodPreference, setFoodPreference] = useState('A Mix of Both Desi and Western (Recommended)');
  const [mealCount, setMealCount] = useState('4 Meals (Breakfast, Lunch, Dinner, and Snack)');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [planMode, setPlanMode] = useState<'presets' | 'ai'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fat-loss-desi');

  // States for general loading and notifications
  const [loading, setLoading] = useState(false);
  const [generateMode, setGenerateMode] = useState<'all' | 'single'>('all');
  const [currentGeneratingDay, setCurrentGeneratingDay] = useState<number | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [error, setError] = useState('');
  const [loggedNotification, setLoggedNotification] = useState('');

  // Daily Meal plans state dictionary indexed by day number (1-7)
  const [mealPlans, setMealPlans] = useState<{[key: number]: MealPlan}>({});

  // Saved plan snapshots (Archive)
  const [savedMealPlans, setSavedMealPlans] = useState<{id: string, name: string, date: string, days: {[key: number]: MealPlan}}[]>([]);

  // Look Up Food Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Take Food Photo Mock States
  const [scanningPhoto, setScanningPhoto] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);

  // Ramadan tracker hydration counts (Glasses of water from Iftari to Sehri)
  const [ramadanWaterGlasses, setRamadanWaterGlasses] = useState(0);

  // Compare Foods States
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
    // Load day-by-day plans
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

    // Seed with dynamic expert preset if no plans exist yet
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

    // Load favorites list
    const savedFavs = localStorage.getItem(`favorites_${profile.name}`);
    if (savedFavs) {
      try {
        setFavoriteIds(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    // Load Ramadan water cups
    const savedWater = localStorage.getItem(`ramadan_water_${profile.name}`);
    if (savedWater) {
      setRamadanWaterGlasses(parseInt(savedWater, 10));
    }

    // Load saved meal plans archive
    const savedPlansRaw = localStorage.getItem(`saved_meal_plans_${profile.name}`);
    if (savedPlansRaw) {
      try {
        setSavedMealPlans(JSON.parse(savedPlansRaw));
      } catch (e) {
        console.error(e);
      }
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile,
          metrics,
          isRamadan: isRamadanSelected,
          foodPrefOverride: foodPreference,
          mealCount: mealCount,
          day: dayNum
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan.');
      }

      if (data.mealPlan) {
        const updatedPlans = { ...mealPlans, [dayNum]: data.mealPlan };
        setMealPlans(updatedPlans);
        localStorage.setItem(
          `meal_plan_${profile.name}_day_${dayNum}`,
          JSON.stringify(data.mealPlan)
        );
        showLogToast(`Created custom healthy plan for Day ${dayNum}!`);
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              profile,
              metrics,
              isRamadan: isRamadanSelected,
              foodPrefOverride: foodPreference,
              mealCount: mealCount,
              day: d
            })
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || `Failed to generate meal plan for Day ${d}.`);
          }

          if (data.mealPlan) {
            tempPlans[d] = data.mealPlan;
            setMealPlans({ ...tempPlans });
            localStorage.setItem(
              `meal_plan_${profile.name}_day_${d}`,
              JSON.stringify(data.mealPlan)
            );
          } else {
            throw new Error(`No meal plan returned for Day ${d}.`);
          }
        }
        showLogToast('All 7 days generated successfully!');
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
    showLogToast(`Logged ${calories} kcal and ${protein}g protein!`);
  };

  const showLogToast = (msg: string) => {
    setLoggedNotification(msg);
    setTimeout(() => {
      setLoggedNotification('');
    }, 3000);
  };

  // Toggle Favorite
  const toggleFavorite = (foodId: string) => {
    let updated: string[];
    if (favoriteIds.includes(foodId)) {
      updated = favoriteIds.filter(id => id !== foodId);
    } else {
      updated = [...favoriteIds, foodId];
    }
    setFavoriteIds(updated);
    localStorage.setItem(`favorites_${profile.name}`, JSON.stringify(updated));
    showLogToast(favoriteIds.includes(foodId) ? "Removed from favorites." : "Added to favorites!");
  };

  // Trigger Mock Camera Analysis
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

  // Increment Ramadan Water Glasses
  const addRamadanWater = () => {
    const nextVal = ramadanWaterGlasses + 1;
    setRamadanWaterGlasses(nextVal);
    localStorage.setItem(`ramadan_water_${profile.name}`, nextVal.toString());
    showLogToast("Logged 1 glass of clean water!");
  };

  const resetRamadanWater = () => {
    setRamadanWaterGlasses(0);
    localStorage.removeItem(`ramadan_water_${profile.name}`);
    showLogToast("Cleared hydration total.");
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
    showLogToast(`Loaded: ${preset.name}`);
  };

  const handleSaveCurrentPlan = () => {
    if (Object.keys(mealPlans).length === 0) {
      showLogToast('No meal plan days exist to save!');
      return;
    }
    const name = prompt('Enter a name for this custom 7-day meal plan:', `Custom Plan - ${new Date().toLocaleDateString()}`);
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
    showLogToast(`Archived plan: "${planName}"!`);
  };

  const handleRestoreSavedPlan = (savedPlan: any) => {
    if (window.confirm(`Load "${savedPlan.name}" as your active 7-day meal plan? This will overwrite your active daily meals.`)) {
      setMealPlans(savedPlan.days);
      for (let day = 1; day <= 7; day++) {
        const meal = savedPlan.days[day];
        if (meal) {
          localStorage.setItem(`meal_plan_${profile.name}_day_${day}`, JSON.stringify(meal));
        } else {
          localStorage.removeItem(`meal_plan_${profile.name}_day_${day}`);
        }
      }
      showLogToast(`Restored active plan: ${savedPlan.name}`);
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
    if (window.confirm('Delete all 7 days of the active food plan? This clears the custom dashboard.')) {
      for (let day = 1; day <= 7; day++) {
        localStorage.removeItem(`meal_plan_${profile.name}_day_${day}`);
      }
      setMealPlans({});
      showLogToast('Cleared active 7-day meal plan.');
    }
  };

  // Filter Look up list
  const filteredFoods = PAKISTANI_FOODS_DB.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Setup Comparison variables
  const foodA = PAKISTANI_FOODS_DB.find(f => f.id === foodAId) || PAKISTANI_FOODS_DB[0];
  const foodB = PAKISTANI_FOODS_DB.find(f => f.id === foodBId) || PAKISTANI_FOODS_DB[1];

  // Helper comparison tip
  const getComparisonTip = (fa: any, fb: any) => {
    if (fa.id === 'paratha' && fb.id === 'roti') {
      return "Paratha has more than double the calories of whole-wheat roti. Paratha contains twelve grams of unhealthy fats. Roti has only one gram of fat. Choose whole-wheat roti for healthy weight loss!";
    }
    if (fa.calories > fb.calories) {
      return `${fb.name} is lower in calories. It has ${fb.calories} kcal compared to ${fa.calories} kcal. Choose ${fb.name} to control weight.`;
    }
    return `${fa.name} is a clean food choice. It contains ${fa.protein} grams of protein. Try incorporating it into your routine.`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-left">
      
      {/* HEADER SECTION */}
      <div className="border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-sans font-extrabold text-text-headline">
            🥗 Wellness Kitchen
          </h2>
          <p className="text-xs text-text-body mt-1 leading-relaxed">
            Custom-tailored meals matched to your daily budget of <span className="text-text-gold font-bold font-mono">{metrics.calories} kcal</span>.
          </p>
        </div>
      </div>

      {/* TOP NAVIGATION BAR (MAIN MENU) */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 font-mono">Main Menu</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-white/[0.06] pb-4">
            <button
              onClick={() => { setActiveTab('7day'); setSecondaryTab(null); }}
              className={`py-3 px-2 text-center text-xs font-bold rounded-xl transition duration-150 outline-none flex flex-col items-center justify-center gap-1.5 border ${
                activeTab === '7day' && !secondaryTab
                  ? 'bg-purple-700/40 text-purple-100 border-purple-500/60 shadow-md shadow-purple-500/15'
                  : 'bg-bg-card border-white/[0.06] text-text-muted hover:text-text-headline'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>7-Day Food Plan</span>
            </button>

            <button
              onClick={() => { setActiveTab('lookup'); setSecondaryTab(null); }}
              className={`py-3 px-2 text-center text-xs font-bold rounded-xl transition duration-150 outline-none flex flex-col items-center justify-center gap-1.5 border ${
                activeTab === 'lookup' && !secondaryTab
                  ? 'bg-purple-700/40 text-purple-100 border-purple-500/60 shadow-md shadow-purple-500/15'
                  : 'bg-bg-card border-white/[0.06] text-text-muted hover:text-text-headline'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Look Up Food</span>
            </button>

            <button
              onClick={() => { setActiveTab('photo'); setSecondaryTab(null); }}
              className={`py-3 px-2 text-center text-xs font-bold rounded-xl transition duration-150 outline-none flex flex-col items-center justify-center gap-1.5 border ${
                activeTab === 'photo' && !secondaryTab
                  ? 'bg-purple-700/40 text-purple-100 border-purple-500/60 shadow-md shadow-purple-500/15'
                  : 'bg-bg-card border-white/[0.06] text-text-muted hover:text-text-headline'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take Food Photo</span>
            </button>

            <button
              onClick={() => { setActiveTab('ramadan'); setSecondaryTab(null); }}
              className={`py-3 px-2 text-center text-xs font-bold rounded-xl transition duration-150 outline-none flex flex-col items-center justify-center gap-1.5 border ${
                activeTab === 'ramadan' && !secondaryTab
                  ? 'bg-purple-700/40 text-purple-100 border-purple-500/60 shadow-md shadow-purple-500/15'
                  : 'bg-bg-card border-white/[0.06] text-text-muted hover:text-text-headline'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Ramadan Helper</span>
            </button>

            <button
              onClick={() => { setActiveTab('compare'); setSecondaryTab(null); }}
              className={`py-3 px-2 text-center text-xs font-bold rounded-xl transition duration-150 outline-none flex flex-col items-center justify-center gap-1.5 border ${
                activeTab === 'compare' && !secondaryTab
                  ? 'bg-purple-700/40 text-purple-100 border-purple-500/60 shadow-md shadow-purple-500/15'
                  : 'bg-bg-card border-white/[0.06] text-text-muted hover:text-text-headline'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Compare Foods</span>
            </button>
          </div>
        </div>

        {/* SECONDARY NAVIGATION */}
        <div className="flex items-center space-x-4 bg-bg-base p-2.5 rounded-xl border border-white/[0.06] text-xs font-medium">
          <span className="text-text-muted uppercase tracking-wider text-[10px] font-mono">Extra Tools:</span>
          
          <button
            onClick={() => { setSecondaryTab('cooking'); }}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg transition ${
              secondaryTab === 'cooking'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-text-muted hover:text-text-headline'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Easy Cooking Guide</span>
          </button>

          <button
            onClick={() => { setSecondaryTab('favorites'); }}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg transition ${
              secondaryTab === 'favorites'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-text-muted hover:text-text-headline'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {loggedNotification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center shadow-md animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 mr-2" />
          <span>{loggedNotification}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* RENDERING SECTIONS BASED ON TAB SELECTION */}

      {/* A. SECONDARY TAB: EASY COOKING GUIDE */}
      {secondaryTab === 'cooking' && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-md font-bold text-text-headline flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-gold-primary" /> Easy Cooking Guide
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Simple traditional cooking rules transformed for light calories and high nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECIPES.map((recipe, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-bg-card border border-white/[0.06] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-text-headline">{recipe.title}</h4>
                    <span className="text-[10px] text-text-gold font-mono uppercase tracking-wider">{recipe.time} cook time</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-text-headline font-mono block">{recipe.calories}</span>
                    <span className="text-[10px] text-text-muted font-mono block">Prot: {recipe.protein}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider">Clean Ingredients:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] bg-bg-surface px-2.5 py-1 rounded-md text-text-body font-sans">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider">Step-by-Step Steps (Under 12 Words Each):</span>
                  <ol className="list-decimal list-inside text-xs text-text-body space-y-1 pl-1">
                    {recipe.steps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* B. SECONDARY TAB: FAVORITES */}
      {secondaryTab === 'favorites' && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-md font-bold text-text-headline flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500/20" /> Your Favorite Foods
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Your preferred food lookups saved here to track instantly with one click.
            </p>
          </div>

          {favoriteIds.length === 0 ? (
            <div className="text-center p-8 bg-bg-card rounded-xl border border-white/[0.06] space-y-2">
              <Heart className="w-10 h-10 text-text-muted mx-auto" />
              <h4 className="text-xs font-bold text-text-headline">No favorites saved yet</h4>
              <p className="text-[11px] text-text-body">
                Browse "Look Up Food" tab and click the heart icon to save favorite foods.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PAKISTANI_FOODS_DB.filter(f => favoriteIds.includes(f.id)).map(food => (
                <div key={food.id} className="p-4 rounded-xl bg-bg-card border border-white/[0.06] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-text-headline">{food.name}</h4>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Calories: <span className="text-text-gold font-mono font-bold">{food.calories}</span> · Protein: <span className="text-text-headline font-mono">{food.protein}g</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLogMealCalories(food.name, food.calories, food.protein)}
                      className="p-1.5 px-3 bg-gold-primary text-bg-deep rounded-lg text-[10px] font-bold hover:bg-gold-light transition"
                    >
                      Log
                    </button>
                    <button
                      onClick={() => toggleFavorite(food.id)}
                      className="p-1.5 hover:bg-white/[0.06] text-rose-500 rounded-lg transition"
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

      {/* C. MAIN TAB: 7-DAY FOOD PLAN SECTION */}
      {activeTab === '7day' && !secondaryTab && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Method Selection Toggles */}
          <div className="grid grid-cols-2 gap-2 bg-bg-card p-1.5 rounded-2xl border border-white/[0.06] shadow-md">
            <button
              onClick={() => setPlanMode('presets')}
              className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                planMode === 'presets'
                  ? 'bg-gold-primary text-bg-deep shadow'
                  : 'text-text-muted hover:text-text-headline hover:bg-white/[0.03]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Expert Food Presets (Instant)</span>
            </button>
            <button
              onClick={() => setPlanMode('ai')}
              className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                planMode === 'ai'
                  ? 'bg-gold-primary text-bg-deep shadow'
                  : 'text-text-muted hover:text-text-headline hover:bg-white/[0.03]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Plan Creator</span>
            </button>
          </div>

          {planMode === 'presets' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-gold-primary/[0.02] border border-gold-primary/10 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-text-gold mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-text-gold uppercase tracking-wider font-mono block">Professional Meal Plans</span>
                  <p className="text-xs text-text-body mt-1 leading-relaxed">
                    Select a ready-made healthy plan tailored by dietitians to swap your active week instantly. All plans feature traditional Pakistani foods optimized for calorie limits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DIET_PLAN_VARIATIONS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-5 rounded-2xl bg-bg-card border transition relative flex flex-col justify-between ${
                      selectedPresetId === preset.id
                        ? 'border-gold-primary shadow-lg bg-gold-primary/[0.02]'
                        : 'border-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold bg-gold-primary/10 text-text-gold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          {preset.tag}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono font-bold">
                          ~{preset.targetCalories} kcal · {preset.targetProtein}g Protein
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-text-headline mt-2.5">{preset.name}</h4>
                      <p className="text-xs text-text-body mt-1.5 leading-relaxed">{preset.description}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        handleLoadPreset(preset.id);
                      }}
                      className={`w-full mt-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 border ${
                        selectedPresetId === preset.id
                          ? 'bg-gold-primary text-bg-deep border-gold-primary'
                          : 'bg-bg-surface hover:bg-white/[0.03] text-text-headline border-white/[0.06]'
                      }`}
                    >
                      {selectedPresetId === preset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Weekly Plan</span>
                        </>
                      ) : (
                        <span>Activate This Plan Preset</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Header & Sparkles */
            <div className="p-5 rounded-2xl bg-bg-card border border-white/[0.06] space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-extrabold text-text-headline">7-Day Food Plan</h3>
                <span className="text-[10px] font-bold bg-purple-900/40 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Active Weekly Plan
                </span>
              </div>

              {/* Sparkle Banner */}
              <div className="flex items-center space-x-2 bg-emerald-500/[0.04] p-3 rounded-xl border border-emerald-500/10">
                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                <div>
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest font-mono block">
                    Tell Us What You Want To Eat
                  </span>
                  <span className="text-[10px] text-text-body block">Adjust your style preferences and trigger customized recipes</span>
                </div>
              </div>

              {/* User Preference inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">What kind of food do you prefer?</label>
                  <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value)}
                    className="w-full bg-bg-surface border border-white/[0.06] rounded-xl p-3 text-xs text-text-headline focus:outline-none focus:border-gold-primary transition"
                  >
                    <option value="A Mix of Both Desi and Western (Recommended)">A Mix of Both Desi and Western (Recommended)</option>
                    <option value="Purely Traditional Pakistani (Desi)">Purely Traditional Pakistani (Desi)</option>
                    <option value="Low-Oil & Healthy Traditional">Low-Oil & Healthy Traditional</option>
                    <option value="Keto-friendly High-Protein Desi">Keto-friendly High-Protein Desi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">How many meals a day?</label>
                  <select
                    value={mealCount}
                    onChange={(e) => setMealCount(e.target.value)}
                    className="w-full bg-bg-surface border border-white/[0.06] rounded-xl p-3 text-xs text-text-headline focus:outline-none focus:border-gold-primary transition"
                  >
                    <option value="3-Meals (Breakfast, Lunch, Dinner)">3-Meals (Breakfast, Lunch, Dinner)</option>
                    <option value="4 Meals (Breakfast, Lunch, Dinner, and Snack)">4 Meals (Breakfast, Lunch, Dinner, and Snack)</option>
                    <option value="Standard (Breakfast, Snack, Lunch, Snack, Dinner)">Standard (Breakfast, Snack, Lunch, Snack, Dinner)</option>
                    <option value="Ramadan (Sehri and Iftari only)">Ramadan (Sehri and Iftari only)</option>
                  </select>
                </div>
              </div>

              {/* Plan Option select toggle */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">Plan Option</label>
                <div className="grid grid-cols-2 gap-2 bg-bg-surface p-1 rounded-xl border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setGenerateMode('all')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                      generateMode === 'all'
                        ? 'bg-gold-primary text-bg-deep shadow'
                        : 'text-text-muted hover:text-text-headline hover:bg-white/[0.03]'
                    }`}
                  >
                    Create All 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerateMode('single')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                      generateMode === 'single'
                        ? 'bg-gold-primary text-bg-deep shadow'
                        : 'text-text-muted hover:text-text-headline hover:bg-white/[0.03]'
                    }`}
                  >
                    Create Day {activeDay} Only
                  </button>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={generatePlan}
                className="w-full py-3 btn-3d-gold font-sans font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 mt-2 uppercase tracking-wider"
              >
                <ChefHat className="w-4 h-4" />
                <span>
                  {generateMode === 'all' ? 'Make 7-Day Food Plan' : `Make Day ${activeDay} Food Plan`}
                </span>
              </button>
            </div>
          )}

          {/* Plan actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-card p-4 rounded-2xl border border-white/[0.06] shadow-md">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gold-primary" />
              <span className="text-xs font-bold text-text-headline uppercase tracking-wider font-sans">Active 7-Day Plan</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveCurrentPlan}
                className="py-2.5 px-4 btn-3d-slate rounded-xl text-[10px] font-bold font-mono flex items-center space-x-1 uppercase tracking-wider"
                title="Save this current 7-day plan configuration to your saved archive"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save/Archive Plan</span>
              </button>
              <button
                onClick={handleDeleteActivePlan}
                className="py-2.5 px-4 btn-3d-red rounded-xl text-[10px] font-bold font-mono flex items-center space-x-1 uppercase tracking-wider"
                title="Delete/Reset all 7 days of the active food plan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete/Clear Plan</span>
              </button>
            </div>
          </div>

          {/* Day Selector Menu */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider font-mono">Select Active Day:</span>
            <div className="flex space-x-1.5 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-center text-xs font-bold font-mono transition border ${
                    activeDay === dayNum
                      ? 'bg-purple-900/30 text-purple-200 border-purple-500/50 shadow-md'
                      : mealPlans[dayNum]
                      ? 'bg-bg-card border-gold-primary/20 text-text-gold'
                      : 'bg-bg-card border-white/[0.04] text-text-muted hover:text-text-headline'
                  }`}
                >
                  Day {dayNum}
                  {mealPlans[dayNum] && (
                    <span className="block text-[8px] text-text-muted mt-0.5 font-sans">✓ Saved</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN MEAL DISPLAY PANELS */}
          {loading ? (
            <div className="p-8 md:p-12 rounded-2xl bg-bg-card border border-white/[0.08] shadow-deep text-center space-y-6 max-w-lg mx-auto overflow-hidden relative card-3d">
              {/* Background radial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-primary/5 rounded-full blur-[60px] pointer-events-none" />

              {/* 3D Orbit Loading Stage */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center" style={{ perspective: '600px' }}>
                <style>{`
                  @keyframes sub-orbit-x {
                    0% { transform: rotateX(0deg) rotateY(45deg); }
                    100% { transform: rotateX(360deg) rotateY(45deg); }
                  }
                  @keyframes sub-orbit-y {
                    0% { transform: rotateX(45deg) rotateY(0deg); }
                    100% { transform: rotateX(45deg) rotateY(360deg); }
                  }
                  .sub-ring-x {
                    transform-style: preserve-3d;
                    animation: sub-orbit-x 6s linear infinite;
                  }
                  .sub-ring-y {
                    transform-style: preserve-3d;
                    animation: sub-orbit-y 4.5s linear infinite;
                  }
                `}</style>
                {/* Ring X */}
                <div className="absolute w-36 h-36 border-2 border-dashed border-gold-primary/30 rounded-full sub-ring-x flex items-center justify-center">
                  <div className="w-3 h-3 bg-gold-primary rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#F4A220]" />
                </div>
                {/* Ring Y */}
                <div className="absolute w-28 h-28 border border-emerald-400/30 rounded-full sub-ring-y flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-1/2 -left-1 -translate-y-1/2 shadow-[0_0_8px_#34d399]" />
                </div>
                {/* Central pulsing core */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-bg-surface to-bg-card border border-gold-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,162,32,0.15)] z-10">
                  <ChefHat className="w-6 h-6 text-gold-primary animate-bounce" />
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <span className="text-[10px] font-bold text-gold-primary uppercase tracking-widest font-mono block">
                  Wellness Plan Generator
                </span>
                <h3 className="text-md font-extrabold text-text-headline">
                  {currentGeneratingDay !== null
                    ? `Crafting Day ${currentGeneratingDay} of 7`
                    : 'Designing Meal Recipes'}
                </h3>
                <p className="text-xs text-text-gold font-mono min-h-[40px] px-4 leading-relaxed">
                  {LOADING_TIPS[tipIndex]}
                </p>
              </div>

              {/* Loader progress bar simulation */}
              <div className="w-full max-w-xs mx-auto space-y-1.5 pt-2">
                <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: '100%', animation: 'pulse 1.5s infinite' }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-text-muted">
                  <span>AI PROJECTION LAYER</span>
                  <span className="animate-pulse">GENERATING...</span>
                </div>
              </div>
            </div>
          ) : mealPlans[activeDay] ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-text-gold uppercase tracking-widest font-mono">
                  Custom Day {activeDay} Recipes
                </h4>
                <button
                  onClick={() => generatePlanForDay(activeDay)}
                  className="text-[10px] text-text-muted hover:text-text-gold flex items-center transition font-mono border border-white/[0.06] px-2 py-1 rounded-md bg-bg-card"
                >
                  <RefreshCw className="w-2.5 h-2.5 mr-1" /> Regenerate Day {activeDay}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Condition: if fast plan or breakfast exists */}
                {mealPlans[activeDay].breakfast && mealPlans[activeDay].breakfast !== 'N/A' && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-gold-primary mb-2.5">
                        <Sun className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Breakfast</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].breakfast}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Breakfast', Math.round(metrics.calories * 0.25), Math.round(metrics.protein * 0.25))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+25%)</span>
                    </button>
                  </div>
                )}

                {mealPlans[activeDay].sehri && mealPlans[activeDay].sehri !== 'N/A' && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-indigo-400 mb-2.5">
                        <Moon className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Sehri (Pre-Dawn)</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].sehri}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Sehri', Math.round(metrics.calories * 0.45), Math.round(metrics.protein * 0.4))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+45%)</span>
                    </button>
                  </div>
                )}

                {mealPlans[activeDay].lunch && mealPlans[activeDay].lunch !== 'N/A' && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-amber-500 mb-2.5">
                        <Sun className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Lunch</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].lunch}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Lunch', Math.round(metrics.calories * 0.3), Math.round(metrics.protein * 0.3))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+30%)</span>
                    </button>
                  </div>
                )}

                {mealPlans[activeDay].snack && mealPlans[activeDay].snack !== 'N/A' && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-orange-400 mb-2.5">
                        <Sun className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Evening Snack</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].snack}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Snack', Math.round(metrics.calories * 0.15), Math.round(metrics.protein * 0.15))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+15%)</span>
                    </button>
                  </div>
                )}

                {mealPlans[activeDay].iftari && mealPlans[activeDay].iftari !== 'N/A' && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-gold-primary mb-2.5">
                        <Sun className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Iftari (Fasting break)</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].iftari}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Iftari', Math.round(metrics.calories * 0.25), Math.round(metrics.protein * 0.25))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+25%)</span>
                    </button>
                  </div>
                )}

                {mealPlans[activeDay].dinner && (
                  <div className="p-5 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-indigo-400 mb-2.5">
                        <Moon className="w-4 h-4" />
                        <h5 className="text-[10px] font-bold uppercase tracking-wider font-mono">Dinner</h5>
                      </div>
                      <p className="text-xs text-text-headline leading-relaxed">
                        {mealPlans[activeDay].dinner}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLogMealCalories('Dinner', Math.round(metrics.calories * 0.35), Math.round(metrics.protein * 0.35))}
                      className="mt-4 py-2 bg-white/[0.03] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] hover:border-gold-primary text-[10px] font-bold rounded-lg text-text-headline transition flex items-center justify-center space-x-1"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Log Calories (+35%)</span>
                    </button>
                  </div>
                )}
              </div>

              {mealPlans[activeDay].notes && (
                <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/20">
                  <span className="text-[10px] font-bold text-text-gold uppercase tracking-wider font-mono block">Day {activeDay} Healthy Reminders</span>
                  <p className="text-xs text-text-body mt-2 leading-relaxed">
                    {mealPlans[activeDay].notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-bg-card border border-white/[0.06] shadow-card text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary mx-auto border border-gold-primary/20">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-headline">Day {activeDay} Food Plan Empty</h3>
              <p className="text-xs text-text-body leading-relaxed">
                Configure your preference styles above and click "Make My Plan" to create the recipe cards for Day {activeDay}.
              </p>
            </div>
          )}

          {/* Saved/Archived Plans History Section */}
          <div className="p-6 rounded-2xl bg-bg-card border border-white/[0.06] shadow-card space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-text-headline">
                <FolderOpen className="w-5 h-5 text-gold-primary" />
                <h4 className="text-sm font-extrabold font-sans uppercase tracking-wider">
                  Saved 7-Day Food Plans Archive
                </h4>
              </div>
              <span className="text-[10px] bg-white/[0.03] text-text-muted px-2.5 py-1 rounded-full font-mono font-bold">
                {savedMealPlans.length} Archived
              </span>
            </div>
            
            <p className="text-xs text-text-muted leading-relaxed">
              Store snapshots of your active custom meal weeks to switch back and forth between weight loss, muscle gain, or custom holiday weeks instantly.
            </p>

            {savedMealPlans.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted font-mono border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                <Calendar className="w-5 h-5 mx-auto opacity-20 mb-2" />
                <span>No saved plans in your history yet. Click "Save/Archive Plan" above to create an archive.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                {savedMealPlans.map((plan) => {
                  const dayCount = Object.keys(plan.days).length;
                  return (
                    <div 
                      key={plan.id}
                      className="p-3.5 rounded-xl bg-bg-surface border border-white/[0.04] hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-text-headline">
                            {plan.name}
                          </span>
                          <span className="text-[9px] font-mono text-text-gold bg-gold-primary/10 px-1.5 py-0.5 rounded font-bold">
                            {dayCount} Days Active
                          </span>
                        </div>
                        <span className="text-[10px] text-text-muted block font-mono">
                          Saved: {plan.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleRestoreSavedPlan(plan)}
                          className="py-1.5 px-3 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Load Plan</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSavedPlan(plan.id, plan.name)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/10 transition"
                          title="Delete plan from archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* D. MAIN TAB: LOOK UP FOOD */}
      {activeTab === 'lookup' && !secondaryTab && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-md font-bold text-text-headline flex items-center">
              <Search className="w-5 h-5 mr-2 text-gold-primary" /> Traditional Food Directory
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Instantly find common local food ingredients. See details and track them.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search food (e.g. roti, biryani, daal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-card border border-white/[0.06] rounded-xl p-3 pl-10 text-xs text-text-headline focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-text-muted" />
          </div>

          {/* INTERACTIVE HEALTHY PLATE WIDGET */}
          <div className="p-5 rounded-2xl bg-bg-card border border-purple-500/15 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-grow text-left space-y-2">
              <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-widest font-mono block">Plate Composition</span>
              <h3 className="text-md font-bold text-text-headline">Interactive portion composition</h3>
              <p className="text-[10px] text-text-body leading-relaxed">
                Add foods below to see them fill your plate sections. Try to hit the balance target!
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold border border-emerald-500/25">Fibers: {plateComposition.fibers}%</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono font-bold border border-purple-500/25">Protein: {plateComposition.protein}%</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/25">Carbs: {plateComposition.carbs}%</span>
              </div>
            </div>

            <div className="w-28 h-28 shrink-0 relative flex items-center justify-center bg-bg-deep/40 rounded-full border border-white/[0.04]">
              {/* SVG plate segments representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Plate outer border */}
                <circle cx="50" cy="50" r="46" className="fill-none stroke-white/[0.08] stroke-[3]" />
                <circle cx="50" cy="50" r="41" className="fill-none stroke-white/[0.04] stroke-[1]" />
                
                {/* 1. Fiber segment (180deg = half the plate, from angle 0 to 180) */}
                <path 
                  d="M50,50 L91,50 A41,41 0 0,1 9,50 Z" 
                  className="transition-all duration-500"
                  fill={plateComposition.fibers > 0 ? "rgba(16, 185, 129, 0.35)" : "transparent"} 
                  stroke="#10B981" 
                  strokeWidth="1.5"
                />
                
                {/* 2. Protein segment (90deg = quarter, from angle 180 to 270) */}
                <path 
                  d="M50,50 L9,50 A41,41 0 0,1 50,91 Z" 
                  className="transition-all duration-500"
                  fill={plateComposition.protein > 0 ? "rgba(124, 58, 237, 0.35)" : "transparent"} 
                  stroke="#7C3AED" 
                  strokeWidth="1.5"
                />
                
                {/* 3. Carbs segment (90deg = quarter, from angle 270 to 360) */}
                <path 
                  d="M50,50 L50,91 A41,41 0 0,1 91,50 Z" 
                  className="transition-all duration-500"
                  fill={plateComposition.carbs > 0 ? "rgba(245, 158, 11, 0.35)" : "transparent"} 
                  stroke="#F59E0B" 
                  strokeWidth="1.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[7px] font-extrabold font-mono text-text-headline uppercase tracking-wider block">Portions</span>
                <button 
                  onClick={resetPlate}
                  className="text-[7px] font-mono font-bold text-purple-300/80 hover:text-purple-350 cursor-pointer pt-0.5 hover:underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Directory food list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredFoods.map((food) => (
              <div key={food.id} className="p-4 rounded-xl bg-bg-card border border-white/[0.06] flex flex-col justify-between hover:border-gold-primary/20 transition group">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-bold bg-bg-surface px-2 py-0.5 rounded-md text-text-muted group-hover:text-text-gold transition">
                      {food.category}
                    </span>
                    <button
                      onClick={() => toggleFavorite(food.id)}
                      className="text-text-muted hover:text-rose-500 transition p-0.5"
                    >
                      <Heart className={`w-4 h-4 ${favoriteIds.includes(food.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-headline">{food.name}</h4>
                    <p className="text-[10px] text-text-body mt-1 leading-normal font-sans">
                      {food.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[13px] font-mono font-bold text-text-gold block">{food.calories} <span className="text-[9px] font-normal text-text-muted">kcal</span></span>
                    <span className="text-[10px] font-mono text-text-headline block">Prot: {food.protein}g</span>
                  </div>

                  <button
                    onClick={() => { handleLogMealCalories(food.name, food.calories, food.protein); addFoodToPlate(food.category); }}
                    className="py-1.5 px-3 bg-white/[0.04] hover:bg-gold-primary hover:text-bg-deep border border-white/[0.06] rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Log Food</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredFoods.length === 0 && (
              <div className="col-span-full text-center p-8 text-xs text-text-muted">
                No food items match your query. Try searching for other traditional foods.
              </div>
            )}
          </div>
        </div>
      )}

      {/* E. MAIN TAB: TAKE FOOD PHOTO */}
      {activeTab === 'photo' && !secondaryTab && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="border-b border-slate-200/80 pb-3">
            <h3 className="text-md font-bold text-text-headline flex items-center">
              <Camera className="w-5 h-5 mr-2 text-purple-600" /> AI Food Snap Scanner
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Verify your portion targets. Tap any of the preloaded food card placeholders below to simulate our instant green laser AI nutritional scanning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Interactive AI Scan Console */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between min-h-[320px] relative overflow-hidden">
              {/* Scan Screen Frame */}
              <div className="relative w-full h-48 bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden flex items-center justify-center">
                {scanningPhoto ? (
                  <>
                    {/* Active Scan Laser Effect */}
                    <div className="absolute inset-0 bg-emerald-500/5 z-10"></div>
                    <div className="absolute left-0 right-0 h-1.5 bg-emerald-500 shadow-[0_0_12px_#10B981] z-20 animate-laser-scan"></div>
                    <div className="text-center z-10 space-y-2">
                      <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mx-auto"></div>
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider font-mono">Analyzing Food Matrix...</span>
                    </div>
                  </>
                ) : scannedResult ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-emerald-500/[0.01]">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mb-2 animate-bounce" />
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Analysis Complete</span>
                    <strong className="text-xs text-text-headline mt-1.5">{scannedResult.name}</strong>
                    <span className="text-[10px] text-emerald-650 font-bold font-mono mt-0.5">{scannedResult.calories} kcal</span>
                  </div>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-text-muted border border-slate-200/55 mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-headline">No Meal Selected</h4>
                      <p className="text-[10px] text-text-muted">
                        Select one of the three food placeholders on the right to start a simulated scan.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer inside console */}
              <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-text-muted text-center leading-normal">
                {scanningPhoto ? (
                  <span className="font-mono text-emerald-600 animate-pulse font-bold">Status: Calibrating density matrices...</span>
                ) : scannedResult ? (
                  <span className="text-emerald-700 font-bold flex items-center justify-center"><Check className="w-3.5 h-3.5 mr-1" /> Logged values updated in dashboard!</span>
                ) : (
                  <span>Select a meal from the presets to run the AI food scanner.</span>
                )}
              </div>
            </div>

            {/* Right Column: Clickable Food Card Placeholders */}
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Tap a Placeholder to Scan:</span>
              
              <div className="space-y-3">
                {[
                  {
                    key: "lentil",
                    name: "Lentil Soup",
                    fullName: "Traditional Moong Daal Soup + Garden Kachi Salad",
                    calories: 320,
                    protein: 14,
                    carbs: 42,
                    fat: 6,
                    desc: "Moong Daal & Salad portion.",
                    notes: "Traditional Moong Daal Soup + Garden Kachi Salad. Rich in soluble fibers and plant protein. Very low oil impact."
                  },
                  {
                    key: "oats",
                    name: "Oats & Fruits",
                    fullName: "Multigrain Oats with Apples and Honey",
                    calories: 290,
                    protein: 9,
                    carbs: 54,
                    fat: 4,
                    desc: "Rich in beta-glucan grain fiber.",
                    notes: "High in oat beta-glucan fiber which helps stabilize morning blood sugar levels."
                  },
                  {
                    key: "chicken",
                    name: "Tandoori Chicken Salad",
                    fullName: "Grilled Skinless Chicken Kebab Salad",
                    calories: 410,
                    protein: 32,
                    carbs: 18,
                    fat: 12,
                    desc: "High protein muscle rebuild meal.",
                    notes: "Grilled Skinless Chicken Kebab. High protein, moderate fat. Excellent muscle conditioning meal."
                  }
                ].map((demo) => {
                  const isSelected = scannedResult?.name === demo.fullName;
                  return (
                    <button
                      key={demo.key}
                      onClick={() => {
                        setScanningPhoto(true);
                        setScannedResult(null);
                        setTimeout(() => {
                          setScanningPhoto(false);
                          setScannedResult({
                            name: demo.fullName,
                            calories: demo.calories,
                            protein: demo.protein,
                            carbs: demo.carbs,
                            fat: demo.fat,
                            notes: demo.notes
                          });
                        }, 1800);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition active:scale-[0.98] ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/20 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-350'
                      }`}
                      disabled={scanningPhoto}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-text-headline flex items-center gap-1.5">
                          {demo.name}
                          <span className="text-[8px] font-mono text-purple-700 bg-purple-100/60 px-1.5 py-0.25 rounded font-bold">{demo.calories} kcal</span>
                        </h4>
                        <p className="text-[10px] text-text-body mt-0.5">{demo.fullName}</p>
                        <span className="text-[8.5px] text-text-muted font-mono block mt-1">Prot: {demo.protein}g · Carbs: {demo.carbs}g · Fats: {demo.fat}g</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Scan Results Screen */}
          {scannedResult && !scanningPhoto && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/65 shadow-md space-y-4 animate-fade-in text-left">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">Analysis Confirmed</span>
                  <h4 className="text-sm font-bold text-text-headline mt-1.5">{scannedResult.name}</h4>
                </div>
                <span className="text-base font-mono font-bold text-purple-700">{scannedResult.calories} kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block font-mono">Protein</span>
                  <span className="text-xs font-bold text-text-headline font-mono">{scannedResult.protein}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block font-mono">Carbs</span>
                  <span className="text-xs font-bold text-text-headline font-mono">{scannedResult.carbs}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block font-mono">Fats</span>
                  <span className="text-xs font-bold text-text-headline font-mono">{scannedResult.fat}g</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <Info className="w-4 h-4 text-purple-650 mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-body leading-relaxed">
                  {scannedResult.notes}
                </p>
              </div>

              <button
                onClick={() => handleLogMealCalories(scannedResult.name, scannedResult.calories, scannedResult.protein)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 shadow-sm active:scale-95"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Log to Daily Totals</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* F. MAIN TAB: RAMADAN HEALTH HELPER */}
      {activeTab === 'ramadan' && !secondaryTab && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="border-b border-white/[0.06] pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-text-headline flex items-center">
                <Moon className="w-5 h-5 mr-2 text-gold-primary" /> Ramadan Health Helper
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Stay hydrated, clear-minded, and energetic while fasting in hot Pakistani summers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hydration tracker */}
            <div className="p-5 rounded-2xl bg-bg-card border border-white/[0.06] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-text-headline">Hydration Timeline Scheduler</h4>
                  <span className="text-[10px] text-text-muted leading-relaxed block">Tap glass checkpoints to complete your hydration targets between sunset and dawn.</span>
                </div>
                <span className="text-sm font-mono font-bold text-text-gold shrink-0">{ramadanWaterGlasses} / 8 <span className="text-[9px] font-normal text-text-muted">cups</span></span>
              </div>

              {/* Vertical Interactive Timeline */}
              <div className="space-y-2 pt-2 text-left max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {[
                  { glassNum: 1, time: "7:15 PM", event: "Iftari (Break Fast)" },
                  { glassNum: 2, time: "7:45 PM", event: "After Maghrib Prayer" },
                  { glassNum: 3, time: "8:30 PM", event: "Before Isha / Taraweeh" },
                  { glassNum: 4, time: "10:00 PM", event: "After Isha / Taraweeh" },
                  { glassNum: 5, time: "11:30 PM", event: "Late Night Water Check" },
                  { glassNum: 6, time: "1:00 AM", event: "Before Winding Down" },
                  { glassNum: 7, time: "3:30 AM", event: "Suhoor Waking Cup" },
                  { glassNum: 8, time: "4:15 AM", event: "Sehri (Before Fast Begins)" }
                ].map((item) => {
                  const completed = item.glassNum <= ramadanWaterGlasses;
                  return (
                    <div
                      key={item.glassNum}
                      onClick={() => {
                        setRamadanWaterGlasses(item.glassNum);
                        localStorage.setItem(`ramadan_water_${profile.name}`, item.glassNum.toString());
                        showLogToast(`Logged Glass ${item.glassNum} completed!`);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                        completed
                          ? 'border-purple-500/30 bg-purple-950/20 shadow-sm'
                          : 'border-white/[0.04] bg-bg-surface/50 hover:border-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          completed ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-text-muted border border-white/10'
                        }`}>
                          {item.glassNum}
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold block ${completed ? 'text-purple-300' : 'text-text-headline'}`}>
                            {item.event}
                          </span>
                          <span className="text-[9px] text-text-muted font-mono">{item.time} schedule</span>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        completed ? 'border-purple-500 bg-purple-600/20 text-purple-300' : 'border-white/20'
                      }`}>
                        {completed && <span className="text-[9px]">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-2 pt-1 border-t border-white/[0.04]">
                <button
                  onClick={() => {
                    const nextVal = Math.min(8, ramadanWaterGlasses + 1);
                    setRamadanWaterGlasses(nextVal);
                    localStorage.setItem(`ramadan_water_${profile.name}`, nextVal.toString());
                    showLogToast("Logged 1 glass of water!");
                  }}
                  className="flex-grow py-2 bg-purple-600 hover:bg-purple-500 text-purple-50 text-xs font-bold rounded-xl transition"
                >
                  Quick Add +1 Cup
                </button>
                <button
                  onClick={resetRamadanWater}
                  className="px-4 py-2 hover:bg-white/[0.04] text-text-muted text-xs font-mono rounded-xl transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Health rules list */}
            <div className="p-5 rounded-2xl bg-bg-card border border-white/[0.06] space-y-4">
              <h4 className="text-xs font-bold text-text-headline flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5 text-text-gold" /> Summer Fasting Dehydration Alert
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-start space-x-2.5">
                  <div className="p-1 rounded-md bg-yellow-500/10 text-yellow-500 mt-0.5">
                    ⚠️
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-text-headline">Warning Signs:</h5>
                    <p className="text-[10px] text-text-body mt-0.5 leading-relaxed font-sans">
                      Dark tea-colored urine, strong headaches, severe dry mouth, and confusion.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-start space-x-2.5">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
                    💡
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-text-headline">Sehri Advice:</h5>
                    <p className="text-[10px] text-text-body mt-0.5 leading-relaxed font-sans">
                      Eat slow-release carbs like barley porridge. Avoid tea as it causes water loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* G. MAIN TAB: COMPARE FOODS */}
      {activeTab === 'compare' && !secondaryTab && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-md font-bold text-text-headline flex items-center">
              <ArrowLeftRight className="w-5 h-5 mr-2 text-gold-primary" /> Comparative Nutrition Dashboard
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Analyze macro budgets and health grades of traditional Pakistani ingredients side-by-side.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bg-card border border-white/[0.06] space-y-6">
            
            {/* Selection Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">First Food Item:</label>
                <select
                  value={foodAId}
                  onChange={(e) => setFoodAId(e.target.value)}
                  className="w-full bg-bg-surface border border-white/[0.06] rounded-xl p-3 text-xs text-text-headline focus:outline-none focus:border-gold-primary transition"
                >
                  {PAKISTANI_FOODS_DB.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block font-mono">Second Food Item:</label>
                <select
                  value={foodBId}
                  onChange={(e) => setFoodBId(e.target.value)}
                  className="w-full bg-bg-surface border border-white/[0.06] rounded-xl p-3 text-xs text-text-headline focus:outline-none focus:border-gold-primary transition"
                >
                  {PAKISTANI_FOODS_DB.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Food A Card */}
              <div className="p-4 rounded-xl bg-bg-surface border border-white/[0.04] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-text-gold bg-gold-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      {foodA.category || 'Food Item'}
                    </span>
                    <h4 className="text-sm font-extrabold text-text-headline mt-1">{foodA.name}</h4>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                    (foodA.healthGrade || 'B').startsWith('A') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    (foodA.healthGrade || 'B').startsWith('B') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    (foodA.healthGrade || 'B').startsWith('C') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {foodA.healthGrade || 'B'}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed italic">"{foodA.description}"</p>

                {/* Macro Progress Bars */}
                <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-muted">Calories</span>
                      <span className="font-mono text-text-headline font-bold">{foodA.calories} kcal</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (foodA.calories / 600) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-muted">Protein</span>
                      <span className="font-mono text-text-headline font-bold">{foodA.protein}g</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (foodA.protein / 35) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Carbs</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodA.carbs}g</span>
                    </div>
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Fat</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodA.fat}g</span>
                    </div>
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Fiber</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodA.fiber || 0}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Food B Card */}
              <div className="p-4 rounded-xl bg-bg-surface border border-white/[0.04] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      {foodB.category || 'Food Item'}
                    </span>
                    <h4 className="text-sm font-extrabold text-text-headline mt-1">{foodB.name}</h4>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                    (foodB.healthGrade || 'B').startsWith('A') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    (foodB.healthGrade || 'B').startsWith('B') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    (foodB.healthGrade || 'B').startsWith('C') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {foodB.healthGrade || 'B'}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed italic">"{foodB.description}"</p>

                {/* Macro Progress Bars */}
                <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-muted">Calories</span>
                      <span className="font-mono text-text-headline font-bold">{foodB.calories} kcal</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (foodB.calories / 600) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-muted">Protein</span>
                      <span className="font-mono text-text-headline font-bold">{foodB.protein}g</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (foodB.protein / 35) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Carbs</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodB.carbs}g</span>
                    </div>
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Fat</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodB.fat}g</span>
                    </div>
                    <div className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-text-muted block">Fiber</span>
                      <span className="text-text-headline font-bold block mt-0.5">{foodB.fiber || 0}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dietitian Smart Recommendation Panel */}
            <div className="p-5 rounded-2xl bg-gold-primary/[0.02] border border-gold-primary/10 space-y-3">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-text-gold" />
                <span className="text-xs font-bold text-text-gold uppercase tracking-wider font-mono">Clinical Dietitian Verdict</span>
              </div>
              <p className="text-xs text-text-body leading-relaxed font-sans">
                {getComparisonTip(foodA, foodB)}
              </p>

              {/* Dynamic Actionable Swap Suggestion */}
              {((foodA.healthGrade || 'B').startsWith('D') || (foodA.healthGrade || 'B').startsWith('F') || (foodB.healthGrade || 'B').startsWith('D') || (foodB.healthGrade || 'B').startsWith('F')) && (
                <div className="mt-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/10 flex items-start space-x-2.5">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider font-mono block">Recommended Swap Action:</span>
                    <p className="text-xs text-text-body mt-1 leading-relaxed">
                      You are comparing items with lower health grades (Grades D/F). Swap fried treats or simple refined carb flatbreads for whole grains like <strong className="text-text-headline">Whole-wheat Roti (Grade A)</strong> or roasted chicken options to reduce oil loads by up to 15g fat per meal!
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
