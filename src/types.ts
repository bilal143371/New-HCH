export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'prefer-not-to-say';
  country: string;
  heightFt: number;
  heightIn: number;
  weight: number; // in unit (kg or lbs)
  weightUnit: 'kg' | 'lbs';
  weightKg: number; // calculated and stored in KG
  goal: 'lose-weight' | 'build-muscle' | 'stay-healthy' | 'reduce-stress' | 'improve-fitness';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  healthConditions: string[]; // 'diabetes', 'high-blood-pressure', 'heart-condition', 'joint-pain', 'back-pain', 'asthma'
  foodPreferences: string[]; // 'vegetarian', 'vegan', 'non-vegetarian', 'no-dairy', 'no-gluten', 'halal-only'
}

export interface UserMetrics {
  calories: number;
  protein: number;
  water: number;
  steps: number;
  sleep: number;
  bmi: number;
  bmiCategory: string;
  nutrients: string[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'legs' | 'arms' | 'chest' | 'back' | 'core' | 'full-body' | 'breathing' | 'meditation' | 'sleep' | 'stress' | 'energy';
  sphere: 'physical' | 'mental';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructions: string[];
  hasTimer?: boolean;
  timerSeconds?: number;
  highImpact?: boolean;
  isHeavyLift?: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sphere: 'physical' | 'mental';
  timestamp: string; // ISO string
  durationLogged: string;
}

export interface LoggedActivity {
  id: string;
  name: string;
  sphere: 'physical' | 'mental';
  category: string;
  duration: string;
  timestamp: string;
  date?: string;
}

export interface MealPlan {
  breakfast?: string;
  lunch?: string;
  snack?: string;
  dinner?: string;
  sehri?: string;
  iftari?: string;
  isRamadan?: boolean;
  notes?: string;
}
