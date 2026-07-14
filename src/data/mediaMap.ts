/**
 * mediaMap.ts — Single Source of Truth for Project Media Assets
 * ═════════════════════════════════════════════════════════════
 *
 * LINT-STYLE CHECK:
 * ⚠️ WARNING: DO NOT ASSIGN THE SAME IMAGE FILE TO MORE THAN ONE ENTRY!
 * EVERY KEY IN THIS MAP MUST POINT TO A UNIQUE, EXCLUSIVE FILE PATH.
 */

export const mediaMap = {
  // ─── Dashboard Stat Cards ────────────────────────────────────────
  stat_steps: "/shoes_stride.png",
  stat_calories: "/nutrition_plate.png",
  stat_water: "/water_pour.png",

  // ─── Reminder Center Banners ─────────────────────────────────────
  rem_hydration: "/hydration_window.png",
  rem_sehri: "/sehri_table.png",
  rem_iftari: "/iftari_table.png",

  // ─── Explore Shortcuts ───────────────────────────────────────────
  explore_meals: "/meal_prep_set.png",
  explore_workouts: "/running_doorstep.png",
  explore_mind: "/mind_calm_hands.png",

  // ─── Exercise Cards (Physical) ───────────────────────────────────
  ex_wall_squat: "/ex_wall_squat.png",
  ex_glute_bridge: "/ex_glute_bridge.png",
  ex_calf_raise: "/ex_calf_raise.png",
  ex_arm_raise: "/ex_arm_raise.png",
  ex_wall_pushup: "/ex_wall_pushup.png",
  ex_pushup: "/ex_pushup.png",
  ex_cat_cow: "/ex_cat_cow.png",
  ex_bird_dog: "/ex_bird_dog.png",
  ex_dead_bug: "/ex_dead_bug.png",
  ex_plank: "/ex_plank.png",

  // ─── Exercise Cards (Mental/Mindfulness) ─────────────────────────
  ex_mind_breathing: "/mental_relaxation.png",
  ex_mind_meditation: "/quick_action_coach.png",
  ex_mind_sleep: "/male_meal_prep.png",
  ex_mind_stress: "/fitness_workout.png",
  ex_mind_energy: "/quick_action_workout.png",

  // ─── Workout Tools ───────────────────────────────────────────────
  tool_joint_filter: "/tool_knee_hold.png",
  tool_burn_matcher: "/tool_tracker_wrist.png",

  // ─── Onboarding steps ─────────────────────────────────────────────
  onboarding_welcome: "/onboarding_welcome.png",
  onboarding_metrics: "/onboarding_metrics.png",
  onboarding_results: "/onboarding_results.png",

  // ─── Landing features & Testimonials ──────────────────────────────
  landing_nutrition: "/landing_nutrition.png",
  landing_fitness: "/landing_fitness.png",
  landing_mind: "/landing_mind.png",
  landing_testimonial: "/landing_testimonial.png",

  // ─── Mind support headers ─────────────────────────────────────────
  coach_talk: "/coach_talk.png",
  coach_notebook: "/coach_notebook.png",
  coach_self_log: "/coach_self_log.png",
  breathing_soundscapes: "/breathing_soundscapes.png",

  // ─── Reminder card unique images ──────────────────────────────────
  reminder_fitness: "/reminder_fitness.png",
  reminder_posture: "/reminder_posture.png",
  reminder_breathing: "/reminder_breathing.png",
  reminder_sleep: "/reminder_sleep.png",
  reminder_meals: "/reminder_meals.png",

  // ─── Logs Empty State ─────────────────────────────────────────────
  logs_empty_state: "/logs_empty_state.png",

  // ─── Dashboard Greeting Backgrounds ────────────────────────────────
  bg_morning: "/bg_morning.png",
  bg_afternoon: "/bg_afternoon.png",
  bg_evening: "/bg_evening.png",

  // ─── Dashboard Greeting Focus Thumbnails ───────────────────────────
  focus_meal: "/focus_meal.png",
  focus_workout: "/focus_workout.png",
  focus_calm: "/focus_calm.png",

  // ─── Phase 5 Image Briefs Carousel Sets ────────────────────────────
  landing_hero_1: "/landing_hero_1.png",
  landing_hero_2: "/landing_hero_2.png",
  landing_hero_3: "/landing_hero_3.png",
  landing_hero_4: "/landing_hero_4.png",
  landing_hero_5: "/landing_hero_5.png",
  landing_hero_6: "/landing_hero_6.png",

  dashboard_hero_1: "/dashboard_hero_1.png",
  dashboard_hero_2: "/dashboard_hero_2.png",
  dashboard_hero_3: "/dashboard_hero_3.png",
  dashboard_hero_4: "/dashboard_hero_4.png",
} as const;

export type MediaKey = keyof typeof mediaMap;
