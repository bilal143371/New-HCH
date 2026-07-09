import { Exercise } from '../types';

export interface StaticExerciseDay {
  day: number;
  title: string;
  description: string;
  exercises: string[];
  category: string;
  sphere: 'physical' | 'mental';
  duration: string;
  completed: boolean;
}

export interface StaticExercisePlanVariation {
  id: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  days: StaticExerciseDay[];
}

// 1. INDIVIDUAL EXERCISE REGISTRY
export const EXERCISES: Exercise[] = [
  // BODY EXERCISES (PHYSICAL)
  {
    id: 'b1',
    name: 'Wall Squats',
    description: 'Leaning against a wall, slide down to a sit to strengthen legs and glutes safely.',
    category: 'legs',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 10 reps',
    instructions: [
      'Stand with your back against a wall.',
      'Slide down until your knees are at 90 degrees.',
      'Hold the position for 10-15 seconds.',
      'Slide back up to stand.'
    ],
    hasTimer: true,
    timerSeconds: 15,
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_wall_squats.png'
  },
  {
    id: 'b2',
    name: 'Glute Bridges',
    description: 'Lying on your back, lift your hips to build stronger leg and lower back muscles.',
    category: 'legs',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 12 reps',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Squeeze your glutes and lift your hips toward the ceiling.',
      'Hold for 2 seconds at the top.',
      'Slowly lower your hips back down.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_glute_bridges.png'
  },
  {
    id: 'b3',
    name: 'Calf Raises',
    description: 'Raise your heels off the ground to strengthen calves and ankles.',
    category: 'legs',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 15 reps',
    instructions: [
      'Stand straight, holding a chair for balance if needed.',
      'Slowly raise up onto your toes.',
      'Hold the top position for 1 second.',
      'Lower your heels back to the ground.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_calf_raises.png'
  },
  {
    id: 'b4',
    name: 'Arm Circles',
    description: 'Rotate your arms in circular motion to stretch shoulders and build upper body tone.',
    category: 'arms',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '2 sets of 30 seconds',
    instructions: [
      'Extend your arms out to the sides at shoulder height.',
      'Make small, controlled forward circles with your hands.',
      'Switch to backward circles after 30 seconds.',
      'Keep your shoulders relaxed.'
    ],
    hasTimer: true,
    timerSeconds: 30,
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_arm_circles.png'
  },
  {
    id: 'b5',
    name: 'Wall Push-Ups',
    description: 'An excellent chest and shoulder builder using a wall to minimize joint stress.',
    category: 'chest',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 10 reps',
    instructions: [
      'Face a wall, standing a bit more than arm-length away.',
      'Place your palms flat on the wall at shoulder width.',
      'Bend your elbows to lower your chest toward the wall.',
      'Push back to the starting position.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_wall_pushups.png'
  },
  {
    id: 'b6',
    name: 'Standard Push-Ups',
    description: 'Classic floor push-ups to strengthen chest, arms, and core muscles.',
    category: 'chest',
    sphere: 'physical',
    difficulty: 'Intermediate',
    duration: '3 sets of 12 reps',
    instructions: [
      'Start in a high plank position with hands flat on the floor.',
      'Lower your body until your chest nearly touches the floor.',
      'Keep your back flat and core tight.',
      'Push your body back up to start.'
    ],
    highImpact: false,
    isHeavyLift: true,
    image: '/exercise_standard_pushups.png'
  },
  {
    id: 'b7',
    name: 'Gentle Cat-Cow Stretch',
    description: 'Arch and round your back slowly to relieve spinal pressure and back pain.',
    category: 'back',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '2 sets of 10 reps',
    instructions: [
      'Start on your hands and knees on a soft mat.',
      'Inhale, look up, and let your belly curve down (Cat).',
      'Exhale, round your back toward the ceiling (Cow).',
      'Move slowly with your breathing.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_cat_cow.png'
  },
  {
    id: 'b8',
    name: 'Bird-Dog Stability',
    description: 'Extend opposite arm and leg to strengthen lower back and deep core muscles.',
    category: 'back',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 10 reps',
    instructions: [
      'Begin on your hands and knees.',
      'Extend your right arm forward and left leg backward.',
      'Hold for 2 seconds keeping your body level.',
      'Return to start and repeat with opposite side.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_bird_dog.png'
  },
  {
    id: 'b9',
    name: 'Dead Bug Core Press',
    description: 'Lie on your back and press your knees to activate deep stomach core muscles without back strain.',
    category: 'core',
    sphere: 'physical',
    difficulty: 'Beginner',
    duration: '3 sets of 10 reps',
    instructions: [
      'Lie on your back with arms raised and knees bent at 90 degrees.',
      'Slowly lower right arm back and left leg forward near the floor.',
      'Keep your lower back pressed firmly into the floor.',
      'Return to start and repeat with other side.'
    ],
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_dead_bug.png'
  },
  {
    id: 'b10',
    name: 'Plank Hold',
    description: 'Hold a forearm plank to build total core stability and shoulder power.',
    category: 'core',
    sphere: 'physical',
    difficulty: 'Intermediate',
    duration: '3 sets of 30 seconds',
    instructions: [
      'Place forearms on the floor, elbows under shoulders.',
      'Step feet back, raising hips to form a straight line.',
      'Squeeze your stomach, glutes, and thighs.',
      'Hold the position while breathing calmly.'
    ],
    hasTimer: true,
    timerSeconds: 30,
    highImpact: false,
    isHeavyLift: false,
    image: '/exercise_plank.png'
  },
  {
    id: 'b11',
    name: 'High Knees',
    description: 'Run in place, raising your knees high to build intense cardiorespiratory fitness.',
    category: 'full-body',
    sphere: 'physical',
    difficulty: 'Advanced',
    duration: '3 sets of 30 seconds',
    instructions: [
      'Stand straight with feet hip-width apart.',
      'Run in place, driving your knees up toward your chest.',
      'Pump your arms naturally to keep balance.',
      'Land softly on the balls of your feet.'
    ],
    hasTimer: true,
    timerSeconds: 30,
    highImpact: true,
    isHeavyLift: false,
    image: '/exercise_high_knees.png'
  },
  {
    id: 'b12',
    name: 'Jump Squats',
    description: 'Squat down and explode upward into a jump to train athletic lower-body power.',
    category: 'legs',
    sphere: 'physical',
    difficulty: 'Advanced',
    duration: '3 sets of 10 reps',
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower into a deep squat, keeping chest up.',
      'Jump up explosively, driving through feet.',
      'Land softly and bend knees straight into next squat.'
    ],
    highImpact: true,
    isHeavyLift: false,
    image: '/exercise_jump_squats.png'
  },
  {
    id: 'b13',
    name: 'Burpees',
    description: 'Combine squat, push-up, and jump into one high-intensity conditioning movement.',
    category: 'full-body',
    sphere: 'physical',
    difficulty: 'Advanced',
    duration: '3 sets of 8 reps',
    instructions: [
      'From a standing position, squat down and place hands on floor.',
      'Jump your feet back into a plank position.',
      'Perform a push-up, then jump feet forward to hands.',
      'Jump up explosively with arms overhead.'
    ],
    highImpact: true,
    isHeavyLift: false,
    image: '/exercise_burpees.png'
  },

  // MIND & RELAXATION (MENTAL)
  {
    id: 'm1',
    name: '4-7-8 Deep Breathing Exercise',
    description: 'A simple breathing cycle that acts as a natural nervous system relaxant.',
    category: 'breathing',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '4 breath cycles',
    instructions: [
      'Exhale completely through your mouth with a whoosh sound.',
      'Close your mouth and inhale quietly through nose for 4 seconds.',
      'Hold your breath comfortably for 7 seconds.',
      'Exhale completely through mouth for 8 seconds.'
    ],
    hasTimer: true,
    timerSeconds: 19,
    highImpact: false,
    isHeavyLift: false,
    image: '/mental_relaxation.png'
  },
  {
    id: 'm2',
    name: 'Box Breathing technique',
    description: 'Equal inhalation, hold, exhalation, and hold to clear stress and sharp-focus the mind.',
    category: 'breathing',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '4 cycles',
    instructions: [
      'Exhale all air from your lungs.',
      'Inhale slowly through your nose for 4 seconds.',
      'Hold your breath with lungs full for 4 seconds.',
      'Exhale slowly through your mouth for 4 seconds.',
      'Hold empty lungs for 4 seconds, then repeat.'
    ],
    hasTimer: true,
    timerSeconds: 16,
    highImpact: false,
    isHeavyLift: false,
    image: '/quick_action_coach.png'
  },
  {
    id: 'm3',
    name: 'Mindful Body Scan',
    description: 'Bring soft attention to each physical region to release hidden tension.',
    category: 'meditation',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '5 minutes',
    instructions: [
      'Lie down comfortably or sit upright.',
      'Close your eyes and take three slow, deep breaths.',
      'Focus attention on your toes, noticing any sensations.',
      'Slowly move attention up to feet, calves, knees, hips, and chest.'
    ],
    hasTimer: true,
    timerSeconds: 300,
    highImpact: false,
    isHeavyLift: false,
    image: '/male_meal_prep.png'
  },
  {
    id: 'm4',
    name: 'Gratitude Reflection',
    description: 'Silently contemplate three small things you are grateful for today.',
    category: 'stress',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '3 minutes',
    instructions: [
      'Sit comfortably and let your hands rest in your lap.',
      'Think of three simple things that brought you peace today.',
      'Feel the positive sensation associated with each memory.',
      'End with a deep, cleansing breath.'
    ],
    hasTimer: true,
    timerSeconds: 180,
    highImpact: false,
    isHeavyLift: false,
    image: '/fitness_workout.png'
  },
  {
    id: 'm5',
    name: 'Evening Sleep Prep Meditation',
    description: 'Slow down brainwaves and let go of daily worries to welcome deep restorative rest.',
    category: 'sleep',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '5 minutes',
    instructions: [
      'Sit or lie in bed with lights dimmed.',
      'Acknowledge that your active day is now complete.',
      'Let your breathing become slow, soft, and deep.',
      'Slightly lengthen your exhales to signal safe rest to your brain.'
    ],
    hasTimer: true,
    timerSeconds: 300,
    highImpact: false,
    isHeavyLift: false,
    image: '/quick_action_workout.png'
  },
  {
    id: 'm6',
    name: 'Quick Energy Charger',
    description: 'Vigorous shoulder rolls and fast-paced breaths to clear daytime fatigue.',
    category: 'energy',
    sphere: 'mental',
    difficulty: 'Beginner',
    duration: '2 minutes',
    instructions: [
      'Sit upright on the edge of your seat.',
      'Take 5 fast, deep nasal breaths.',
      'Roll your shoulders forward and backward twice.',
      'Stretch both arms high above your head and release.'
    ],
    hasTimer: true,
    timerSeconds: 120,
    highImpact: false,
    isHeavyLift: false,
    image: '/mental_relaxation.png'
  }
];

// 2. READY-MADE 7-DAY EXERCISE PLANS
export const EXERCISE_PLAN_VARIATIONS: StaticExercisePlanVariation[] = [
  {
    id: 'fat-burn-stamina',
    name: 'Fat Burn & Cardio Stamina',
    description: 'A higher energy routine focusing on stamina, caloric burn, and steady-state cardiovascular endurance.',
    tag: 'Stamina',
    image: '/plan_fat_burn.png',
    days: [
      {
        day: 1,
        title: 'Calorie Burn Starter',
        description: 'Brisk cardio activity combined with functional lower body squat conditioning.',
        exercises: ['High Knees', 'Wall Squats', 'Standard Push-Ups'],
        category: 'full-body',
        sphere: 'physical',
        duration: '15 mins',
        completed: false
      },
      {
        day: 2,
        title: 'Core & Upper Body Flow',
        description: 'Tighten stomach core muscles and build arm stamina without heavy lifts.',
        exercises: ['Plank Hold', 'Arm Circles', 'Wall Push-Ups'],
        category: 'core',
        sphere: 'physical',
        duration: '12 mins',
        completed: false
      },
      {
        day: 3,
        title: 'Mid-Week Mental Recover',
        description: 'Guided breath intervals to lower arterial pulse rate and soothe central nervous systems.',
        exercises: ['4-7-8 Deep Breathing Exercise', 'Mindful Body Scan'],
        category: 'breathing',
        sphere: 'mental',
        duration: '10 mins',
        completed: false
      },
      {
        day: 4,
        title: 'Explosive Lower Power',
        description: 'A high-impact functional legs and back day to challenge cardiovascular bounds.',
        exercises: ['Jump Squats', 'Calf Raises', 'Gentle Cat-Cow Stretch'],
        category: 'legs',
        sphere: 'physical',
        duration: '18 mins',
        completed: false
      },
      {
        day: 5,
        title: 'Full Body Stamina Burner',
        description: 'Unleash intense cellular fat combustion with continuous bodyweight intervals.',
        exercises: ['Burpees', 'Dead Bug Core Press', 'Quick Energy Charger'],
        category: 'full-body',
        sphere: 'physical',
        duration: '20 mins',
        completed: false
      },
      {
        day: 6,
        title: 'Spinal Relief & Mobility',
        description: 'Support joint wellness with low-stiff posture stabilizers and slow stretches.',
        exercises: ['Bird-Dog Stability', 'Gentle Cat-Cow Stretch', 'Glute Bridges'],
        category: 'back',
        sphere: 'physical',
        duration: '15 mins',
        completed: false
      },
      {
        day: 7,
        title: 'Deep Restful Sleep Wind-down',
        description: 'Prepare sleep pathways to welcome nighttime growth hormone synthesis.',
        exercises: ['Evening Sleep Prep Meditation', 'Gratitude Reflection'],
        category: 'sleep',
        sphere: 'mental',
        duration: '10 mins',
        completed: false
      }
    ]
  },
  {
    id: 'strength-lean-muscle',
    name: 'Strength & Lean Muscle / Hypertrophy',
    description: 'Targeted resistance training utilizing bodyweight leverage to build muscle density and bone mineral strength.',
    tag: 'Strength',
    image: '/plan_strength_muscle.png',
    days: [
      {
        day: 1,
        title: 'Chest & Arm Power Builder',
        description: 'Build robust chest muscles and shoulder stability through pure pushing density.',
        exercises: ['Standard Push-Ups', 'Wall Push-Ups', 'Arm Circles'],
        category: 'chest',
        sphere: 'physical',
        duration: '15 mins',
        completed: false
      },
      {
        day: 2,
        title: 'Lower Chain Hypertrophy',
        description: 'High-tension squat reps to safely fatigue leg quadriceps and glutes.',
        exercises: ['Wall Squats', 'Glute Bridges', 'Calf Raises'],
        category: 'legs',
        sphere: 'physical',
        duration: '18 mins',
        completed: false
      },
      {
        day: 3,
        title: 'Deep Posture Safeguards',
        description: 'Stretch lower-back structures and strengthen core columns to improve posture.',
        exercises: ['Bird-Dog Stability', 'Plank Hold', 'Dead Bug Core Press'],
        category: 'back',
        sphere: 'physical',
        duration: '15 mins',
        completed: false
      },
      {
        day: 4,
        title: 'Stress Relief & Cortisol Control',
        description: 'Deep breathing to purge systemic metabolic stress and optimize recovery.',
        exercises: ['Box Breathing technique', 'Gratitude Reflection'],
        category: 'stress',
        sphere: 'mental',
        duration: '10 mins',
        completed: false
      },
      {
        day: 5,
        title: 'Deep Focus & Visualization',
        description: 'Mental rehearsals to improve neuromuscular coordination and mind-muscle connection.',
        exercises: ['Mindful Body Scan', 'Quick Energy Charger'],
        category: 'meditation',
        sphere: 'mental',
        duration: '15 mins',
        completed: false
      },
      {
        day: 6,
        title: 'Full Body Heavy Conditioning',
        description: 'Combine major muscle groups in a continuous high-tension flow.',
        exercises: ['Standard Push-Ups', 'Glute Bridges', 'Plank Hold'],
        category: 'full-body',
        sphere: 'physical',
        duration: '20 mins',
        completed: false
      },
      {
        day: 7,
        title: 'Systemic Relaxation & Recover',
        description: 'Systematic muscular scanning to reduce tension and release micro-spasms.',
        exercises: ['Evening Sleep Prep Meditation', 'Mindful Body Scan'],
        category: 'sleep',
        sphere: 'mental',
        duration: '20 mins',
        completed: false
      }
    ]
  },
  {
    id: 'low-impact-wellness',
    name: 'Gentle Low-Impact & Joint-Friendly',
    description: 'Perfect for beginners, seniors, or those recovering from knee/joint stiffness or heart conditions.',
    tag: 'Low Impact',
    image: '/plan_joint_friendly.png',
    days: [
      {
        day: 1,
        title: 'Joint Mobility & Circulation',
        description: 'Gentle, zero-impact calf flexes and ankle rotation to improve lower-body circulation.',
        exercises: ['Calf Raises', 'Wall Squats'],
        category: 'legs',
        sphere: 'physical',
        duration: '12 mins',
        completed: false
      },
      {
        day: 2,
        title: 'Shoulder & Arm Elasticity',
        description: 'Relieve shoulder blade tightness and expand thoracic cavity reach.',
        exercises: ['Arm Circles', 'Wall Push-Ups'],
        category: 'chest',
        sphere: 'physical',
        duration: '10 mins',
        completed: false
      },
      {
        day: 3,
        title: 'Stress-Relief Deep Breathing',
        description: 'Soothe the airways and support blood pressure control through deep belly breathing.',
        exercises: ['4-7-8 Deep Breathing Exercise', 'Box Breathing technique'],
        category: 'breathing',
        sphere: 'mental',
        duration: '12 mins',
        completed: false
      },
      {
        day: 4,
        title: 'Spinal Decompression & Flex',
        description: 'Gentle, non-strenuous stretches to loosen lumbar and dorsal spinal muscles.',
        exercises: ['Gentle Cat-Cow Stretch', 'Bird-Dog Stability'],
        category: 'back',
        sphere: 'physical',
        duration: '12 mins',
        completed: false
      },
      {
        day: 5,
        title: 'Somatic Mindfulness Check-In',
        description: 'Observe somatic signals and release chronic physical anxiety.',
        exercises: ['Mindful Body Scan', 'Gratitude Reflection'],
        category: 'meditation',
        sphere: 'mental',
        duration: '15 mins',
        completed: false
      },
      {
        day: 6,
        title: 'Core & Glutes Alignment',
        description: 'Safe, lying floor exercises to strengthen glutes without loading knee joints.',
        exercises: ['Glute Bridges', 'Bird-Dog Stability'],
        category: 'full-body',
        sphere: 'physical',
        duration: '12 mins',
        completed: false
      },
      {
        day: 7,
        title: 'Nervous System Soother',
        description: 'Slow down cardiac pace and transition safely into a night of peaceful rest.',
        exercises: ['Evening Sleep Prep Meditation', 'Mindful Body Scan'],
        category: 'sleep',
        sphere: 'mental',
        duration: '15 mins',
        completed: false
      }
    ]
  }
];
