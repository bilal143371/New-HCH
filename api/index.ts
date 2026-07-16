import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

export interface FoodCompareItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  description: string;
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  advice: string;
  swapWith?: string;
}

export const PAKISTANI_FOODS_DB_EXPANDED: FoodCompareItem[] = [
  { 
    id: "roti", 
    name: "Whole-wheat Chapati / Roti (1 medium)", 
    calories: 120, 
    protein: 4.2, 
    carbs: 24, 
    fat: 0.8, 
    fiber: 3.5, 
    category: "Breads", 
    description: "Traditional flatbread prepared using stone-ground whole wheat (Lal Atta).",
    healthGrade: 'A',
    advice: "An excellent baseline carbohydrate source packed with magnesium and complex fibers that regulate sugar release."
  },
  { 
    id: "paratha", 
    name: "Plain Paratha (1 medium)", 
    calories: 290, 
    protein: 5.0, 
    carbs: 36, 
    fat: 14.5, 
    fiber: 1.2, 
    category: "Breads", 
    description: "Flaky traditional flatbread rolled and shallow-fried in hydrogenated ghee or cooking oil.",
    healthGrade: 'D',
    advice: "High in trans fats and calories. Swapping this for a dry whole-wheat chapati saves 170 kcal per meal and protects arteries.",
    swapWith: "roti"
  },
  { 
    id: "paratha-aloo", 
    name: "Aloo Paratha (1 medium)", 
    calories: 360, 
    protein: 6.2, 
    carbs: 48, 
    fat: 16.0, 
    fiber: 2.5, 
    category: "Breads", 
    description: "Flatbread stuffed with spiced mashed potatoes and griddle-fried in oil.",
    healthGrade: 'F',
    advice: "Extremely dense in simple starches and frying oils, causing immediate insulin spikes. Swap for single dry Roti or high-protein eggs.",
    swapWith: "roti"
  },
  { 
    id: "naan-maida", 
    name: "White Flour Naan (1 piece)", 
    calories: 310, 
    protein: 8.5, 
    carbs: 61, 
    fat: 3.5, 
    fiber: 1.5, 
    category: "Breads", 
    description: "Tandoor-baked leavened bread made with bleached white flour (Maida).",
    healthGrade: 'D',
    advice: "Refined flour has had all its essential fiber and zinc stripped away. Rapidly degrades glycemic index controls. Swap for whole wheat chapati.",
    swapWith: "roti"
  },
  { 
    id: "rice-white", 
    name: "White Basmati Rice (1 cup cooked)", 
    calories: 205, 
    protein: 4.2, 
    carbs: 45, 
    fat: 0.4, 
    fiber: 0.6, 
    category: "Grains", 
    description: "Polished long-grain rice with starch coat, highly popular in regional main courses.",
    healthGrade: 'C',
    advice: "Polished rice spikes blood glucose rapidly. Control portions or combine with generous high-fiber lentils (Daal) or green salads."
  },
  { 
    id: "rice-brown", 
    name: "Brown Basmati Rice (1 cup cooked)", 
    calories: 215, 
    protein: 5.0, 
    carbs: 45, 
    fat: 1.6, 
    fiber: 3.5, 
    category: "Grains", 
    description: "Whole-grain rice with its fibrous bran and nutrient-rich germ layer preserved.",
    healthGrade: 'A',
    advice: "Maintains a lower glycemic profile than white rice. Abundant in magnesium and B vitamins to support active muscle metabolism.",
    swapWith: "rice-brown"
  },
  { 
    id: "biryani", 
    name: "Chicken Biryani (1 plate / 250g)", 
    calories: 460, 
    protein: 24, 
    carbs: 64, 
    fat: 13.5, 
    fiber: 2.0, 
    category: "Meals", 
    description: "Layered fragrant spiced rice and chicken, cooked with ghee and saffron coloring.",
    healthGrade: 'C',
    advice: "High in sodium and fats. Eating this in moderation with a large side of cucumber raita and limiting rice portions is highly advised."
  },
  { 
    id: "haleem-beef", 
    name: "Beef Haleem (1 bowl / 250g)", 
    calories: 340, 
    protein: 26, 
    carbs: 38, 
    fat: 11.0, 
    fiber: 7.5, 
    category: "Meals", 
    description: "Slow-cooked savory paste made of shredded beef, barley, whole wheat, and various lentils.",
    healthGrade: 'B',
    advice: "Highly nutritious and exceptionally high in slow-digesting proteins and dietary fiber. Limit external ghee tarka to keep fats low."
  },
  { 
    id: "nihari-beef", 
    name: "Beef Nihari (1 portion with gravy)", 
    calories: 520, 
    protein: 34, 
    carbs: 12, 
    fat: 38.0, 
    fiber: 0.8, 
    category: "Meals", 
    description: "Heavy slow-cooked shank beef stew garnished with bone marrow, ginger, and oil floating tarka layer.",
    healthGrade: 'F',
    advice: "Extremely rich in saturated fats and sodium. Puts significant load on cardiovascular structures. Swap for lean Chicken Tikka or Haleem.",
    swapWith: "haleem-beef"
  },
  { 
    id: "chicken-karahi", 
    name: "Chicken Karahi (1 portion)", 
    calories: 350, 
    protein: 28, 
    carbs: 6, 
    fat: 22.0, 
    fiber: 1.2, 
    category: "Meals", 
    description: "Chicken breast and bone-in pieces cooked in a heavy tomato, ginger, garlic, and chili oil base.",
    healthGrade: 'C',
    advice: "Gravy is typically prepared in excess oil. To make it a health powerhouse, drain oil off or prepare home-cooked using 1 tsp of olive oil."
  },
  { 
    id: "chicken-tikka", 
    name: "Chicken Tikka Boti (1 skewer / 150g)", 
    calories: 190, 
    protein: 31, 
    carbs: 2, 
    fat: 6.5, 
    fiber: 0.0, 
    category: "Meals", 
    description: "Skinless chicken breast chunks marinated in lemon, yogurt, spices, and open-flame charcoal grilled.",
    healthGrade: 'A',
    advice: "An absolute gold standard for clean, low-fat lean protein. Exceptionally low in carbohydrates, supporting rapid cardiovascular healing."
  },
  { 
    id: "daal-cooked", 
    name: "Yellow split Daal (1 cup cooked)", 
    calories: 180, 
    protein: 8.5, 
    carbs: 29, 
    fat: 3.5, 
    fiber: 6.2, 
    category: "Sides", 
    description: "Cooked split mung/masoor lentils simmered with turmeric and garlic.",
    healthGrade: 'A',
    advice: "Abundant in folate and iron. Soluble fibers bind bile acids to help naturally lower bad LDL cholesterol levels in the blood."
  },
  { 
    id: "sabzi-mixed", 
    name: "Mixed Vegetable Sabzi (1 cup)", 
    calories: 140, 
    protein: 3.0, 
    carbs: 18, 
    fat: 6.0, 
    fiber: 4.5, 
    category: "Sides", 
    description: "Sautéed seasonal okra, peas, potatoes, and carrots seasoned with regional spices.",
    healthGrade: 'B',
    advice: "Highly nutritious due to diverse phytonutrients. Ensure minimal oil (tarka) is used to preserve low caloric density."
  },
  { 
    id: "samosa-fried", 
    name: "Deep-Fried Samosa (1 piece)", 
    calories: 250, 
    protein: 4.0, 
    carbs: 22, 
    fat: 15.0, 
    fiber: 1.0, 
    category: "Snacks", 
    description: "Bleached flour dough stuffed with potato starches and deep-fried in oxidized frying oils.",
    healthGrade: 'F',
    advice: "Dense in trans fats and simple carbohydrates. Deep frying damages lipid structures. Swap for roasted chickpeas or a baked alternative.",
    swapWith: "chana-roasted"
  },
  { 
    id: "samosa-baked", 
    name: "Baked Veggie Samosa (1 piece)", 
    calories: 130, 
    protein: 3.8, 
    carbs: 18, 
    fat: 3.2, 
    fiber: 1.8, 
    category: "Snacks", 
    description: "Thin pastry with potato and pea stuffing, oven-baked to bypass heavy frying oils.",
    healthGrade: 'B',
    advice: "Saves over 120 calories and eliminates toxic trans-fats completely while preserving the classic flavor.",
    swapWith: "samosa-baked"
  },
  { 
    id: "chana-roasted", 
    name: "Dry Roasted Chana (Bhuna Chana, 30g)", 
    calories: 110, 
    protein: 6.2, 
    carbs: 18, 
    fat: 1.8, 
    fiber: 5.5, 
    category: "Snacks", 
    description: "Dry roasted whole black chickpeas, eaten traditional shell-on or peeled.",
    healthGrade: 'A',
    advice: "An outstanding, portable super-snack! Packed with iron, folate, and slow-release low-GI fiber that completely blunts hunger."
  },
  { 
    id: "shami-kabab", 
    name: "Beef/Chicken Shami Kabab (1 piece)", 
    calories: 170, 
    protein: 13.5, 
    carbs: 5, 
    fat: 9.5, 
    fiber: 1.8, 
    category: "Sides", 
    description: "Lentil (Chana daal) and spiced minced meat patty, lightly pan-seared.",
    healthGrade: 'B',
    advice: "Provides clean muscle-repairing proteins. Prepare using minimal oil spray or air-fry to restrict calorie load."
  },
  { 
    id: "egg-boiled", 
    name: "Boiled Egg (1 whole)", 
    calories: 72, 
    protein: 6.3, 
    carbs: 0.4, 
    fat: 4.8, 
    fiber: 0.0, 
    category: "Breakfast", 
    description: "Hard or soft-boiled chicken egg containing complete amino-acid profiling.",
    healthGrade: 'A',
    advice: "Egg whites are pure bioavailable albumin protein. The yolk is highly rich in memory-enhancing choline and vitamin D."
  },
  { 
    id: "dahi-plain", 
    name: "Plain Dahi / Low-Fat Yogurt (1 cup)", 
    calories: 110, 
    protein: 6.0, 
    carbs: 8.5, 
    fat: 4.0, 
    fiber: 0.0, 
    category: "Sides", 
    description: "Plain unsweetened set curd made from pasteurized skimmed milk.",
    healthGrade: 'A',
    advice: "Excellent source of calcium and live probiotics that restore healthy gut bacteria and elevate digestion parameters."
  },
  { 
    id: "fruit-chaat", 
    name: "Fruit Chaat (1 bowl / 150g)", 
    calories: 130, 
    protein: 1.8, 
    carbs: 28, 
    fat: 0.2, 
    fiber: 3.8, 
    category: "Snacks", 
    description: "Assorted freshly cut apples, guavas, bananas, and melons spiced with traditional black pepper/chaat masala.",
    healthGrade: 'A',
    advice: "Extremely refreshing and high in soluble fibers and vitamins. Ensure no extra refined liquid sugar syrup is added."
  },
  { 
    id: "lassi-sweet", 
    name: "Traditional Sweet Lassi (1 glass)", 
    calories: 280, 
    protein: 5.5, 
    carbs: 34, 
    fat: 11.0, 
    fiber: 0.0, 
    category: "Drinks", 
    description: "Blended yogurt drink made with full-fat milk, sugar syrup, and sometimes malai cream toppings.",
    healthGrade: 'F',
    advice: "Massive sugar load. Spikes blood glucose instantly and loads excess liver fat. Swap for a light mint/salty buttermilk.",
    swapWith: "lassi-mint"
  },
  { 
    id: "lassi-mint", 
    name: "Mint / Salty Lassi (Buttermilk, 1 glass)", 
    calories: 95, 
    protein: 4.2, 
    carbs: 6.8, 
    fat: 3.0, 
    fiber: 0.4, 
    category: "Drinks", 
    description: "Cool thin blended yogurt beverage prepared with ice-water, black salt, and crushed mint leaves.",
    healthGrade: 'A',
    advice: "Incredible digestive aid and hydrator. Mint is cooling for body temperature and low fat keeps cardiovascular pipes clean.",
    swapWith: "lassi-mint"
  },
  { 
    id: "chai-sugar", 
    name: "Chai with Full-Milk & Sugar (1 cup)", 
    calories: 155, 
    protein: 3.2, 
    carbs: 19, 
    fat: 6.2, 
    fiber: 0.0, 
    category: "Drinks", 
    description: "Black tea boiled together with buffalo milk and white cane sugar, highly popular daily beverage.",
    healthGrade: 'D',
    advice: "Full-fat buffalo milk and refined white sugar make this beverage high in liquid calories. Swap for skimmed milk tea with zero sugar.",
    swapWith: "green-tea"
  },
  { 
    id: "green-tea", 
    name: "Cardamom Green Tea / Kahwa (1 cup)", 
    calories: 2, 
    protein: 0.0, 
    carbs: 0.0, 
    fat: 0.0, 
    fiber: 0.0, 
    category: "Drinks", 
    description: "Unsweetened hot green tea leaves brewed with cardamom pods (elaichi) and mint.",
    healthGrade: 'A',
    advice: "Zero-calorie antioxidant powerhouse. Green tea catechins boost metabolic rates and support artery flexibility."
  },
  { 
    id: "dates-khajoor", 
    name: "Dates / Khajoor (2 medium)", 
    calories: 120, 
    protein: 1.0, 
    carbs: 31, 
    fat: 0.1, 
    fiber: 3.2, 
    category: "Snacks", 
    description: "Sweet dried palm fruits, highly popular for fast-breaking and quick stamina restoration.",
    healthGrade: 'B',
    advice: "High in natural sugars but rich in potassium and dietary fibers that prevent the sugar from releasing too fast. Perfect sweet craving alternative."
  }
];

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Highly robust local fallback meal plan generator for zero-outage service
const generateLocalFallbackMealPlan = (
  profile: any,
  metrics: any,
  isRamadan: boolean,
  foodPrefOverride: string,
  mealCount: string,
  day: any
) => {
  const dNum = day ? parseInt(day, 10) : 1;
  const idx = (dNum - 1) % 7;

  const hasDiabetes = profile.healthConditions?.includes("Diabetes") || false;
  const hasHBP = profile.healthConditions?.includes("High Blood Pressure") || false;
  const hasHeart = profile.healthConditions?.includes("Heart Condition") || false;

  const calorieTarget = metrics.calories || 1800;
  const scaleText = calorieTarget < 1500 ? " (Small portion)" : calorieTarget > 2100 ? " (Generous portion)" : " (Standard portion)";

  const breakfasts = [
    `Oatmeal porridge boiled in skimmed milk, topped with 6 sliced almonds, half a sliced banana, and a pinch of cinnamon.${scaleText}`,
    `Two egg whites scrambled with tomatoes, onions, and green chilies in 1 tsp olive oil, served with one slice of whole-wheat toasted bread.${scaleText}`,
    `Low-fat Greek yogurt cup topped with 4 crushed walnuts, 1 tsp chia seeds, and half a sliced apple.${scaleText}`,
    `One hard-boiled chicken egg with a cup of hot unsweetened green tea, served with 2 slices of multi-grain toast spread with light cottage cheese.${scaleText}`,
    `Warm semolina porridge cooked with skimmed milk and garnished with 5 cashew nuts and a sprinkle of organic honey.${scaleText}`,
    `Egg-white omelet cooked with fresh spinach, bell peppers, and fresh coriander in 1 tsp canola oil, with 1 small whole-wheat flatbread.${scaleText}`,
    `Smoothie made with one cup of low-fat milk, half a cup of raw oats, 1 tbsp peanut butter, and a dash of cardamom powder.${scaleText}`
  ];

  const lunches = [
    `One cup of boiled basmati brown rice served with yellow split lentil soup, a side of cucumber-tomato salad, and two tablespoons of low-fat yogurt.${scaleText}`,
    `One medium whole-wheat flatbread with dry mixed vegetable curry cooked in low oil, and a fresh lettuce-cabbage salad.${scaleText}`,
    `Boiled white chickpea salad with chopped onions, cucumbers, red tomatoes, fresh coriander, and a squeeze of fresh lemon juice.${scaleText}`,
    `Grilled chicken breast strips (120g) seasoned with cumin and black pepper, served with a large bowl of steamed spinach and cabbage.${scaleText}`,
    `One cup of plain cooked split-mung lentil soup, served with one small whole-wheat flatbread and sliced turnip and cucumber.${scaleText}`,
    `Stir-fried tofu/paneer cubes (100g) with green bell peppers, onions, and tomatoes, served with half a cup of boiled brown rice.${scaleText}`,
    `Minced beef shami kabab (1 piece, air-fried with minimal oil) wrapped in a whole-wheat flatbread with fresh mint chutney.${scaleText}`
  ];

  const snacks = [
    `A refreshing glass of cool mint lassi made with low-fat yogurt and ice.${scaleText}`,
    `A cup of sugar-free green tea with a small handful of unsalted raw almonds (8 pieces).`,
    `A bowl of fresh seasonal fruit salad containing diced guava, apple, and pomegranate with a squeeze of orange juice.`,
    `One small bowl of roasted chickpeas seasoned with black salt and cumin.`,
    `Sliced fresh cucumber and carrots served with three tablespoons of healthy home-made chickpea hummus.`,
    `Half a cup of steamed edamame beans or boiled red kidney beans seasoned with lemon and pinch of chaat masala.`,
    `One cup of hot spiced black tea made with skimmed milk and zero sugar, served with 2 bran biscuits.`
  ];

  const dinners = [
    `Healthy low-oil chicken curry (1 portion) served with one medium whole-wheat flatbread and a side of cucumber mint raita.${scaleText}`,
    `Pan-seared cod fish fillet (150g) seasoned with garlic, black pepper, and fresh lemon juice, served with half a cup of steamed peas and carrots.${scaleText}`,
    `Baked tandoori chicken leg piece (oil removed) served with fresh green salad and two tablespoons of low-fat yogurt.${scaleText}`,
    `Lentil and vegetable stew cooked with light spices, served with a small cup of boiled brown rice and grated radish.${scaleText}`,
    `Stir-fried lean minced beef with green peas in light canola oil, served with one medium whole-wheat flatbread.${scaleText}`,
    `Grilled cottage cheese (Paneer) tikka skewers with bell peppers and onions, served with a small whole-wheat flatbread.${scaleText}`,
    `Thick chicken barley soup cooked with ginger, garlic, and fresh coriander, served with a side of steamed broccoli.${scaleText}`
  ];

  const sehris = [
    `One whole-wheat flatbread with a two-egg-white omelet, half a cup of plain yogurt, and 2 glasses of clean water.${scaleText}`,
    `Oats boiled in milk with 1 sliced date, 5 almonds, and two boiled eggs on the side for slow-digesting protein and energy.${scaleText}`,
    `Medium whole-wheat flatbread served with half a cup of low-fat cottage cheese, sliced cucumber, and a glass of cool lassi.${scaleText}`,
    `Greek yogurt bowl with 1 tbsp chia seeds, 1 sliced banana, and 4 walnuts, plus one slice of multi-grain toast.${scaleText}`,
    `Two soft scrambled eggs with spinach in 1 tsp olive oil, served with one medium flatbread and a cup of unsweetened milk tea.${scaleText}`,
    `Warm semolina porridge cooked with skimmed milk and dates, paired with 2 hard-boiled eggs for long fasting stamina.${scaleText}`,
    `Shami kabab (1 piece) wrapped in a soft whole-wheat flatbread with cucumber slices, served with one glass of chilled mint lassi.${scaleText}`
  ];

  const iftaris = [
    `Two fresh soft dates, one bowl of fresh mixed fruit salad dressed with lemon juice, and a glass of cool mint lassi.${scaleText}`,
    `Three dates, a small bowl of spicy chickpea yogurt chat with fresh onions, and a cup of unsweetened green tea.${scaleText}`,
    `Two dates, one small baked potato samosa, a cup of fresh fruit salad, and a glass of refreshing lemon water.${scaleText}`,
    `Two dates, grilled chicken skewers (2 pieces), sliced cucumber, and a glass of fresh watermelon juice with mint.${scaleText}`,
    `Two fresh dates, a bowl of boiled red bean salad with chopped bell peppers, onions, and lemon juice, and a glass of ice-cold water.${scaleText}`,
    `Three dates, one air-fried vegetable cutlet, a bowl of sliced apple and guava, and a cup of warm mint green tea.${scaleText}`,
    `Two dates, chickpea salad with tomatoes and lemon juice, plus a glass of cooling low-fat cumin lassi.${scaleText}`
  ];

  const notes = [
    `Drink plenty of water between meals. Avoid drinking tea immediately after meals. Stay active.`,
    `Keep salt minimal. Fresh herbs and lemon add great flavor without bloat. Walk for 15 minutes.`,
    `Eat slowly. Chewing thoroughly helps digestion and keeps you full. Sleep for 7-8 hours tonight.`,
    `Prioritize lean proteins like chicken and lentils to protect your active muscle mass.`,
    `Snacking on whole fruits instead of drinking juices provides healthy fiber to keep you satisfied.`,
    `Avoid refined white flour or white sugar. Whole grains maintain stable energy levels.`,
    `A healthy mind supports a healthy body. Dedicate 5 minutes to deep breathing exercises today.`
  ];

  let bSelected = breakfasts[idx];
  let lSelected = lunches[idx];
  let sSelected = snacks[idx];
  let dSelected = dinners[idx];
  let sehriSelected = sehris[idx];
  let iftariSelected = iftaris[idx];
  let notesSelected = notes[idx];

  // Adjustments for Diabetes
  if (hasDiabetes) {
    bSelected = bSelected.replace("banana", "guava or raw apples").replace("honey", "stevia sweetener");
    lSelected = lSelected.replace("basmati rice", "boiled brown rice").replace("basmati brown rice", "boiled brown rice");
    sehriSelected = sehriSelected.replace("banana", "fresh strawberries or pear").replace("dates", "almonds");
    iftariSelected = iftariSelected.replace("dates", "small apricot").replace("Dates", "Guavas").replace("samosa", "baked chickpea cutlet");
    notesSelected += " Diabetes focus: Use low-glycemic foods. Monitor blood sugar regularly.";
  }

  // Adjustments for High Blood Pressure
  if (hasHBP) {
    bSelected = bSelected + " (Made with no added salt)";
    lSelected = lSelected + " (Prepared with zero salt and low oil)";
    dSelected = dSelected + " (Salt-free light seasoning)";
    notesSelected += " Blood pressure focus: Reduce sodium. Avoid pickles or canned foods.";
  }

  // Adjustments for Heart Condition
  if (hasHeart) {
    bSelected = bSelected.replace("canola oil", "heart-healthy olive oil");
    lSelected = lSelected.replace("canola oil", "heart-healthy olive oil");
    dSelected = dSelected.replace("canola oil", "heart-healthy olive oil");
    notesSelected += " Heart health focus: Choose clean unsaturated fats like almonds and olive oil.";
  }

  return {
    breakfast: isRamadan ? "N/A" : bSelected,
    lunch: isRamadan ? "N/A" : lSelected,
    snack: isRamadan ? "N/A" : sSelected,
    dinner: dSelected,
    sehri: isRamadan ? sehriSelected : "N/A",
    iftari: isRamadan ? iftariSelected : "N/A",
    isRamadan,
    notes: notesSelected + " (Local Wellness Backup Plan Active)"
  };
};

app.post("/api/generate-meal-plan", async (req, res) => {
  const { profile, metrics, isRamadan, foodPrefOverride, mealCount, day } = req.body;
  if (!profile || !metrics) {
    return res.status(400).json({ error: "Missing profile or metrics data." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallbackPlan = generateLocalFallbackMealPlan(profile, metrics, isRamadan, foodPrefOverride, mealCount, day);
    return res.json({ mealPlan: fallbackPlan });
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const dayString = day ? `Day ${day} of 7` : "1 Day plan";

  const prompt = `Generate a personalized traditional Pakistani meal plan for ${dayString} based on this user profile:
- Goal: ${profile.goal}
- General Food Preference: ${profile.foodPreferences.join(", ")}
- Custom Meal Choice preference: ${foodPrefOverride || "A Mix of Both Desi and Western (Recommended)"}
- How many meals a day: ${mealCount || "4 Meals (Breakfast, Lunch, Dinner, and Snack)"}
- Is Fasting (Ramadan): ${isRamadan ? "Yes (Sehri & Iftari required)" : "No (Breakfast, Lunch, Snack & Dinner)"}
- Daily Calorie Target: ${metrics.calories} kcal/day
- Daily Protein Target: ${metrics.protein} g/day
- Health Conditions: ${profile.healthConditions.join(", ")}

STRICT OUTPUT CONSTRAINTS:
1. Respond ONLY in simple, clear English suitable for 6th-8th grade reading level.
2. Do NOT write in Urdu script or Roman Urdu/Hinglish (no words like Shukriya, Khana, Sehat, Sehatmand, Acha, Dobara). Use English translations like whole-wheat bread instead of roti, lentil soup instead of daal, and spiced tea instead of chai.
3. Avoid all high-glycemic or heavily fried foods if the user has Diabetes or High Blood Pressure. Suggest air-fried or low-oil baked options.
4. Keep meal titles literal and easy to understand (e.g., "Oatmeal porridge", "Whole-wheat flatbread with chicken curry", "Sliced cucumber and yogurt dip").
5. Do not write complex sentences. Every meal description step must be under 12 words.
6. Target the calorie budget of ${metrics.calories} kcal.
7. Since this is for ${dayString}, make sure the meal choices are unique, varied, and distinct from other days of the week so the user enjoys different healthy traditional meals daily.`;

  let attempts = 3;
  let delay = 1000;

  while (attempts > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert digital nutritionist for the Pakistani community. You write in simple English, keeping every sentence under 12 words, with zero medical jargon and zero Urdu script or Roman Urdu words.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING, description: "Plain English breakfast meal description. Put N/A if fasting." },
              lunch: { type: Type.STRING, description: "Plain English lunch meal description. Put N/A if fasting." },
              snack: { type: Type.STRING, description: "Plain English snack description. Put N/A if fasting." },
              dinner: { type: Type.STRING, description: "Plain English dinner meal description." },
              sehri: { type: Type.STRING, description: "Plain English Sehri meal description. Put N/A if not fasting." },
              iftari: { type: Type.STRING, description: "Plain English Iftari meal description. Put N/A if not fasting." },
              isRamadan: { type: Type.BOOLEAN, description: "Set to true if user is fasting in Ramadan." },
              notes: { type: Type.STRING, description: "Plain English healthy nutrition tips. Every sentence must be under 12 words." }
            },
            required: ["dinner", "notes", "isRamadan"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text returned from the model.");
      }

      const mealPlan = JSON.parse(responseText.trim());
      return res.json({ mealPlan });
    } catch (err: any) {
      attempts--;
      console.warn(`Attempt failed for Gemini meal plan generation (${attempts} retries left):`, err?.message || err);
      
      if (attempts <= 0) {
        console.log("Gemini API persistently unavailable or rate-limited. Falling back to clean local meal plan generator...");
        const fallbackPlan = generateLocalFallbackMealPlan(profile, metrics, isRamadan, foodPrefOverride, mealCount, day);
        return res.json({ mealPlan: fallbackPlan });
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
});

// Helper for supportive mind chat local fallback
const generateLocalFallbackChat = (messages: any[], mode: string, profile: any) => {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const lowercaseMsg = lastUserMessage.toLowerCase();
  
  let response = "";
  const name = profile?.name || "Friend";
  
  if (mode === 'CBT Coach') {
    if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('worry') || lowercaseMsg.includes('fear')) {
      response = `Assalamu alaikum, ${name}. It is completely normal to feel anxious. Let's pause and write down the specific automatic thought causing this worry. Ask yourself: 'What is the absolute worst that could happen, and what is the evidence that this scenario will actually occur?' Let's reframe this thought together to something more grounded and realistic.`;
    } else if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed') || lowercaseMsg.includes('low') || lowercaseMsg.includes('crying') || lowercaseMsg.includes('grief')) {
      response = `I hear you, ${name}, and I am so sorry you are going through this heavy sadness. When our mood is low, our minds tend to amplify negative thoughts and filter out any hope. Let's challenge this by taking one very small, gentle step. Can you think of one tiny thing you can do for yourself right now, like drinking a warm cup of water or taking 3 deep breaths?`;
    } else if (lowercaseMsg.includes('stressed') || lowercaseMsg.includes('overwhelmed') || lowercaseMsg.includes('pressure') || lowercaseMsg.includes('tired') || lowercaseMsg.includes('exhausted')) {
      response = `It sounds like you're carrying a massive burden right now, ${name}. Let's break this mountain of stress into smaller, manageable stones. First, let's separate things: What is within your direct control right now, and what is not? Let's release the things you cannot change today, and focus solely on one small thing you can control.`;
    } else if (lowercaseMsg.includes('fail') || lowercaseMsg.includes('mistake') || lowercaseMsg.includes('guilt') || lowercaseMsg.includes('regret') || lowercaseMsg.includes('bad')) {
      response = `Making a mistake is a natural part of being human. Often, we catastrophize and label ourselves as 'failures.' Let's try to distance yourself from the label. What is a kinder, more compassionate way to describe what happened? What advice would you give a close friend in this exact situation?`;
    } else {
      response = `Thank you for sharing that with me, ${name}. As your dedicated CBT Coach, I'm here to help you examine any stressful or automatic thoughts. What specific situation or thought is causing you stress right now? Let's analyze the evidence together and find a healthy, balanced perspective.`;
    }
  } else if (mode === 'Deep Listen') {
    if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('worry')) {
      response = `I hear how intense and overwhelming that anxiety feels right now, ${name}. It's like your chest is tight and your thoughts are racing. Please know that you are completely safe here, and you do not have to fix anything right this second. Just breathe, and tell me more about what you're feeling. I am right here with you, listening.`;
    } else if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed') || lowercaseMsg.includes('low') || lowercaseMsg.includes('crying')) {
      response = `I am so incredibly sorry you are feeling this pain, ${name}. It sounds deeply exhausting, and it is okay to feel sad, to cry, or to just feel completely flat. Your feelings are fully valid. I'm not here to push solutions on you—I just want you to know that you are not alone. I'm right here holding space for you.`;
    } else if (lowercaseMsg.includes('stressed') || lowercaseMsg.includes('overwhelmed') || lowercaseMsg.includes('pressure')) {
      response = `That sounds like an incredible amount of pressure, ${name}. It feels like you're being pulled in a million directions at once with absolutely no space for yourself. That is so hard. Please take all the time you need to vent and share. I am listening closely to everything you're carrying.`;
    } else {
      response = `Thank you for sharing your heart with me, ${name}. It sounds like you are navigating some really complex emotions right now. Please go on — I am here to listen with full compassion and no judgment whatsoever. What's the heaviest part of this for you?`;
    }
  } else { // Friend Mode
    if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('worry')) {
      response = `Aw, I wish I could give you a massive hug right now, ${name}! 💙 Anxiety is the absolute worst, but please remember how strong and capable you are. You've gotten through so much before! Let's take a slow, deep breath together. What is one tiny pleasant distraction we can focus on? I'm always in your corner!`;
    } else if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed') || lowercaseMsg.includes('low') || lowercaseMsg.includes('feeling down')) {
      response = `Oh, I'm so sorry you're feeling low today! 💙 Please remember you are an incredibly precious person, and you don't have to be perfect or happy all the time. I'm your loyal friend, and I'm right here to support you. Let's do something gentle together—maybe listen to a favorite song or just rest. You are doing great!`;
    } else if (lowercaseMsg.includes('stressed') || lowercaseMsg.includes('overwhelmed') || lowercaseMsg.includes('pressure')) {
      response = `Wow, that sounds like a super busy and stressful time! 🤯 You've been working so hard, but you definitely deserve a relaxing break. Let's declare a 5-minute 'peace and quiet' break right now. Go get some cool water, stretch your arms, and remember: you are doing your absolute best, and I'm super proud of you!`;
    } else if (lowercaseMsg.includes('thank') || lowercaseMsg.includes('thanks') || lowercaseMsg.includes('good') || lowercaseMsg.includes('happy')) {
      response = `Yay! That makes me so happy to hear, ${name}! 😊 I love being here for you. What else is making you smile today, or is there anything else you'd like to chat about? I'm always excited to hear from you!`;
    } else {
      response = `Hey there, ${name}! I'm so glad we're chatting. You've got a true friend in me! How are you doing today, and what's on your mind? I'm all ears and ready to cheer you on! 🎉`;
    }
  }
  
  return { response };
};

app.post("/api/supportive-mind-chat", async (req, res) => {
  try {
    const { messages, mode, profile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages." });
    }

    const activeMode = mode || "CBT Coach";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackChat = generateLocalFallbackChat(messages, activeMode, profile);
      return res.json({ response: fallbackChat.response });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let systemInstruction = "You are a warm, supportive, and kind AI Mind Coach for Pakistan HealthCare Hub.";
    if (activeMode === 'CBT Coach') {
      systemInstruction = `You are a professional Cognitive Behavioral Therapy (CBT) Mind Coach for the Pakistan HealthCare Hub. Your purpose is to help the user identify negative cognitive biases (like catastrophizing, black-and-white thinking, emotional reasoning, or overgeneralization), challenge those thoughts with logic and evidence, and reframe them into realistic, constructive thoughts. Keep your tone extremely gentle, warm, highly supportive, and professional. Ask thoughtful open-ended questions to guide the user to their own healthy reframings. Keep answers concise (under 120 words), beautifully formatted with bullet points if helpful, and easy to read. Avoid any Urdu script or Roman Urdu words. Focus on practical mental wellness. Reference their profile details if relevant (User name: ${profile?.name || "Friend"}, goal: ${profile?.goal || "general wellness"}).`;
    } else if (activeMode === 'Deep Listen') {
      systemInstruction = `You are an empathetic, compassionate listener practicing reflective and person-centered support for Pakistan HealthCare Hub. Your primary goal is to validate the user's emotions, make them feel deeply heard, and provide a safe space to vent. Do NOT rush to offer solutions or fix their problems unless they explicitly ask you to. Mirror their feelings, show high empathy, and use supportive, warm, and gentle language. Keep answers concise (under 100 words), comforting, and simple. Avoid any Urdu script or Roman Urdu words. Reference their name if relevant (User name: ${profile?.name || "Friend"}).`;
    } else if (activeMode === 'Friend Mode') {
      systemInstruction = `You are a warm, cheerful, and highly encouraging companion and friend for the Pakistan HealthCare Hub. Talk like a supportive friend who cares about the user's well-being, cheers them up, celebrates small wins, and keeps things light. Use friendly, positive, and energetic language, and offer unconditional support. Keep answers casual, brief, and extremely comforting. Avoid any Urdu script or Roman Urdu words. Reference their name if relevant (User name: ${profile?.name || "Friend"}).`;
    }

    const mappedContents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const cleanContents: any[] = [];
    let lastRole = null;
    for (const msg of mappedContents) {
      if (msg.role !== lastRole) {
        cleanContents.push(msg);
        lastRole = msg.role;
      } else {
        if (cleanContents.length > 0) {
          cleanContents[cleanContents.length - 1].parts[0].text += "\n" + msg.parts[0].text;
        } else {
          cleanContents.push(msg);
          lastRole = msg.role;
        }
      }
    }

    let attempts = 3;
    let delayMs = 1000;

    while (attempts > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: cleanContents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("No response text from Gemini.");
        }

        return res.json({ response: responseText.trim() });
      } catch (err: any) {
        attempts--;
        console.warn(`Attempt failed for Gemini mind coach chat (${attempts} retries left):`, err?.message || err);
        
        if (attempts <= 0) {
          console.log("Gemini API persistently unavailable. Falling back to local chat generator...");
          const fallbackChat = generateLocalFallbackChat(messages, activeMode, profile);
          return res.json({ response: fallbackChat.response });
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  } catch (routeErr: any) {
    console.error("Route error in /api/supportive-mind-chat:", routeErr);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/scan-food-photo", async (req, res) => {
  const { base64Image, assignedMealSlot } = req.body;
  try {
    if (!base64Image || !assignedMealSlot) {
      return res.status(400).json({ error: "Missing image data or meal slot." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API key is not configured. Using local fallback scanner...");
      return res.json({
        scanResult: {
          foodName: `${assignedMealSlot} Platter (Offline Fallback)`,
          calories: assignedMealSlot === 'Breakfast' ? 320 : assignedMealSlot === 'Snack' ? 150 : 540,
          protein: assignedMealSlot === 'Breakfast' ? 18 : assignedMealSlot === 'Snack' ? 6 : 28,
          carbs: assignedMealSlot === 'Breakfast' ? 35 : assignedMealSlot === 'Snack' ? 20 : 55,
          fat: assignedMealSlot === 'Breakfast' ? 10 : assignedMealSlot === 'Snack' ? 4 : 18,
          confidence: 0.75,
          notes: "Estimated locally. Configure a valid Gemini API key in your .env for real-time visual AI scanning."
        }
      });
    }

    // Clean base64 and extract mimeType
    let base64Data = base64Image;
    let mimeType = "image/jpeg";
    if (base64Image.includes(";base64,")) {
      const parts = base64Image.split(";base64,");
      mimeType = parts[0].split(":")[1] || "image/jpeg";
      base64Data = parts[1];
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Identify the food shown in this photo, estimating calories, protein, carbs, and fat. This food was eaten as part of a '${assignedMealSlot}' meal slot. If the image is not food, or cannot be identified, return a low confidence score.`;

    let attempts = 3;
    let delayMs = 1000;

    while (attempts > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            prompt
          ],
          config: {
            systemInstruction: "You are an expert nutritionist. Identify the food and provide structured nutritional estimations for a typical portion size. Respond strictly in JSON format.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                foodName: { type: Type.STRING, description: "Identified name of the food dish (e.g. Chicken Biryani, Boiled Egg)." },
                calories: { type: Type.INTEGER, description: "Estimated total calories in kcal." },
                protein: { type: Type.INTEGER, description: "Estimated protein in grams." },
                carbs: { type: Type.INTEGER, description: "Estimated carbohydrates in grams." },
                fat: { type: Type.INTEGER, description: "Estimated fat in grams." },
                confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0." },
                notes: { type: Type.STRING, description: "Brief healthy tips or ingredients breakdown." }
              },
              required: ["foodName", "calories", "protein", "carbs", "fat", "confidence", "notes"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("No response text from Gemini.");
        }

        const scanResult = JSON.parse(responseText.trim());
        return res.json({ scanResult });
      } catch (err: any) {
        attempts--;
        console.warn(`Attempt failed for Gemini food photo scan (${attempts} retries left):`, err?.message || err);
        
        if (attempts <= 0) {
          console.warn("Gemini API key is invalid or failed. Returning local fallback photo scan result...");
          return res.json({
            scanResult: {
              foodName: `${assignedMealSlot} Platter (Offline Fallback)`,
              calories: assignedMealSlot === 'Breakfast' ? 320 : assignedMealSlot === 'Snack' ? 150 : 540,
              protein: assignedMealSlot === 'Breakfast' ? 18 : assignedMealSlot === 'Snack' ? 6 : 28,
              carbs: assignedMealSlot === 'Breakfast' ? 35 : assignedMealSlot === 'Snack' ? 20 : 55,
              fat: assignedMealSlot === 'Breakfast' ? 10 : assignedMealSlot === 'Snack' ? 4 : 18,
              confidence: 0.75,
              notes: "Estimated locally due to API failure. Configure a valid Gemini API key in your .env for real-time visual AI scanning."
            }
          });
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  } catch (routeErr: any) {
    console.error("Route error in /api/scan-food-photo:", routeErr);
    return res.json({
      scanResult: {
        foodName: `${assignedMealSlot} Platter (Offline Fallback)`,
        calories: assignedMealSlot === 'Breakfast' ? 320 : assignedMealSlot === 'Snack' ? 150 : 540,
        protein: assignedMealSlot === 'Breakfast' ? 18 : assignedMealSlot === 'Snack' ? 6 : 28,
        carbs: assignedMealSlot === 'Breakfast' ? 35 : assignedMealSlot === 'Snack' ? 20 : 55,
        fat: assignedMealSlot === 'Breakfast' ? 10 : assignedMealSlot === 'Snack' ? 4 : 18,
        confidence: 0.75,
        notes: "Estimated locally due to system error. Configure a valid Gemini API key in your .env for real-time visual AI scanning."
      }
    });
  }
});

app.post("/api/lookup-food", async (req, res) => {
  const { query, assignedMealSlot } = req.body;
  try {
    if (!query) {
      return res.status(400).json({ error: "Missing search query." });
    }

    const slot = assignedMealSlot || "Lunch";

    // 1. Check local database first
    const queryLower = query.toLowerCase().trim();
    const localMatch = PAKISTANI_FOODS_DB_EXPANDED.find(food => 
      food.name.toLowerCase().includes(queryLower) || 
      food.id.toLowerCase() === queryLower ||
      queryLower.includes(food.id.toLowerCase())
    );

    if (localMatch) {
      return res.json({
        scanResult: {
          foodName: localMatch.name,
          calories: localMatch.calories,
          protein: localMatch.protein,
          carbs: localMatch.carbs,
          fat: localMatch.fat,
          confidence: 1.0,
          notes: `${localMatch.description || ""} ${localMatch.advice || ""}`.trim()
        },
        source: "local"
      });
    }

    // 2. If no local match, send query to Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    
    const getLocalFallback = (q: string) => {
      const searchKey = q.toLowerCase().trim();
      const fuzzyMatch = PAKISTANI_FOODS_DB_EXPANDED.find(f => 
        f.name.toLowerCase().includes(searchKey) || 
        f.id.toLowerCase().includes(searchKey) ||
        searchKey.includes(f.id.toLowerCase())
      ) || {
        name: q,
        calories: 250,
        protein: 8,
        carbs: 35,
        fat: 6,
        advice: "Estimated baseline values for standard portions."
      };

      return {
        scanResult: {
          foodName: fuzzyMatch.name + " (Local Fallback)",
          calories: fuzzyMatch.calories,
          protein: Math.round(fuzzyMatch.protein),
          carbs: Math.round(fuzzyMatch.carbs),
          fat: Math.round(fuzzyMatch.fat),
          confidence: 0.8,
          notes: `${(fuzzyMatch as any).advice || ""} (Offline fallback mode - Configure a valid API key in your .env for custom AI).`.trim()
        },
        source: "local"
      };
    };

    if (!apiKey) {
      console.warn("Gemini API key is not configured. Using local fallback lookup...");
      return res.json(getLocalFallback(query));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Identify the food item and estimate its nutrition facts: '${query}'. This food is eaten as part of a '${slot}' meal slot. Assume South Asian/Pakistani cuisine context if ambiguous (e.g., if query is 'dal' or 'roti' or 'salan').`;

    let attempts = 3;
    let delayMs = 1000;

    while (attempts > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are an expert nutritionist specializing in South Asian and Pakistani foods. Analyze the search query, identify the food, and provide structured nutritional estimations for a typical portion size. Respond strictly in JSON format.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                foodName: { type: Type.STRING, description: "Name of the identified food dish in English." },
                calories: { type: Type.INTEGER, description: "Estimated total calories in kcal." },
                protein: { type: Type.INTEGER, description: "Estimated protein in grams." },
                carbs: { type: Type.INTEGER, description: "Estimated carbohydrates in grams." },
                fat: { type: Type.INTEGER, description: "Estimated fat in grams." },
                confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0." },
                notes: { type: Type.STRING, description: "Brief healthy tips or portion info." }
              },
              required: ["foodName", "calories", "protein", "carbs", "fat", "confidence", "notes"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("No response text from Gemini.");
        }

        const scanResult = JSON.parse(responseText.trim());
        return res.json({ scanResult, source: "gemini" });
      } catch (err: any) {
        attempts--;
        console.warn(`Attempt failed for Gemini food lookup (${attempts} retries left):`, err?.message || err);
        
        if (attempts <= 0) {
          console.warn("Gemini API key is invalid or failed. Using local fallback lookup...");
          return res.json(getLocalFallback(query));
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  } catch (routeErr: any) {
    console.error("Route error in /api/lookup-food:", routeErr);
    // Even in total crash, return local fallback instead of raw error page
    try {
      const searchKey = query.toLowerCase().trim();
      const fuzzyMatch = PAKISTANI_FOODS_DB_EXPANDED.find(f => f.name.toLowerCase().includes(searchKey)) || PAKISTANI_FOODS_DB_EXPANDED[0];
      return res.json({
        scanResult: {
          foodName: fuzzyMatch.name + " (Local Fallback)",
          calories: fuzzyMatch.calories,
          protein: Math.round(fuzzyMatch.protein),
          carbs: Math.round(fuzzyMatch.carbs),
          fat: Math.round(fuzzyMatch.fat),
          confidence: 0.8,
          notes: `${fuzzyMatch.advice} (Offline fallback mode)`
        },
        source: "local"
      });
    } catch {
      return res.status(500).json({ error: "Couldn't identify this food, try again or search manually." });
    }
  }
});

app.post("/api/compare-foods", async (req, res) => {
  const { foodA, foodB } = req.body;
  const getLocalCompareFallback = (faName: string, fbName: string) => {
    const findFood = (name: string) => {
      const n = name.toLowerCase().trim();
      return PAKISTANI_FOODS_DB_EXPANDED.find(f => 
        f.name.toLowerCase().includes(n) || 
        f.id.toLowerCase() === n ||
        n.includes(f.id.toLowerCase())
      ) || {
        name: name,
        calories: 320,
        protein: 12,
        carbs: 40,
        fat: 8,
        fiber: 2,
        healthGrade: 'B' as const
      };
    };
    const fA = findFood(faName);
    const fB = findFood(fbName);
    return {
      comparisonResult: {
        foodAName: fA.name,
        foodBName: fB.name,
        foodAStats: {
          calories: fA.calories,
          protein: fA.protein,
          fiber: (fA as any).fiber || 2.0,
          iron: 1.5,
          sodium: 320
        },
        foodBStats: {
          calories: fB.calories,
          protein: fB.protein,
          fiber: (fB as any).fiber || 1.0,
          iron: 0.8,
          sodium: 680
        },
        takeaway: `Offline Comparison: ${fA.name} is generally a more whole-grain, fiber-dense choice than ${fB.name}. Configure a valid Gemini API key in your .env for live AI-driven dietitian verdict.`
      }
    };
  };

  try {
    if (!foodA || !foodB) {
      return res.status(400).json({ error: "Missing foodA or foodB parameters." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key is not configured. Using local fallback comparison...");
      return res.json(getLocalCompareFallback(foodA, foodB));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Perform a side-by-side nutritional comparison between:
1. Food A (Traditional/Desi): '${foodA}'
2. Food B (Western/Fast-food): '${foodB}'

Estimate calories (kcal), protein (g), dietary fiber (g), iron (mg), and sodium (mg) for typical serving portions of each, and write one short plain-English takeaway sentence explaining which is healthier and why.`;

    let attempts = 3;
    let delayMs = 1000;

    while (attempts > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a professional dietitian specializing in South Asian and international nutrition. Compare the two foods side-by-side. Estimate typical serving portion weights and evaluate their macros. Respond strictly in JSON format.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                foodAName: { type: Type.STRING },
                foodBName: { type: Type.STRING },
                foodAStats: {
                  type: Type.OBJECT,
                  properties: {
                    calories: { type: Type.INTEGER, description: "Calories in kcal" },
                    protein: { type: Type.NUMBER, description: "Protein in grams" },
                    fiber: { type: Type.NUMBER, description: "Dietary fiber in grams" },
                    iron: { type: Type.NUMBER, description: "Iron in mg" },
                    sodium: { type: Type.NUMBER, description: "Sodium in mg" }
                  },
                  required: ["calories", "protein", "fiber", "iron", "sodium"]
                },
                foodBStats: {
                  type: Type.OBJECT,
                  properties: {
                    calories: { type: Type.INTEGER, description: "Calories in kcal" },
                    protein: { type: Type.NUMBER, description: "Protein in grams" },
                    fiber: { type: Type.NUMBER, description: "Dietary fiber in grams" },
                    iron: { type: Type.NUMBER, description: "Iron in mg" },
                    sodium: { type: Type.NUMBER, description: "Sodium in mg" }
                  },
                  required: ["calories", "protein", "fiber", "iron", "sodium"]
                },
                takeaway: { type: Type.STRING, description: "Short plain-English summary takeaway sentence (max 2 sentences)." }
              },
              required: ["foodAName", "foodBName", "foodAStats", "foodBStats", "takeaway"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("No response text from Gemini.");
        }

        const comparisonResult = JSON.parse(responseText.trim());
        return res.json({ comparisonResult });
      } catch (err: any) {
        attempts--;
        console.warn(`Attempt failed for Gemini food comparison (${attempts} retries left):`, err?.message || err);
        
        if (attempts <= 0) {
          console.warn("Gemini API key is invalid or failed. Using local fallback comparison...");
          return res.json(getLocalCompareFallback(foodA, foodB));
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  } catch (routeErr: any) {
    console.error("Route error in /api/compare-foods:", routeErr);
    try {
      return res.json(getLocalCompareFallback(foodA, foodB));
    } catch {
      return res.status(500).json({ error: "Failed to generate comparison. Please check your inputs and try again." });
    }
  }
});

app.post("/api/generate-recipe", async (req, res) => {
  const {
    primaryGoal,
    mealCategory,
    cuisineStyle,
    caloriesGoal,
    minProteinTarget,
    maxCookingTime,
    allergies,
    onHandIngredients
  } = req.body;

  const getLocalRecipeFallback = (
    pGoal: string,
    mCategory: string,
    cStyle: string,
    calGoal: number,
    pTarget: number,
    onHand: string
  ) => {
    const actualCal = calGoal ? parseInt(calGoal as any, 10) : 450;
    const actualProtein = pTarget ? parseInt(pTarget as any, 10) : 30;
    return {
      recipe: {
        title: `Healthy ${cStyle || "Desi"} ${mCategory || "Lunch"} Bowl (Offline)`,
        ingredients: [
          { name: onHand ? `Prioritized: ${onHand}` : "Chicken breast or Paneer", amount: "150", unit: "g" },
          { name: "Sautéed vegetables (spinach, cabbage, okra)", amount: "1.5", unit: "cups" },
          { name: "Olive oil or Canola oil", amount: "1", unit: "tsp" },
          { name: "Whole-wheat flatbread or Brown rice", amount: "1", unit: "serving" }
        ],
        steps: [
          "Wash and prep the chicken or paneer, and chop vegetables into medium chunks.",
          "Heat 1 tsp oil in a pan, toss in spices (turmeric, cumin, garlic), and cook protein.",
          "Toss in vegetables and sauté for 4-5 minutes until cooked but still crispy.",
          "Serve warm alongside whole wheat bread or cooked brown rice portion."
        ],
        notes: `Optimized for '${pGoal || "Wellness"}' goal. Offline mode - Configure a valid Gemini API key in your .env for custom AI chef creation.`,
        calories: actualCal,
        protein: actualProtein,
        carbs: Math.round(actualCal * 0.45 / 4),
        fat: Math.round(actualCal * 0.25 / 9)
      }
    };
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key is not configured. Using local fallback recipe...");
      return res.json(getLocalRecipeFallback(primaryGoal, mealCategory, cuisineStyle, caloriesGoal, minProteinTarget, onHandIngredients));
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Create a custom recipe with these constraints:
- Primary Goal: ${primaryGoal || "Stay Fit"}
- Meal Category: ${mealCategory || "Lunch"}
- Cuisine Style: ${cuisineStyle || "Home-Cooked"}
- Target Calories: ~${caloriesGoal || 500} kcal
- Target Protein: At least ${minProteinTarget || 20} grams
- Maximum Cooking Time: ${maxCookingTime || 30} minutes
- Allergies to avoid: ${allergies || "None"}
- Ingredients to prioritize: ${onHandIngredients || "Any"}

Make it a highly authentic and delicious recipe. Evaluate the final macronutrients accurately.`;

    let attempts = 3;
    let delayMs = 1000;

    while (attempts > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a professional chef and nutritionist. Generate a single complete recipe matching the requested goal, cuisine, and timing constraints. Make sure ingredients list exact quantities. Respond strictly in JSON format matching the schema.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      unit: { type: Type.STRING }
                    },
                    required: ["name", "amount", "unit"]
                  }
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                notes: { type: Type.STRING },
                calories: { type: Type.INTEGER, description: "Total calories in kcal" },
                protein: { type: Type.INTEGER, description: "Protein in grams" },
                carbs: { type: Type.INTEGER, description: "Carbs in grams" },
                fat: { type: Type.INTEGER, description: "Fat in grams" }
              },
              required: ["title", "ingredients", "steps", "notes", "calories", "protein", "carbs", "fat"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("No response text from Gemini.");
        }

        const recipeResult = JSON.parse(responseText.trim());
        return res.json({ recipe: recipeResult });
      } catch (err: any) {
        attempts--;
        console.warn(`Attempt failed for Gemini recipe generation (${attempts} retries left):`, err?.message || err);
        
        if (attempts <= 0) {
          console.warn("Gemini API key is invalid or failed. Using local fallback recipe...");
          return res.json(getLocalRecipeFallback(primaryGoal, mealCategory, cuisineStyle, caloriesGoal, minProteinTarget, onHandIngredients));
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  } catch (routeErr: any) {
    console.error("Route error in /api/generate-recipe:", routeErr);
    try {
      return res.json(getLocalRecipeFallback(primaryGoal, mealCategory, cuisineStyle, caloriesGoal, minProteinTarget, onHandIngredients));
    } catch {
      return res.status(500).json({ error: "Failed to generate recipe. Please refine your inputs and try again." });
    }
  }
});

export default app;
