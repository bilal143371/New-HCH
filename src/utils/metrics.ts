import { UserProfile, UserMetrics } from '../types';

export function calculatePersonalMetrics(profile: UserProfile): UserMetrics {
  const age = profile.age;
  const kg = profile.weightKg;
  
  // Calculate height in cm
  const totalInches = (profile.heightFt * 12) + profile.heightIn;
  const cm = totalInches * 2.54;
  const m = cm / 100;

  // 1. Calculate BMI
  const bmi = m > 0 ? kg / (m * m) : 0;
  let bmiCategory = 'Normal';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
  } else if (bmi < 25) {
    bmiCategory = 'Normal weight';
  } else if (bmi < 30) {
    bmiCategory = 'Overweight';
  } else {
    bmiCategory = 'Obese';
  }

  // 2. Calculate BMR using Mifflin-St Jeor
  const bmrMale = (10 * kg) + (6.25 * cm) - (5 * age) + 5;
  const bmrFemale = (10 * kg) + (6.25 * cm) - (5 * age) - 161;
  let bmr = 0;
  if (profile.gender === 'male') {
    bmr = bmrMale;
  } else if (profile.gender === 'female') {
    bmr = bmrFemale;
  } else {
    bmr = (bmrMale + bmrFemale) / 2;
  }

  // 3. Activity Multiplier
  let multiplier = 1.2;
  switch (profile.activityLevel) {
    case 'sedentary':
      multiplier = 1.2;
      break;
    case 'lightly-active':
      multiplier = 1.375;
      break;
    case 'moderately-active':
      multiplier = 1.55;
      break;
    case 'very-active':
      multiplier = 1.725;
      break;
    case 'extremely-active':
      multiplier = 1.9;
      break;
  }

  const tdee = bmr * multiplier;

  // 4. Goal Adjustment for Calories
  let calories = tdee;
  if (profile.goal === 'lose-weight') {
    calories = tdee - 500;
    // Capped minimums
    const minFloor = profile.gender === 'female' ? 1200 : 1500;
    if (calories < minFloor) {
      calories = minFloor;
    }
  } else if (profile.goal === 'build-muscle') {
    calories = tdee + 300;
  }

  // Round calories to nearest 50 kcal
  calories = Math.round(calories / 50) * 50;

  // 5. Daily Protein Target (g/day)
  let proteinFactor = 1.6; // Stay Healthy default
  switch (profile.goal) {
    case 'lose-weight':
      proteinFactor = 2.0;
      break;
    case 'build-muscle':
      proteinFactor = 2.4;
      break;
    case 'stay-healthy':
      proteinFactor = 1.6;
      break;
    case 'reduce-stress':
      proteinFactor = 1.4;
      break;
    case 'improve-fitness':
      proteinFactor = 1.8;
      break;
  }

  let protein = kg * proteinFactor;
  if (age > 60) {
    protein += kg * 0.2;
  }
  protein = Math.round(protein / 5) * 5;

  // 6. Daily Water Goal (Liters/day)
  let water = kg * 0.033;
  if (profile.activityLevel === 'very-active' || profile.activityLevel === 'extremely-active') {
    water += 0.5;
  }
  if (age > 60) {
    water += 0.3;
  }
  if (profile.healthConditions.includes('diabetes')) {
    water += 0.2;
  }
  if (profile.goal === 'lose-weight') {
    water += 0.3;
  }
  water = Math.round(water * 10) / 10;

  // 7. Daily Step Goal (steps/day)
  let steps = 7500;
  if (profile.activityLevel === 'sedentary') {
    steps = profile.goal === 'lose-weight' ? 10000 : 7500;
  } else if (profile.activityLevel === 'lightly-active') {
    steps = 9000;
  } else if (profile.activityLevel === 'moderately-active') {
    steps = 11000;
  } else if (profile.activityLevel === 'very-active') {
    steps = 13000;
  } else if (profile.activityLevel === 'extremely-active') {
    steps = 15000;
  }

  // Health Overrides
  if (profile.healthConditions.includes('joint-pain')) {
    steps = Math.max(5000, steps - 2000);
  }
  if (profile.healthConditions.includes('heart-condition')) {
    steps = Math.max(4000, steps - 1500);
  }

  // 8. Sleep Target (hours/night)
  let sleep = 7.5;
  if (age < 18) {
    sleep = 9.0;
  } else if (age <= 25) {
    sleep = 8.0;
  } else if (age <= 64) {
    sleep = 7.5;
  } else {
    sleep = 8.0;
  }

  if (profile.goal === 'reduce-stress') {
    sleep += 0.5;
  }
  if (profile.activityLevel === 'very-active' || profile.activityLevel === 'extremely-active') {
    sleep += 0.5;
  }
  if (profile.healthConditions.includes('heart-condition')) {
    sleep += 0.5;
  }
  sleep = Math.round(sleep * 2) / 2; // Round to nearest 0.5 hours

  // 9. Key Nutrients Focus List
  const nutrients: string[] = [];
  
  if (profile.gender === 'female') {
    nutrients.push("Iron: 18mg/day");
  }

  // Calcium and Vitamin D
  const hasNoDairy = profile.foodPreferences.includes('no-dairy');
  if (hasNoDairy) {
    nutrients.push("Calcium: 1300mg/day");
  } else {
    if (age > 50) {
      nutrients.push("Vitamin D: 800 IU/day");
      nutrients.push("Calcium: 1200mg/day");
    } else {
      nutrients.push("Vitamin D: 600 IU/day");
      nutrients.push("Calcium: 1000mg/day");
    }
  }

  if (profile.healthConditions.includes('diabetes')) {
    nutrients.push("Magnesium: 400mg/day");
  }

  if (profile.goal === 'build-muscle') {
    nutrients.push("Zinc: 11mg/day");
  }

  if (profile.foodPreferences.includes('vegan')) {
    nutrients.push("Vitamin B12: 2.4mcg/day");
  }

  nutrients.push("Vitamin C: 75mg/day");

  // Filter list to keep only 3-4 items or as appropriate, or we can just keep them all
  // The spec says "Generates 3-4 items". Let's deduplicate or slice to max 4 if there are too many.
  const uniqueNutrients = Array.from(new Set(nutrients)).slice(0, 4);

  return {
    calories,
    protein,
    water,
    steps,
    sleep,
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    nutrients: uniqueNutrients
  };
}
