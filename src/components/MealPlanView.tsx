/**
 * MealPlanView.tsx — Blended Wellness Meals Page
 * ═══════════════════════════════════════════════
 *
 * Visual blend:
 *   - MyFitnessPal: clean diary-style meal list, simple macro totals
 *   - Noom: green/yellow/orange color-coded food groups, encouraging copy, coach tone
 *   - Headspace: rounded shapes, calm gradients, generous whitespace, micro-animations
 */

import React, { useState, useEffect, useRef } from 'react';
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
  FolderOpen,
  Upload
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
  const [activeTab, setActiveTab] = useState<'7day' | 'lookup' | 'photo' | 'ramadan' | 'compare' | 'cooking' | 'favorites' | 'past_plans'>('7day');
  const [expandedRecipeIdx, setExpandedRecipeIdx] = useState<number | null>(null);

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
  const [lookupMealSlot, setLookupMealSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [searchedOnce, setSearchedOnce] = useState(false);

  // Compare Foods states
  const [compareFoodA, setCompareFoodA] = useState('');
  const [compareFoodB, setCompareFoodB] = useState('');
  const [comparingFoods, setComparingFoods] = useState(false);
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Easy Cooking Guide (Recipe Generator) states
  const [recipeGoal, setRecipeGoal] = useState<'Fat Loss' | 'Muscle Gain' | 'Stay Fit'>('Fat Loss');
  const [recipeCategory, setRecipeCategory] = useState('Lunch');
  const [recipeStyle, setRecipeStyle] = useState<'Strictly Desi' | 'Desi Fusion' | 'Home-Cooked'>('Home-Cooked');
  const [recipeCalories, setRecipeCalories] = useState(500);
  const [recipeProtein, setRecipeProtein] = useState(25);
  const [recipeTime, setRecipeTime] = useState(30);
  const [recipeAllergies, setRecipeAllergies] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  // Photo Scan
  const [scanningPhoto, setScanningPhoto] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'gallery'>('gallery');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedMealSlot, setSelectedMealSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        savePastPlanSnapshot({
          type: 'weekly_plan',
          title: `AI Weekly Plan - ${new Date().toLocaleDateString()}`,
          data: tempPlans
        });
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

  const startCamera = async () => {
    setScanError(null);
    setCameraActive(true);
    setCapturedImage(null);
    setScannedResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setScanError("Unable to access camera. Please check permissions or upload an image instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanError(null);
      setScannedResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanFoodPhoto = async () => {
    if (!capturedImage) {
      setScanError("Please capture an image or upload a file first.");
      return;
    }

    setScanningPhoto(true);
    setScanError(null);
    setScannedResult(null);

    try {
      const response = await fetch('/api/scan-food-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: capturedImage,
          assignedMealSlot: selectedMealSlot
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Couldn't identify this photo, try again or search manually.");
      }

      if (data.scanResult) {
        setScannedResult({
          name: data.scanResult.foodName,
          calories: data.scanResult.calories,
          protein: data.scanResult.protein,
          carbs: data.scanResult.carbs,
          fat: data.scanResult.fat,
          notes: data.scanResult.notes,
          confidence: data.scanResult.confidence
        });
        showLogToast(`Analysis ready for ${data.scanResult.foodName}! 🔍`);
      } else {
        throw new Error("Couldn't identify this photo, try again or search manually.");
      }
    } catch (err: any) {
      console.error("Scan photo error:", err);
      setScanError(err?.message || "Couldn't identify this photo, try again or search manually.");
    } finally {
      setScanningPhoto(false);
    }
  };

  // Camera cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleLookupFood = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    setSearchedOnce(true);

    try {
      const response = await fetch('/api/lookup-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          assignedMealSlot: lookupMealSlot
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Couldn't identify this food, try again or search manually.");
      }

      if (data.scanResult) {
        setLookupResult({
          name: data.scanResult.foodName,
          calories: data.scanResult.calories,
          protein: data.scanResult.protein,
          carbs: data.scanResult.carbs,
          fat: data.scanResult.fat,
          notes: data.scanResult.notes,
          confidence: data.scanResult.confidence,
          source: data.source
        });
        showLogToast(`Found details for "${data.scanResult.foodName}"! 🔍`);
      } else {
        throw new Error("Couldn't identify this food, try again or search manually.");
      }
    } catch (err: any) {
      console.error("Lookup food error:", err);
      setLookupError(err?.message || "Couldn't identify this food, try again or search manually.");
    } finally {
      setLookupLoading(false);
    }
  };

  // Persistence state hooks (local storage with placeholder backend comment)
  const [customFavorites, setCustomFavorites] = useState<{ id: string; type: 'food' | 'recipe' | 'meal'; name: string; calories: number; protein: number; carbs?: number; fat?: number; notes?: string; recipe?: any }[]>(() => {
    // Real backend persistence: fetch from database using GET /api/favorites
    const saved = localStorage.getItem(`hch_custom_favorites_${profile.name}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [pastPlans, setPastPlans] = useState<{ id: string; timestamp: string; type: 'weekly_plan' | 'recipe'; name: string; data: any }[]>(() => {
    // Real backend persistence: fetch from database using GET /api/past-plans
    const saved = localStorage.getItem(`hch_past_plans_${profile.name}`);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleCustomFavorite = (item: { type: 'food' | 'recipe' | 'meal'; name: string; calories: number; protein: number; carbs?: number; fat?: number; notes?: string; recipe?: any }) => {
    // Real backend persistence: POST /api/favorites/toggle
    const exists = customFavorites.find(f => f.name === item.name);
    let updated;
    if (exists) {
      updated = customFavorites.filter(f => f.name !== item.name);
      showLogToast(`Removed "${item.name}" from favorites.`);
    } else {
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        ...item
      };
      updated = [...customFavorites, newItem];
      showLogToast(`Added "${item.name}" to favorites! ❤️`);
    }
    setCustomFavorites(updated);
    localStorage.setItem(`hch_custom_favorites_${profile.name}`, JSON.stringify(updated));
  };

  const savePastPlanSnapshot = (snapshot: { type: 'weekly_plan' | 'recipe'; title: string; data: any }) => {
    // Real backend persistence: POST /api/past-plans
    const newSnapshot = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(),
      type: snapshot.type,
      name: snapshot.title,
      data: snapshot.data
    };
    const updated = [newSnapshot, ...pastPlans];
    setPastPlans(updated);
    localStorage.setItem(`hch_past_plans_${profile.name}`, JSON.stringify(updated));
  };

  const handleCompareFoods = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!compareFoodA.trim() || !compareFoodB.trim()) return;

    setComparingFoods(true);
    setCompareError(null);
    setCompareResult(null);

    try {
      const response = await fetch('/api/compare-foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodA: compareFoodA,
          foodB: compareFoodB
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to compare foods.");
      }

      if (data.comparisonResult) {
        setCompareResult(data.comparisonResult);
        showLogToast("Comparison complete! 📊");
      } else {
        throw new Error("Failed to compare foods.");
      }
    } catch (err: any) {
      console.error("Compare foods error:", err);
      setCompareError(err?.message || "Failed to compare foods. Please try again.");
    } finally {
      setComparingFoods(false);
    }
  };

  const handleGenerateRecipe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setGeneratingRecipe(true);
    setRecipeError(null);
    setGeneratedRecipe(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryGoal: recipeGoal,
          mealCategory: recipeCategory,
          cuisineStyle: recipeStyle,
          caloriesGoal: recipeCalories,
          minProteinTarget: recipeProtein,
          maxCookingTime: recipeTime,
          allergies: recipeAllergies,
          onHandIngredients: recipeIngredients
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      if (data.recipe) {
        setGeneratedRecipe(data.recipe);
        showLogToast("Recipe generated successfully! 🍳");
        
        // Save to past plans snapshot
        savePastPlanSnapshot({
          type: 'recipe',
          title: data.recipe.title,
          data: data.recipe
        });
      } else {
        throw new Error("Failed to generate recipe.");
      }
    } catch (err: any) {
      console.error("Generate recipe error:", err);
      setRecipeError(err?.message || "Failed to generate recipe. Please try again.");
    } finally {
      setGeneratingRecipe(false);
    }
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
          SUB-NAVIGATION TAB BAR — Horizontal Scroll, Pill Buttons
         ═══════════════════════════════════════════════════════ */}
      <div 
        className="hch-animate-in" 
        style={{ 
          display: 'flex', 
          gap: spacing[8], 
          overflowX: 'auto', 
          paddingBottom: spacing[8],
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE 10+ */
          WebkitOverflowScrolling: 'touch',
          borderBottom: `1px solid ${colors.success}20`,
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          div::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {[
          { id: '7day', label: '7-Day Food Plan', icon: Calendar },
          { id: 'lookup', label: 'Look Up Food', icon: Search },
          { id: 'photo', label: 'Take Food Photo', icon: Camera },
          { id: 'ramadan', label: 'Ramadan Health Helper', icon: Moon },
          { id: 'compare', label: 'Compare Foods', icon: ArrowLeftRight },
          { id: 'cooking', label: 'Easy Cooking Guide', icon: ChefHat },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'past_plans', label: 'Past Plans', icon: FolderOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: `${spacing[8]} ${spacing[16]}`,
                borderRadius: radii.button,
                border: isActive ? `2px solid ${colors.accent}` : `1.5px solid ${colors.success}30`,
                background: isActive ? colors.accent : colors.white,
                color: isActive ? colors.white : colors.muted,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[8],
                fontWeight: 600,
                fontSize: fontSizes.xs,
                fontFamily: fonts.body,
                transition: 'all 0.25s ease',
                boxShadow: isActive ? shadows.card : 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Icon size={14} style={tab.id === 'favorites' && isActive ? { fill: colors.white } : {}} />
              <span>{tab.label}</span>
            </button>
          );
        })}
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
          B. FAVOURITES
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'favorites' && (
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
      {activeTab === '7day' && (
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
                          <div style={{ display: 'flex', gap: spacing[8], alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => toggleCustomFavorite({
                                type: 'meal',
                                name: `${meal.label}: ${meal.text.substring(0, 30)}${meal.text.length > 30 ? '...' : ''}`,
                                calories: cal,
                                protein: prot,
                                carbs: 0,
                                fat: 0,
                                notes: meal.text
                              })}
                              style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: customFavorites.some(f => f.name.startsWith(`${meal.label}:`)) ? '#e54d2e' : colors.muted, transition: 'transform 0.1s' }}
                            >
                              <Heart size={16} style={{ fill: customFavorites.some(f => f.name.startsWith(`${meal.label}:`)) ? '#e54d2e' : 'none' }} />
                            </button>
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


        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          D. LOOK UP FOODS — AI & Local Database Lookup
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'lookup' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Search size={20} color={colors.primary} /> Food Directory & AI Lookup
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Search traditional foods in English or Urdu script to fetch instant calorie & macronutrient estimates. 🥗
            </p>
          </div>

          {/* Search form & Slot Selector */}
          <form onSubmit={(e) => handleLookupFood(e)} style={{ ...sectionCard, padding: spacing[16], display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(140px, auto)', gap: spacing[12] }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Search Food Item</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search Desi foods (e.g. Dal Chawal, دال چاول, Roti)…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '40px', width: '100%' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.muted }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Meal Slot</label>
                <select
                  value={lookupMealSlot}
                  onChange={(e) => setLookupMealSlot(e.target.value as any)}
                  style={{ ...inputStyle, minWidth: '130px' }}
                >
                  <option value="Breakfast">Breakfast 🍳</option>
                  <option value="Lunch">Lunch 🍛</option>
                  <option value="Dinner">Dinner 🍲</option>
                  <option value="Snack">Snack 🍎</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={lookupLoading || !searchQuery.trim()}
              className="hch-btn hch-btn--primary"
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[8] }}
            >
              <Search size={14} /> {lookupLoading ? 'Searching database & AI…' : 'Look Up Nutrition'}
            </button>
          </form>

          {/* Result view */}
          {lookupLoading ? (
            <div style={{
              ...sectionCard,
              padding: spacing[48],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: '#fcfbf9'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: `3px solid ${colors.success}30`,
                borderTop: `3px solid ${colors.primary}`,
                animation: 'hch-ring-fill 1s linear infinite',
                marginBottom: spacing[16]
              }} />
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Searching Foods…</h4>
              <p style={{ fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing[4] }}>Checking local database and running AI estimates</p>
            </div>
          ) : lookupError ? (
            <div style={{ ...sectionCard, background: '#fef2f2', border: '1px solid #fecaca', padding: spacing[20], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: '#b91c1c', margin: 0 }}>Lookup Error</h5>
                <p style={{ fontSize: fontSizes.xs, color: '#b91c1c', lineHeight: 1.5, margin: `${spacing[4]} 0 0` }}>{lookupError}</p>
              </div>
            </div>
          ) : lookupResult ? (
            /* Result Panel */
            <div className="hch-animate-in" style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: spacing[8] }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[6], flexWrap: 'wrap' }}>
                    {lookupResult.source === 'local' ? (
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.primary, background: `${colors.primary}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Local Match</span>
                    ) : (
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, background: `${colors.accent}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>AI Estimated</span>
                    )}
                    {lookupResult.confidence !== undefined && (
                      <span style={{ fontSize: '0.625rem', color: colors.muted }}>({Math.round(lookupResult.confidence * 100)}% Match)</span>
                    )}
                  </div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: `${spacing[4]} 0 0` }}>{lookupResult.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: spacing[12], alignItems: 'center' }}>
                  <span style={{ fontSize: fontSizes.base, fontWeight: 800, color: colors.accent }}>{lookupResult.calories} kcal</span>
                  <button
                    type="button"
                    onClick={() => toggleCustomFavorite({
                      type: 'food',
                      name: lookupResult.name,
                      calories: lookupResult.calories,
                      protein: lookupResult.protein,
                      carbs: lookupResult.carbs,
                      fat: lookupResult.fat,
                      notes: lookupResult.notes
                    })}
                    style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', color: customFavorites.some(f => f.name === lookupResult.name) ? '#e54d2e' : colors.muted, transition: 'transform 0.1s' }}
                  >
                    <Heart size={20} style={{ fill: customFavorites.some(f => f.name === lookupResult.name) ? '#e54d2e' : 'none' }} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, margin: 0 }}>"{lookupResult.notes}"</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[8], borderTop: `1px solid ${colors.success}15`, paddingTop: spacing[12] }}>
                {[
                  { label: 'Protein', value: `${lookupResult.protein}g`, color: colors.primary },
                  { label: 'Carbs', value: `${lookupResult.carbs}g`, color: colors.accent },
                  { label: 'Fat', value: `${lookupResult.fat}g`, color: colors.text },
                ].map((macro) => (
                  <div key={macro.label} style={{ textAlign: 'center', padding: '8px', background: colors.background, borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block' }}>{macro.label}</span>
                    <strong style={{ fontSize: fontSizes.xs, color: macro.color, display: 'block', marginTop: '2px' }}>{macro.value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: spacing[8], marginTop: spacing[4] }}>
                <button
                  type="button"
                  onClick={() => handleLogMealCalories(`${lookupMealSlot}: ${lookupResult.name}`, lookupResult.calories, lookupResult.protein)}
                  className="hch-btn hch-btn--primary"
                  style={{ flex: 1, padding: '10px 16px', fontSize: fontSizes.xs }}
                >
                  <Plus size={12} /> Log to {lookupMealSlot}
                </button>
                <button
                  type="button"
                  onClick={() => { setLookupResult(null); setSearchQuery(''); }}
                  className="hch-btn hch-btn--ghost"
                  style={{ fontSize: fontSizes.xs }}
                >
                  Reset Search
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div style={{
              ...sectionCard,
              textAlign: 'center',
              padding: spacing[48],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing[16]
            }}>
              <div style={{ fontSize: '3rem' }}>🔍🥗</div>
              <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 600, color: colors.text, margin: 0 }}>
                Ready to search Pakistani & Fusion foods
              </h3>
              <p style={{ fontSize: fontSizes.xs, color: colors.muted, margin: 0, maxWidth: '340px', lineHeight: 1.6 }}>
                Type a food item in English or Urdu script. We'll search our local database first, then query Gemini AI for macro and calorie estimates.
              </p>

              <div style={{ borderTop: `1px solid ${colors.success}10`, width: '100%', paddingTop: spacing[16], marginTop: spacing[8] }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: colors.primary, textTransform: 'uppercase', display: 'block', marginBottom: spacing[8] }}>Quick Demo Searches</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8], justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery('roti'); setLookupMealSlot('Lunch'); setTimeout(() => {
                      const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                      if (btn) btn.click();
                    }, 50); }}
                    className="hch-btn hch-btn--outline"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    Roti (Hits Local DB 🏠)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery('Haleem'); setLookupMealSlot('Dinner'); setTimeout(() => {
                      const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                      if (btn) btn.click();
                    }, 50); }}
                    className="hch-btn hch-btn--outline"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    Haleem (Hits Local DB 🏠)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery('Halwa Puri'); setLookupMealSlot('Breakfast'); setTimeout(() => {
                      const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                      if (btn) btn.click();
                    }, 50); }}
                    className="hch-btn hch-btn--outline"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    Halwa Puri (Hits Gemini AI 🤖)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery('دال چاول'); setLookupMealSlot('Lunch'); setTimeout(() => {
                      const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                      if (btn) btn.click();
                    }, 50); }}
                    className="hch-btn hch-btn--outline"
                    style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                  >
                    دال چاول (Urdu - Hits Gemini AI 🤖)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}



      {/* ═══════════════════════════════════════════════════════
          F. RAMADAN HEALTH HELPER
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'ramadan' && (
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
      {activeTab === 'compare' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <ArrowLeftRight size={20} color={colors.primary} /> Compare Foods
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Compare a traditional Pakistani food side-by-side with a Western fast food to see healthy swaps. 📊
            </p>
          </div>

          <div style={{ ...sectionCard, padding: spacing[20], display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            {/* Input Row */}
            <form onSubmit={(e) => handleCompareFoods(e)} style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[12] }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Food A (Traditional / Desi)</label>
                  <input
                    type="text"
                    placeholder="e.g. Chicken Biryani, Roti"
                    value={compareFoodA}
                    onChange={(e) => setCompareFoodA(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Food B (Western / Fast Food)</label>
                  <input
                    type="text"
                    placeholder="e.g. Beef Burger, French Fries"
                    value={compareFoodB}
                    onChange={(e) => setCompareFoodB(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Quick Matches */}
              <div>
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: colors.primary, textTransform: 'uppercase', display: 'block', marginBottom: spacing[8] }}>Popular Quick Matches</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[8] }}>
                  {[
                    { label: "Biryani vs Burger", a: "Chicken Biryani", b: "Beef Burger" },
                    { label: "Samosa vs Fries", a: "Samosa", b: "French Fries" },
                    { label: "Paratha vs Croissant", a: "Plain Paratha", b: "Butter Croissant" },
                    { label: "Halwa Puri vs Pancake", a: "Halwa Puri", b: "Maple Syrup Pancakes" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCompareFoodA(preset.a);
                        setCompareFoodB(preset.b);
                        // Trigger compare
                        setTimeout(() => {
                          const btn = document.getElementById('hch-compare-submit-btn') as HTMLButtonElement;
                          if (btn) btn.click();
                        }, 50);
                      }}
                      className="hch-btn hch-btn--outline"
                      style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="hch-compare-submit-btn"
                type="submit"
                disabled={comparingFoods || !compareFoodA.trim() || !compareFoodB.trim()}
                className="hch-btn hch-btn--primary"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[8] }}
              >
                <ArrowLeftRight size={14} /> {comparingFoods ? 'Comparing Foods…' : 'Calculate Nutritional Comparison'}
              </button>
            </form>
          </div>

          {/* Loader or Error */}
          {comparingFoods && (
            <div style={{ ...sectionCard, padding: spacing[48], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#fcfbf9' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `3px solid ${colors.success}30`, borderTop: `3px solid ${colors.primary}`, animation: 'hch-ring-fill 1s linear infinite', marginBottom: spacing[16] }} />
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Comparing Foods…</h4>
              <p style={{ fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing[4] }}>Analyzing portion sizes and mineral data via AI</p>
            </div>
          )}

          {compareError && (
            <div style={{ ...sectionCard, background: '#fef2f2', border: '1px solid #fecaca', padding: spacing[20], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: '#b91c1c', margin: 0 }}>Comparison Error</h5>
                <p style={{ fontSize: fontSizes.xs, color: '#b91c1c', lineHeight: 1.5, margin: `${spacing[4]} 0 0` }}>{compareError}</p>
              </div>
            </div>
          )}

          {/* Result View */}
          {compareResult && !comparingFoods && (
            <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <div style={{ ...sectionCard, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: fontSizes.sm }}>
                  <thead>
                    <tr style={{ background: '#faf9f6', borderBottom: `1px solid ${colors.success}15` }}>
                      <th style={{ padding: '16px', fontWeight: 700, color: colors.muted, fontSize: '0.6875rem', textTransform: 'uppercase' }}>Nutrient (per serving)</th>
                      <th style={{ padding: '16px', fontWeight: 700, color: colors.primary }}>{compareResult.foodAName} (Desi)</th>
                      <th style={{ padding: '16px', fontWeight: 700, color: colors.accent }}>{compareResult.foodBName} (Western)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Calories", unit: "kcal", a: compareResult.foodAStats.calories, b: compareResult.foodBStats.calories, lowerIsBetter: true },
                      { name: "Protein", unit: "g", a: compareResult.foodAStats.protein, b: compareResult.foodBStats.protein, lowerIsBetter: false },
                      { name: "Dietary Fiber", unit: "g", a: compareResult.foodAStats.fiber, b: compareResult.foodBStats.fiber, lowerIsBetter: false },
                      { name: "Iron", unit: "mg", a: compareResult.foodAStats.iron, b: compareResult.foodBStats.iron, lowerIsBetter: false },
                      { name: "Sodium", unit: "mg", a: compareResult.foodAStats.sodium, b: compareResult.foodBStats.sodium, lowerIsBetter: true }
                    ].map((row, idx) => {
                      const isABetter = row.lowerIsBetter ? (row.a < row.b) : (row.a > row.b);
                      const isBBetter = row.lowerIsBetter ? (row.b < row.a) : (row.b > row.a);
                      return (
                        <tr key={row.name} style={{ borderBottom: idx < 4 ? `1px solid ${colors.success}10` : 'none' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: colors.text }}>{row.name}</td>
                          <td style={{ padding: '14px 16px', color: colors.text }}>
                            <strong style={{ color: isABetter ? colors.primary : colors.text }}>{row.a} {row.unit}</strong>
                            {isABetter && <span style={{ fontSize: '0.625rem', color: colors.primary, marginLeft: '4px', background: `${colors.primary}10`, padding: '2px 6px', borderRadius: '4px' }}>Better</span>}
                          </td>
                          <td style={{ padding: '14px 16px', color: colors.text }}>
                            <strong style={{ color: isBBetter ? colors.accent : colors.text }}>{row.b} {row.unit}</strong>
                            {isBBetter && <span style={{ fontSize: '0.625rem', color: colors.accent, marginLeft: '4px', background: `${colors.accent}10`, padding: '2px 6px', borderRadius: '4px' }}>Better</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* takeaway box */}
              <div style={{ background: `${colors.primary}08`, border: `1px solid ${colors.primary}15`, borderRadius: radii.card, padding: spacing[16], display: 'flex', gap: spacing[12], alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>🥗</span>
                <div>
                  <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dietitian Takeaway</span>
                  <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, lineHeight: 1.6, marginTop: spacing[4], margin: `${spacing[4]} 0 0` }}>
                    {compareResult.takeaway}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          E. TAKE FOOD PHOTO — AI Vision Scanner
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'photo' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Camera size={20} color={colors.primary} /> AI Food Photo Scanner
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Snap a picture of your plate or upload an image to instantly analyze ingredients, calories, and macronutrients. 📸
            </p>
          </div>

          {/* Mode Selector & Slot Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing[16] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Scan Input Source</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4], background: colors.background, padding: '4px', borderRadius: radii.button }}>
                <button
                  type="button"
                  onClick={() => { setScanMode('gallery'); stopCamera(); setCapturedImage(null); setScannedResult(null); setScanError(null); }}
                  style={pillToggle(scanMode === 'gallery')}
                >
                  <Upload size={14} /> Gallery Upload
                </button>
                <button
                  type="button"
                  onClick={() => { setScanMode('camera'); setCapturedImage(null); setScannedResult(null); setScanError(null); }}
                  style={pillToggle(scanMode === 'camera')}
                >
                  <Camera size={14} /> Device Camera
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Assigned Meal Slot</label>
              <select
                value={selectedMealSlot}
                onChange={(e) => setSelectedMealSlot(e.target.value as any)}
                style={inputStyle}
              >
                <option value="Breakfast">Breakfast 🍳</option>
                <option value="Lunch">Lunch 🍛</option>
                <option value="Dinner">Dinner 🍲</option>
                <option value="Snack">Snack 🍎</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing[16] }}>
            {/* Input Capture Box */}
            <div style={{
              ...sectionCard,
              padding: spacing[20],
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: `2px dashed ${colors.primary}30`,
              position: 'relative',
              overflow: 'hidden',
              background: '#fdfcfb'
            }}>
              {scanMode === 'camera' ? (
                cameraActive ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], width: '100%', height: '100%', alignItems: 'center' }}>
                    <div style={{ width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Dotted Scan Overlay */}
                      <div style={{
                        position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%',
                        border: `2px dashed ${colors.primary}80`, borderRadius: '12px', pointerEvents: 'none'
                      }} />
                      {/* Scan Line Animation */}
                      <div style={{
                        position: 'absolute', left: 0, right: 0, height: '4px',
                        background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                        top: '10%', animation: 'scanLine 2.5s ease-in-out infinite'
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: spacing[8], width: '100%' }}>
                      <button type="button" onClick={capturePhoto} className="hch-btn hch-btn--primary" style={{ flex: 1 }}>
                        <Camera size={14} /> Capture Frame
                      </button>
                      <button type="button" onClick={stopCamera} className="hch-btn hch-btn--ghost">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                    <img src={capturedImage} alt="Captured preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '220px', objectFit: 'contain' }} />
                    <button type="button" onClick={startCamera} className="hch-btn hch-btn--outline" style={{ width: '100%' }}>
                      <RefreshCw size={14} /> Retake Photo
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[12], textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: radii.full, background: `${colors.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                      <Camera size={32} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Camera Standby</h4>
                      <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, margin: `${spacing[4]} 0 0`, maxWidth: '240px' }}>
                        Access your device camera to take a real-time shot of your meal.
                      </p>
                    </div>
                    <button type="button" onClick={startCamera} className="hch-btn hch-btn--primary" style={{ padding: '10px 24px', fontSize: fontSizes.xs }}>
                      Start Camera
                    </button>
                  </div>
                )
              ) : (
                /* Gallery Mode */
                capturedImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                    <img src={capturedImage} alt="Uploaded preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '220px', objectFit: 'contain' }} />
                    <button type="button" onClick={() => setCapturedImage(null)} className="hch-btn hch-btn--outline" style={{ width: '100%' }}>
                      Clear & Upload Another
                    </button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[12], cursor: 'pointer', textAlign: 'center', padding: spacing[20] }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: radii.full, background: `${colors.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                      <Upload size={32} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>Select Food Image</h4>
                      <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, margin: `${spacing[4]} 0 0`, maxWidth: '240px' }}>
                        Drag & drop or click to browse files (JPEG, PNG). Portion size will be estimated.
                      </p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <span className="hch-btn hch-btn--outline" style={{ pointerEvents: 'none', fontSize: fontSizes.xs }}>Browse Gallery</span>
                  </label>
                )
              )}
            </div>

            {/* Results / Scanning Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              {scanningPhoto ? (
                <div style={{
                  ...sectionCard,
                  padding: spacing[32],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  background: '#fcfbf9'
                }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    border: `4px solid ${colors.success}30`,
                    borderTop: `4px solid ${colors.primary}`,
                    animation: 'hch-ring-fill 1.2s linear infinite',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', marginBottom: spacing[16]
                  }}>
                    📸
                  </div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>AI Photo Analysis Active…</h4>
                  <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, margin: `${spacing[8]} 0 0`, maxWidth: '220px' }}>
                    Identifying local ingredients and estimating caloric density. Please wait…
                  </p>
                </div>
              ) : scannedResult ? (
                /* Real Scanned Result */
                <div className="hch-animate-in" style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[6] }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.primary, background: `${colors.primary}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Scan Successful</span>
                        {scannedResult.confidence !== undefined && (
                          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted }}>({Math.round(scannedResult.confidence * 100)}% Match)</span>
                        )}
                      </div>
                      <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: `${spacing[4]} 0 0` }}>{scannedResult.name}</h4>
                    </div>
                    <span style={{ fontSize: fontSizes.base, fontWeight: 800, color: colors.accent }}>{scannedResult.calories} kcal</span>
                  </div>

                  <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.5, margin: 0 }}>"{scannedResult.notes}"</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[8], borderTop: `1px solid ${colors.success}15`, paddingTop: spacing[12] }}>
                    {[
                      { label: 'Protein', value: `${scannedResult.protein}g`, color: colors.primary },
                      { label: 'Carbs', value: `${scannedResult.carbs}g`, color: colors.accent },
                      { label: 'Fat', value: `${scannedResult.fat}g`, color: colors.text },
                    ].map((macro) => (
                      <div key={macro.label} style={{ textAlign: 'center', padding: '8px', background: colors.background, borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block' }}>{macro.label}</span>
                        <strong style={{ fontSize: fontSizes.xs, color: macro.color, display: 'block', marginTop: '2px' }}>{macro.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: spacing[8], marginTop: spacing[4] }}>
                    <button
                      type="button"
                      onClick={() => handleLogMealCalories(`${selectedMealSlot}: ${scannedResult.name}`, scannedResult.calories, scannedResult.protein)}
                      className="hch-btn hch-btn--primary"
                      style={{ flex: 1, padding: '10px 16px', fontSize: fontSizes.xs }}
                    >
                      <Plus size={12} /> Log to {selectedMealSlot}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScannedResult(null)}
                      className="hch-btn hch-btn--ghost"
                      style={{ fontSize: fontSizes.xs }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                /* Standby State with Submit */
                <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: spacing[16], height: '100%' }}>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Nutritional Estimation</h4>
                  <p style={{ fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.6, margin: 0 }}>
                    Our AI model will estimate calories and macros based on typical portion sizes. Provide a picture of your plate to start.
                  </p>
                  
                  {scanError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: spacing[12], borderRadius: '8px', display: 'flex', gap: spacing[8], alignItems: 'flex-start' }}>
                      <AlertCircle size={16} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#b91c1c', lineHeight: 1.4 }}>{scanError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleScanFoodPhoto}
                    disabled={!capturedImage || scanningPhoto}
                    className="hch-btn hch-btn--primary"
                    style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[8] }}
                  >
                    <Sparkles size={16} /> Scan Food Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          I. EASY COOKING GUIDE — AI Recipe Generator
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'cooking' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <ChefHat size={20} color={colors.primary} /> Easy Cooking Guide & AI Chef
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Generate custom, low-oil Pakistani recipes based on your specific macro, calorie, and allergy constraints. 🧑‍🍳
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing[16], alignItems: 'flex-start' }}>
            {/* Left Panel: Targets Setup */}
            <form onSubmit={(e) => handleGenerateRecipe(e)} style={{ ...sectionCard, padding: spacing[20], display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Setup Recipe Targets</h4>

              {/* Goal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Primary Target Goal</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[4], background: colors.background, padding: '4px', borderRadius: radii.button }}>
                  {(['Fat Loss', 'Muscle Gain', 'Stay Fit'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setRecipeGoal(g)}
                      style={pillToggle(recipeGoal === g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Meal Category</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[6] }}>
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRecipeCategory(cat)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: radii.button,
                        border: recipeCategory === cat ? `1.5px solid ${colors.primary}` : `1px solid ${colors.success}20`,
                        background: recipeCategory === cat ? `${colors.primary}08` : 'transparent',
                        color: recipeCategory === cat ? colors.primary : colors.text,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Cuisine Style</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[4], background: colors.background, padding: '4px', borderRadius: radii.button }}>
                  {(['Strictly Desi', 'Desi Fusion', 'Home-Cooked'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setRecipeStyle(style)}
                      style={pillToggle(recipeStyle === style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calorie Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSizes.xs }}>
                  <span style={{ fontWeight: 700, color: colors.text }}>Target Calories</span>
                  <span style={{ fontWeight: 700, color: colors.primary }}>{recipeCalories} kcal</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={recipeCalories}
                  onChange={(e) => setRecipeCalories(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: colors.primary }}
                />
              </div>

              {/* Protein Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSizes.xs }}>
                  <span style={{ fontWeight: 700, color: colors.text }}>Minimum Protein</span>
                  <span style={{ fontWeight: 700, color: colors.primary }}>{recipeProtein} g</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={recipeProtein}
                  onChange={(e) => setRecipeProtein(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: colors.primary }}
                />
              </div>

              {/* Time Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSizes.xs }}>
                  <span style={{ fontWeight: 700, color: colors.text }}>Max Cooking Time</span>
                  <span style={{ fontWeight: 700, color: colors.primary }}>{recipeTime} mins</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={recipeTime}
                  onChange={(e) => setRecipeTime(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: colors.primary }}
                />
              </div>

              {/* Allergies Textbox */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Allergies (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Gluten, Dairy, Peanuts"
                  value={recipeAllergies}
                  onChange={(e) => setRecipeAllergies(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* On-hand Ingredients Textbox */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                <label style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>Ingredients On Hand (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken breast, Lentils, Spinach"
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={generatingRecipe}
                className="hch-btn hch-btn--primary"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[8] }}
              >
                <Sparkles size={16} /> {generatingRecipe ? 'Chef is cooking up recipe…' : 'Generate Recipe'}
              </button>
            </form>

            {/* Right Panel: Recipe Output or Empty State */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              {generatingRecipe ? (
                <div style={{ ...sectionCard, padding: spacing[48], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '380px', background: '#fcfbf9' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: `4px solid ${colors.success}30`, borderTop: `4px solid ${colors.primary}`, animation: 'hch-ring-fill 1s linear infinite', marginBottom: spacing[16], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍳</div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: 0 }}>AI Chef generating recipe…</h4>
                  <p style={{ fontSize: fontSizes.xs, color: colors.muted, marginTop: spacing[4], maxWidth: '240px' }}>Evaluating caloric budgets, sodium, cooking time, and allergen exclusions</p>
                </div>
              ) : recipeError ? (
                <div style={{ ...sectionCard, background: '#fef2f2', border: '1px solid #fecaca', padding: spacing[20], display: 'flex', gap: spacing[12], alignItems: 'flex-start', minHeight: '380px' }}>
                  <AlertCircle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: '#b91c1c', margin: 0 }}>Chef Error</h5>
                    <p style={{ fontSize: fontSizes.xs, color: '#b91c1c', lineHeight: 1.5, margin: `${spacing[4]} 0 0` }}>{recipeError}</p>
                  </div>
                </div>
              ) : generatedRecipe ? (
                /* Generated Recipe card */
                <div className="hch-animate-in" style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.primary, background: `${colors.primary}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Custom Recipe</span>
                      <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 700, color: colors.text, margin: `${spacing[4]} 0 0` }}>{generatedRecipe.title}</h4>
                    </div>
                    
                    {/* Heart button */}
                    <button
                      type="button"
                      onClick={() => toggleCustomFavorite({
                        type: 'recipe',
                        name: generatedRecipe.title,
                        calories: generatedRecipe.calories,
                        protein: generatedRecipe.protein,
                        carbs: generatedRecipe.carbs,
                        fat: generatedRecipe.fat,
                        notes: generatedRecipe.notes,
                        recipe: generatedRecipe
                      })}
                      style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: customFavorites.some(f => f.name === generatedRecipe.title) ? '#e54d2e' : colors.muted, transition: 'transform 0.1s' }}
                    >
                      <Heart size={20} style={{ fill: customFavorites.some(f => f.name === generatedRecipe.title) ? '#e54d2e' : 'none' }} />
                    </button>
                  </div>

                  {/* Nutrition stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing[8], background: colors.background, padding: '10px', borderRadius: '12px' }}>
                    {[
                      { label: 'Calories', val: `${generatedRecipe.calories} kcal` },
                      { label: 'Protein', val: `${generatedRecipe.protein}g` },
                      { label: 'Carbs', val: `${generatedRecipe.carbs}g` },
                      { label: 'Fat', val: `${generatedRecipe.fat}g` }
                    ].map((stat) => (
                      <div key={stat.label} style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.55rem', color: colors.muted, display: 'block' }}>{stat.label}</span>
                        <strong style={{ fontSize: '0.75rem', color: colors.text }}>{stat.val}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, margin: '0 0 6px 0' }}>Ingredients</h5>
                    <ul style={{ paddingLeft: '18px', margin: 0, fontSize: fontSizes.xs, color: colors.text, lineHeight: 1.6 }}>
                      {generatedRecipe.ingredients.map((ing: any, i: number) => (
                        <li key={i} style={{ marginBottom: '2px' }}>
                          <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cooking Steps */}
                  <div>
                    <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, margin: '0 0 6px 0' }}>Instructions</h5>
                    <ol style={{ paddingLeft: '18px', margin: 0, fontSize: fontSizes.xs, color: colors.text, lineHeight: 1.65 }}>
                      {generatedRecipe.steps.map((step: string, s: number) => (
                        <li key={s} style={{ marginBottom: '6px' }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Notes */}
                  {generatedRecipe.notes && (
                    <div style={{ borderTop: `1px solid ${colors.success}10`, paddingTop: spacing[12], fontStyle: 'italic', fontSize: '0.75rem', color: colors.muted }}>
                      "{generatedRecipe.notes}"
                    </div>
                  )}

                  {/* Log button */}
                  <button
                    type="button"
                    onClick={() => handleLogMealCalories(`AI Cooked: ${generatedRecipe.title}`, generatedRecipe.calories, generatedRecipe.protein)}
                    className="hch-btn hch-btn--primary"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <Plus size={14} /> Log Meal to Intake
                  </button>
                </div>
              ) : (
                /* Empty state */
                <div style={{ ...sectionCard, textAlign: 'center', padding: spacing[48], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing[16], minHeight: '380px' }}>
                  <div style={{ fontSize: '3rem' }}>🍲</div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>No custom recipe generated yet</h4>
                  <p style={{ fontSize: fontSizes.xs, color: colors.muted, margin: 0, maxWidth: '260px', lineHeight: 1.5 }}>
                    Adjust your sliders and target preferences in the left panel, and click **Generate Recipe** to cook up an AI meal.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Traditional Cookbook Archive */}
          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[12], border: `1px solid ${colors.success}15`, marginTop: spacing[8] }}>
            <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Or Browse Traditional Favorites</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing[12] }}>
              {RECIPES.map((recipe, idx) => (
                <div key={idx} style={{ background: colors.background, borderRadius: radii.card, padding: spacing[12], display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontFamily: fonts.heading, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text, margin: 0 }}>{recipe.title}</h5>
                    <span style={{ fontSize: '0.625rem', color: colors.muted }}>{recipe.time} mins</span>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: colors.muted, margin: 0 }}>{recipe.ingredients.slice(0, 3).join(', ')}...</p>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedRecipe({
                        title: recipe.title,
                        ingredients: recipe.ingredients.map(ing => {
                          const parts = ing.split(' ');
                          const amt = parts[0] || "1";
                          const unit = parts[1] || "unit";
                          const name = parts.slice(2).join(' ') || ing;
                          return { name, amount: amt, unit };
                        }),
                        steps: recipe.steps,
                        notes: "Traditional favorite loaded from local cookbook database.",
                        calories: parseInt(recipe.calories) || 350,
                        protein: parseInt(recipe.protein) || 20,
                        carbs: 40,
                        fat: 10
                      });
                      showLogToast(`Loaded recipe: ${recipe.title}!`);
                    }}
                    className="hch-btn hch-btn--ghost"
                    style={{ alignSelf: 'flex-start', padding: '4px 8px', fontSize: '0.6875rem' }}
                  >
                    Load Recipe →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          J. FAVORITES TAB
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'favorites' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <Heart size={20} color={colors.primary} style={{ fill: colors.primary }} /> Favorites
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Your personally favorited meals, recipes, and food items for quick access. ❤️
            </p>
          </div>

          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            {customFavorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing[24], background: colors.background, border: `1.5px dashed ${colors.success}50`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                <Heart size={28} style={{ color: colors.muted }} />
                <span style={{ fontSize: fontSizes.xs, color: colors.muted }}>
                  No favorites saved yet. Toggle the heart icon on any AI-generated recipe or food lookup to save them here.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
                {customFavorites.map((fav) => (
                  <div key={fav.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: spacing[12], borderRadius: '12px', background: colors.background, border: `1px solid ${colors.success}25` }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[6] }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.primary, background: `${colors.primary}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{fav.type}</span>
                        <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>{fav.name}</span>
                      </div>
                      <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block', marginTop: '2px' }}>{fav.calories} kcal · {fav.protein}g Protein</span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[4], alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (fav.type === 'recipe') {
                            setGeneratedRecipe(fav.recipe);
                            setActiveTab('cooking');
                          } else {
                            setSearchQuery(fav.name);
                            setActiveTab('lookup');
                            setTimeout(() => {
                              const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                              if (btn) btn.click();
                            }, 50);
                          }
                          showLogToast(`Opened "${fav.name}" details.`);
                        }}
                        className="hch-btn hch-btn--outline"
                        style={{ fontSize: '0.6875rem', padding: '6px 12px' }}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCustomFavorite(fav)}
                        style={{ padding: '6px', borderRadius: radii.full, border: 'none', background: 'transparent', cursor: 'pointer', color: '#e54d2e' }}
                      >
                        <Trash2 size={14} />
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
          H. PAST PLANS ARCHIVE — Snaps & Saved plans
         ═══════════════════════════════════════════════════════ */}
      {activeTab === 'past_plans' && (
        <div className="hch-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          <div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: spacing[8] }}>
              <FolderOpen size={20} color={colors.primary} /> Saved Plans & Snapshots
            </h3>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, lineHeight: 1.6, marginTop: spacing[4] }}>
              Review, restore, or manage your saved weekly meal plan variations and generated recipe snapshots. 📁
            </p>
          </div>

          {/* Preset Saved Plans Section */}
          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                <FolderOpen size={18} style={{ color: colors.primary }} />
                <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Saved Weekly Plans</h4>
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, background: colors.background, padding: '3px 10px', borderRadius: radii.full }}>{savedMealPlans.length} archived</span>
            </div>

            {savedMealPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing[24], background: colors.background, border: `1.5px dashed ${colors.success}50`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                <Calendar size={28} style={{ color: colors.muted }} />
                <span style={{ fontSize: fontSizes.xs, color: colors.muted }}>No saved plans yet. Go to "7-Day Food Plan" and save your active week to archive it here.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], maxHeight: '400px', overflowY: 'auto' }}>
                {savedMealPlans.map((plan) => (
                  <div key={plan.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: spacing[12], borderRadius: '12px', background: colors.background, border: `1px solid ${colors.success}25` }}>
                    <div>
                      <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>{plan.name}</span>
                      <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block' }}>Saved: {plan.date} · {Object.keys(plan.days).length} days</span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[4] }}>
                      <button
                        type="button"
                        onClick={() => handleRestoreSavedPlan(plan)}
                        style={{ padding: '6px 12px', borderRadius: radii.button, background: colors.primary, color: colors.white, border: 'none', fontSize: '0.625rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                      >
                        <RefreshCw size={10} /> Load
                      </button>
                      <button
                        type="button"
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

          {/* Auto Snapshot Past Plans Section */}
          <div style={{ ...sectionCard, display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                <Clock size={18} style={{ color: colors.primary }} />
                <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>AI Creation History Snapshots</h4>
              </div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.muted, background: colors.background, padding: '3px 10px', borderRadius: radii.full }}>{pastPlans.length} snapshots</span>
            </div>

            {pastPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: spacing[24], background: colors.background, border: `1.5px dashed ${colors.success}50`, borderRadius: radii.card, display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'center' }}>
                <Clock size={28} style={{ color: colors.muted }} />
                <span style={{ fontSize: fontSizes.xs, color: colors.muted }}>No automatic creation snapshots yet. Generating AI plans or custom recipes will save snapshots here.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8], maxHeight: '400px', overflowY: 'auto' }}>
                {pastPlans.map((snap) => (
                  <div key={snap.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], padding: spacing[12], borderRadius: '12px', background: colors.background, border: `1px solid ${colors.success}25` }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[6] }}>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, background: `${colors.accent}10`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{snap.type === 'weekly_plan' ? 'Weekly AI' : 'Recipe AI'}</span>
                        <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, fontWeight: 700, color: colors.text }}>{snap.name}</span>
                      </div>
                      <span style={{ fontSize: '0.625rem', color: colors.muted, display: 'block', marginTop: '2px' }}>Created: {snap.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[4] }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (snap.type === 'weekly_plan') {
                            setMealPlans(snap.data);
                            setActiveTab('7day');
                            showLogToast(`Restored AI Weekly Plan! ✅`);
                          } else if (snap.type === 'recipe') {
                            setGeneratedRecipe(snap.data);
                            setActiveTab('cooking');
                            showLogToast(`Loaded AI Recipe: ${snap.name}! 🍳`);
                          }
                        }}
                        style={{ padding: '6px 12px', borderRadius: radii.button, background: colors.primary, color: colors.white, border: 'none', fontSize: '0.625rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                      >
                        <RefreshCw size={10} /> View / Reopen
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = pastPlans.filter(p => p.id !== snap.id);
                          setPastPlans(updated);
                          localStorage.setItem(`hch_past_plans_${profile.name}`, JSON.stringify(updated));
                          showLogToast(`Deleted snapshot.`);
                        }}
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

          {/* Option to save current week */}
          {Object.keys(mealPlans).length > 0 && (
            <div style={{ ...sectionCard, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing[16], background: `${colors.success}10` }}>
              <div>
                <span style={{ fontSize: fontSizes.xs, fontWeight: 700, color: colors.primary }}>Save Current Active Plan</span>
                <p style={{ fontSize: '0.6875rem', color: colors.muted, margin: '2px 0 0' }}>Archive your current week to load it back later.</p>
              </div>
              <button onClick={handleSaveCurrentPlan} className="hch-btn hch-btn--primary" style={{ padding: '10px 18px', fontSize: fontSizes.xs }}>
                <Save size={12} /> Save Current Week
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
