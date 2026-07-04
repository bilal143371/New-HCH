import { MealPlan } from '../types';

export interface StaticMealPlanVariation {
  id: string;
  name: string;
  description: string;
  targetCalories: number;
  targetProtein: number;
  tag: string;
  days: {
    [dayNum: number]: MealPlan;
  };
}

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
  swapWith?: string; // ID of a healthier alternative
}

// 1. READY-MADE 7-DAY DIET PLANS
export const DIET_PLAN_VARIATIONS: StaticMealPlanVariation[] = [
  {
    id: 'fat-loss-desi',
    name: 'Fat Loss & Portion Control (Desi-Hybrid)',
    description: 'A caloric deficit plan limiting saturated fats and replacing simple carbs with fiber-rich Pakistani whole-food alternatives.',
    targetCalories: 1600,
    targetProtein: 85,
    tag: 'Weight Loss',
    days: {
      1: {
        breakfast: '1 small whole-wheat Lal Atta Roti with 2 boiled egg whites & green tea (no sugar).',
        lunch: '1 cup Boiled Yellow Daal served with 1 plate raw cucumber and carrot salad (no rice/bread).',
        snack: '1 small handful of Dry Roasted Chickpeas (Bhuna Chana, 30g) & fresh lime-water (Nimbu pani, unsweetened).',
        dinner: '150g skinless Grilled Chicken Tikka with mint-yogurt raita (low-fat dahi).',
        notes: 'Keep oil usage under 1 teaspoon today. Drink 3 liters of water to flush out toxins.'
      },
      2: {
        breakfast: 'Oatmeal Porridge (1/2 cup oats) boiled in skimmed milk, topped with 5 almonds & 1/2 sliced banana.',
        lunch: '1 plate Chicken & Veggie stir-fry (cabbage, capsicum) cooked in 1/2 tsp mustard oil with 1 dry chapati.',
        snack: '1 bowl of fresh Fruit Chaat (apple, guava, melon) with a pinch of black salt (no sweet syrup).',
        dinner: '1 portion grilled or baked Fish Tikka (150g) with 1 cup of steamed spinach (Palak).',
        notes: 'Avoid white sugar and bakery biscuits completely. Opt for elaichi green tea if craving tea.'
      },
      3: {
        breakfast: '1 boiled egg, 1 slice of whole-wheat bran bread, and 1 glass of sugar-free low-fat milk.',
        lunch: '1 portion of Moong Daal Khichdi (light brown rice and lentils mixed, 1 cup) with a side of cucumber salad.',
        snack: '1 medium apple or 2 fresh guavas (high fiber, low glycemic impact).',
        dinner: '1 portion of Low-Oil Chicken Karahi (breast meat) served with a large bowl of lettuce salad.',
        notes: 'Fiber intake is high today. This will keep you full and curb late-night dessert cravings.'
      },
      4: {
        breakfast: 'Oat Chapati (made with ground oats) with 1 tablespoon of low-fat cottage cheese & unsweetened green tea.',
        lunch: 'Grilled Chicken breast salad with tomatoes, cucumber, mint, and lemon-olive oil dressing.',
        snack: '1 cup of plain low-fat yogurt (Dahi) with 1 teaspoon of pre-soaked Chia seeds.',
        dinner: '1 bowl of Spiced Lentil Soup (Daal soup) cooked with fresh ginger and garlic.',
        notes: 'Chia seeds (Tukh-malanga) are excellent for gut health and keeping your blood glucose stable.'
      },
      5: {
        breakfast: '2 scrambled egg whites with spinach and onions, plus 1 cup of black tea (no sugar).',
        lunch: '1 dry Tandoori Roti with 1 cup of Bhindi Masala (Okra cooked in minimal oil) and mint raita.',
        snack: '1 handful of roasted walnuts and almonds (30g) for healthy omega-3 fatty acids.',
        dinner: '150g grilled fish or chicken skewers with sautéed capsicum and onions.',
        notes: 'Healthy fats from walnuts support brain health and reduce systemic inflammation.'
      },
      6: {
        breakfast: 'Oatmeal cooked in water, sweetened with half a date, topped with a pinch of cinnamon.',
        lunch: '1 cup of boiled red beans (Lobia chaat) with chopped tomatoes, onions, mint, and fresh lemon juice.',
        snack: '1 glass of cold Mint Lassi (made with low-fat yogurt and water, unsweetened).',
        dinner: '1 portion of lean Beef Shami Kabab (pan-seared in 1/2 tsp oil) with a raw green salad.',
        notes: 'Lobia (Red kidney beans) are incredibly rich in fiber and iron, perfect for clean fat loss.'
      },
      7: {
        breakfast: '1 boiled egg, 1 small Lal Atta Roti, and a warm cup of green tea.',
        lunch: '1 plate of Steamed Chicken Breast with sautéed seasonal gourds (Lauki/Tinda) cooked with minimal oil.',
        snack: '1 sliced cucumber with 2 tablespoons of hummus or low-fat yogurt dip.',
        dinner: '1 bowl of high-protein Chickpea Salad (Chana Chaat) with plenty of onions, tomatoes, and lemon.',
        notes: 'Reflect on your week. You have avoided empty sugar calories and focused on premium, clean proteins.'
      }
    }
  },
  {
    id: 'lean-muscle',
    name: 'Lean Muscle & Hypertrophy (High-Protein)',
    description: 'Designed for optimal protein delivery, rich in amino acids with healthy fats to power muscle tissue repair and strength.',
    targetCalories: 2400,
    targetProtein: 135,
    tag: 'Muscle Gain',
    days: {
      1: {
        breakfast: '3 whole scrambled eggs in 1 tsp olive oil, 2 slices of whole-wheat bran bread, and 1 glass of low-fat milk.',
        lunch: '200g Grilled Chicken Breast with 1.5 cups of boiled brown rice and steamed broccoli.',
        snack: 'Double Beef Shami Kabab (baked or light pan-fried) with 1 cup of plain Greek yogurt.',
        dinner: '150g Lean Beef Steak or Grilled Chicken breast with 1 medium sweet potato and raw salad.',
        notes: 'Focus on consuming clean proteins every 3-4 hours. Post-workout protein timing is highly recommended.'
      },
      2: {
        breakfast: 'High-protein Oats: 1 cup rolled oats boiled in skimmed milk, 2 boiled eggs (whites only), 1 tbsp peanut butter.',
        lunch: '1 plate Chicken Biryani cooked with minimal oil (breast pieces), served with a large cup of high-protein dahi.',
        snack: '30g Roasted Almonds & 1 glass of Protein Milkshake (blended milk, banana, and 1 tbsp chia seeds).',
        dinner: '200g baked Fish Tikka (Rahu or Salmon) with 1 dry chapati and sautéed spinach.',
        notes: 'Excellent calorie pacing. The healthy fats in almonds and peanut butter support natural hormone health.'
      },
      3: {
        breakfast: 'Oatmeal pancake (made with 1/2 cup oats, 3 egg whites, and 1 banana) served with black coffee.',
        lunch: '1 cup of cooked Chickpeas (White Chana) curry with 2 dry Rotis and a side of spinach salad.',
        snack: '1 bowl of Greek Yogurt (Dahi) with sliced strawberries, 5 walnuts, and 1 teaspoon of flaxseeds.',
        dinner: '200g Grilled Chicken Tikka skewers with grilled tomatoes, bell peppers, and onion rings.',
        notes: 'Flaxseeds provide essential ALA omega-3s which promote joint health and reduce muscle soreness.'
      },
      4: {
        breakfast: '3 boiled egg whites, 1 whole egg, 2 slices of toast with 1 tablespoon of peanut butter, and 1 apple.',
        lunch: 'Chicken Seekh Kabab (3 skewers) served with 1 cup of boiled quinoa or brown rice and mint chutney.',
        snack: '1 bowl of High-Protein Bean Salad (Red kidney beans, chickpeas, black beans) with lemon dressing.',
        dinner: '1 portion of lean cooked Mutton/Beef Keema (minced meat, low fat) with 1 dry whole-wheat Roti.',
        notes: 'Quinoa is a complete protein containing all nine essential amino acids necessary for muscle hypertrophy.'
      },
      5: {
        breakfast: 'High-Protein Lassi (blended low-fat Greek yogurt, water, mint, and 1 boiled egg on the side).',
        lunch: '200g Pan-seared Fish with 1 portion of roasted baby potatoes and steam vegetable medley.',
        snack: 'Handful of roasted pumpkin seeds (high in zinc and magnesium) & 1 medium banana.',
        dinner: '200g Chicken breast Karahi (cooked in light tomato gravy, no butter) with 1 whole chapati.',
        notes: 'Magnesium and zinc in pumpkin seeds support protein synthesis and promote deeper sleep.'
      },
      6: {
        breakfast: '3 egg white omelette with mushrooms, tomatoes, and spinach, plus 2 slices of whole-wheat bread.',
        lunch: '1 bowl of Beef Haleem (traditional high-protein lentil and beef stew) served with raw ginger and lemon.',
        snack: '1 bowl of fruit salad with 5 almonds and 1 cup of low-fat cottage cheese.',
        dinner: '200g baked or grilled Chicken breast with 1.5 cups of stir-fried brown rice and mixed vegetables.',
        notes: 'Haleem is a slow-digesting, highly nutritious traditional meal packed with complete protein and fiber.'
      },
      7: {
        breakfast: 'Oat porridge made with protein milk, 1 sliced banana, 1 tablespoon of peanut butter, and 2 boiled eggs.',
        lunch: '1 portion of Daal Chawal (brown rice and yellow lentils) paired with 150g of Grilled Chicken Tikka.',
        snack: '1 small plate of Dry Roasted Chana (chickpeas) and 1 glass of low-fat milk.',
        dinner: '200g of grilled Salmon or local Rahu fish with sautéed spinach and a sweet potato mash.',
        notes: 'Take time to rest and let your muscle fibers repair. Consistency is your greatest strength.'
      }
    }
  },
  {
    id: 'diabetes-safe',
    name: 'Diabetes Care & Low Glycemic (Carb-Conscious)',
    description: 'Limits fast-acting sugars, white flour, and polished rice. Emphasizes low GI complex carbs, lean proteins, and soluble fiber.',
    targetCalories: 1700,
    targetProtein: 90,
    tag: 'Diabetes Safe',
    days: {
      1: {
        breakfast: '1 medium Lal Atta Roti (whole-wheat, unrefined) with 2 boiled egg whites & green tea (no sugar/milk).',
        lunch: '1 cup cooked Karela Gosht (bitter gourd with lean mutton/chicken) served with 1 large cucumber salad.',
        snack: '1 small handful of Bhuna Chana (roasted chickpeas, 30g) and unsweetened lemon-mint water.',
        dinner: '150g skinless Grilled Chicken Tikka with 1 cup low-fat sugar-free plain yogurt (Dahi).',
        notes: 'Avoid white rice, white bread, and refined sugar completely. Bitter gourd contains insulin-like compounds.'
      },
      2: {
        breakfast: 'Oatmeal Porridge (1/2 cup steel-cut oats) boiled in water with a splash of almond milk and cinnamon.',
        lunch: '1 bowl of high-fiber Lobia (Red Kidney Bean) salad with raw onions, cabbage, cucumber, and lemon juice.',
        snack: '1 medium raw guava (excellent fiber source, low glycemic index).',
        dinner: '150g baked Rahu Fish Tikka with steamed cauliflower mash and sautéed green beans.',
        notes: 'Cinnamon helps naturally support insulin sensitivity. Red beans provide clean slow-release carbohydrates.'
      },
      3: {
        breakfast: '2 scrambled egg whites with spinach, onions, and tomatoes, plus 1 slice of high-fiber bran bread.',
        lunch: '1 bowl of Moong Daal soup cooked with ginger, garlic, and cumin, served with grilled chicken breast (120g).',
        snack: '1 sliced cucumber and celery sticks dipped in 2 tablespoons of plain hummus.',
        dinner: '1 portion of Low-Oil Chicken Karahi with 1 small dry chapati made from barley flour.',
        notes: 'Barley flour (Jau ka atta) has an exceptionally low glycemic index compared to standard commercial flour.'
      },
      4: {
        breakfast: '1 hard-boiled egg, 1 cup of plain unsweetened dahi with a sprinkle of chia seeds, and green tea.',
        lunch: 'Grilled Chicken Salad with avocado slices, lettuce, cucumber, spinach, and a light lemon-herb dressing.',
        snack: '1 handful of raw walnuts (5-6 halves) which provide healthy polyunsaturated fats.',
        dinner: '1 bowl of boiled black chickpeas (Kala Chana chaat) with diced tomatoes, onions, and fresh coriander.',
        notes: 'Kala Chana is packed with soluble fiber which prevents sudden post-meal blood sugar spikes.'
      },
      5: {
        breakfast: 'Barley Porridge (Jau ka daliya) cooked in skimmed milk, sweetened with a pinch of stevia if needed.',
        lunch: '1 dry unrefined whole-wheat chapati with 1 cup of cooked Sarson ka Saag (mustard greens) and salad.',
        snack: '1 medium apple with skin (do not peel, the skin contains pectin fiber that slows sugar absorption).',
        dinner: '150g of grilled fish fillet with sautéed bell peppers, onions, and broccoli.',
        notes: 'Mustard greens are packed with antioxidants and fiber that assist in metabolic regulation.'
      },
      6: {
        breakfast: '2 egg whites poached, served on a bed of sautéed spinach and mushrooms, with unsweetened black tea.',
        lunch: '1 portion of mixed vegetable curry (using low GI veggies like okra, spinach, cauliflower) with 1 small barley Roti.',
        snack: '1 cup of cold buttermilk (sugar-free Lassi made with thin yogurt and water).',
        dinner: '150g steamed or grilled chicken breast with a large plate of shredded green cabbage and mint salad.',
        notes: 'Okra (Bhindi) contains mucilage fiber which slows down glucose absorption in the intestinal tract.'
      },
      7: {
        breakfast: 'Oat Chapati with a thin spread of cottage cheese, 1 boiled egg white, and 1 cup of chamomile tea.',
        lunch: '1 bowl of high-protein chicken soup with cabbage, carrots, celery, and ginger (no cornstarch).',
        snack: 'A handful of roasted pumpkin seeds (rich in magnesium which supports glycemic control).',
        dinner: '150g baked fish tikka with a bowl of steamed spinach and sliced raw radishes (Mooli).',
        notes: 'Regular monitoring of fasting glucose levels is recommended. Continue choosing unrefined grains!'
      }
    }
  },
  {
    id: 'heart-healthy',
    name: 'Heart Care & Low Sodium (Cardiovascular)',
    description: 'Prioritizes potassium-rich foods, magnesium, and omega-3 fatty acids while strictly limiting table sodium and trans-fats.',
    targetCalories: 1800,
    targetProtein: 80,
    tag: 'Heart Healthy',
    days: {
      1: {
        breakfast: 'Oatmeal cooked in low-fat milk, topped with 1 tablespoon of ground flaxseeds and 6 raw almonds.',
        lunch: '150g baked Salmon or Rahu fish cooked in 1/2 tsp olive oil, served with a large bowl of lettuce & tomato salad.',
        snack: '1 cup of unsweetened low-fat Greek Dahi with 1/2 cup of fresh blueberries or strawberries.',
        dinner: '1 cup cooked split Moong Daal (no salt added during boiling, garnish with lemon and cumin) with 1 barley Roti.',
        notes: 'Limit processed sodium. Use fresh herbs, garlic, ginger, lemon juice, and black pepper to add natural flavor.'
      },
      2: {
        breakfast: '2 boiled egg whites, 1 slice of low-sodium whole-wheat bread, and 1 glass of fresh orange juice.',
        lunch: 'Grilled Chicken breast (150g, skinless) served with steamed zucchini, broccoli, and 1 small sweet potato.',
        snack: '1 medium banana (high in potassium which naturally counterbalances sodium to lower blood pressure).',
        dinner: '1 portion of cooked Palak Chicken (cooked in olive oil with minimal sodium) served with 1 dry chapati.',
        notes: 'Potassium is highly effective at relaxing blood vessel walls and assisting in blood pressure regulation.'
      },
      3: {
        breakfast: 'Barley Porridge (Jau daliya) with chopped walnuts and sliced banana, plus 1 cup of hibiscus tea.',
        lunch: 'Chickpea salad with diced bell peppers, red onions, cucumbers, parsley, and fresh lemon juice dressing.',
        snack: '1 pear or apple with skin (rich in water-soluble pectin fiber which helps bind dietary cholesterol).',
        dinner: '150g grilled cod or fish tikka with steamed brown rice (1 cup) and sautéed spinach.',
        notes: 'Hibiscus tea has natural cardioprotective properties and has been clinically shown to support blood pressure control.'
      },
      4: {
        breakfast: 'Egg white omelette with spinach, bell peppers, and tomatoes cooked in olive oil spray, plus 1 cup green tea.',
        lunch: '1 bowl of lentil and vegetable soup (cooked with carrots, celery, onions, garlic) and 1 dry chapati.',
        snack: '1 handful of raw unsalted pumpkin seeds.',
        dinner: '150g baked chicken breast with a side of mashed cauliflower (using low-fat milk and garlic instead of butter).',
        notes: 'Garlic contains allicin, a compound known to improve blood flow and reduce arterial stiffness.'
      },
      5: {
        breakfast: 'Oatmeal porridge topped with sliced peaches and chia seeds, served with a cup of warm water with lemon.',
        lunch: 'Tuna or chicken salad made with 1 tablespoon of olive oil and lemon juice, wrapped in lettuce leaves.',
        snack: '1 cup of plain fat-free yogurt with 1 teaspoon of pumpkin seeds.',
        dinner: '1 cup of boiled red kidney beans (Lobia) with 1 portion of grilled fish tikka and a raw salad.',
        notes: 'Omega-3 fatty acids found in fish and chia seeds reduce systemic triglycerides and soothe vascular walls.'
      },
      6: {
        breakfast: '1 boiled egg, 2 boiled egg whites, 1 slice of toasted bran bread, and 1 glass of low-sodium tomato juice.',
        lunch: '1 dry barley Roti served with cooked pumpkin curry (Kaddu ki sabzi) made with minimal olive oil.',
        snack: 'A plate of fresh sliced papaya (rich in lycopene and vitamin C which protect cardiac tissue).',
        dinner: '150g grilled skinless chicken breast with steamed green beans and 1 portion of baked potato halves.',
        notes: 'Papaya and citrus fruits are packed with antioxidant vitamins that prevent cholesterol oxidation in arteries.'
      },
      7: {
        breakfast: 'Oat pancakes topped with 1 teaspoon of raw honey and 5 sliced almonds, served with green tea.',
        lunch: '1 bowl of high-protein Chickpea (Chana) salad with cucumber, tomato, mint, and fresh squeezed lime juice.',
        snack: '1 small handful of unsalted roasted pistachios.',
        dinner: '150g grilled Rahu fish with sautéed spinach and a small cup of boiled wild or brown rice.',
        notes: 'Reflect on a salt-conscious week. Senses adjust quickly to low-sodium levels, revealing true natural flavors.'
      }
    }
  }
];

// 2. EXPANDED LOOKUP & COMPARISON FOOD REGISTRY
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

export const PAKISTANI_FOODS_DB = PAKISTANI_FOODS_DB_EXPANDED;
