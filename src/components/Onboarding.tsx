import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, Dumbbell, Flame, Heart, Activity, Sliders, Brain, Apple, CheckCircle2, ShieldAlert } from 'lucide-react';
import { theme } from '../styles/theme';
import '../styles/design-system.css';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface OnboardingProps {
  initialProfile: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function Onboarding({
  initialProfile,
  onComplete,
  onCancel
}: OnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(null);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // Step 1: Bio-Metrics State
  const [age, setAge] = useState<number>(initialProfile?.age || 28);
  const [gender, setGender] = useState<UserProfile['gender']>(initialProfile?.gender || 'male');
  const [heightFt, setHeightFt] = useState<number>(initialProfile?.heightFt || 5);
  const [heightIn, setHeightIn] = useState<number>(initialProfile?.heightIn || 7);
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 70);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialProfile?.weightUnit || 'kg');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(initialProfile?.activityLevel || 'moderately-active');

  // Step 2: Health Focus State
  const [goal, setGoal] = useState<UserProfile['goal']>(initialProfile?.goal || 'stay-healthy');
  const [healthConditions, setHealthConditions] = useState<string[]>(initialProfile?.healthConditions || []);
  const [foodPreferences, setFoodPreferences] = useState<string[]>(initialProfile?.foodPreferences || ['non-vegetarian']);

  // Step 3: Registration & Payoff State
  const [name, setName] = useState(initialProfile?.name || '');
  const [isCalculating, setIsCalculating] = useState(true);
  const [loadingTipsIndex, setLoadingTipsIndex] = useState(0);

  // Dynamic calculations
  const heightCm = Math.round(((heightFt * 12) + heightIn) * 2.54);
  const weightKg = weightUnit === 'kg' ? weight : Math.round(weight / 2.20462);

  // BMI Calculation
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  
  let bmiCategory = 'Normal';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  // Calorie Calculation (Mifflin-St Jeor Equation)
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') bmr += 5;
  else if (gender === 'female') bmr -= 161;
  else bmr -= 80; // neutral factor

  let activityMultiplier = 1.2;
  if (activityLevel === 'lightly-active') activityMultiplier = 1.375;
  else if (activityLevel === 'moderately-active') activityMultiplier = 1.55;
  else if (activityLevel === 'very-active') activityMultiplier = 1.725;
  else if (activityLevel === 'extremely-active') activityMultiplier = 1.9;

  let calculatedCalories = Math.round(bmr * activityMultiplier);
  if (goal === 'lose-weight') calculatedCalories -= 400;
  else if (goal === 'build-muscle') calculatedCalories += 300;
  calculatedCalories = Math.max(1200, calculatedCalories); // safe floor

  // Macronutrient calculation
  const carbGrams = Math.round((calculatedCalories * 0.45) / 4);
  const proteinGrams = Math.round((calculatedCalories * 0.25) / 4);
  const fatGrams = Math.round((calculatedCalories * 0.30) / 9);

  // Loading Screen checklist loops
  const LOADING_CHECKLIST = [
    "Running body-mass metabolic index calculations...",
    "Calibrating macro values for chronic targets...",
    "Formulating joint-safe physical workout sets...",
    "Selecting respiratory anxiety-calming exercises..."
  ];

  useEffect(() => {
    if (step === 4 && isCalculating) {
      const interval = setInterval(() => {
        setLoadingTipsIndex((prev) => (prev + 1) % LOADING_CHECKLIST.length);
      }, 500);

      const timer = setTimeout(() => {
        setIsCalculating(false);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [step, isCalculating]);

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalProfile: UserProfile = {
      name: name.trim(),
      age,
      gender,
      country: 'Pakistan', // default to localized
      heightFt,
      heightIn,
      weight,
      weightUnit,
      weightKg,
      goal,
      activityLevel,
      healthConditions,
      foodPreferences
    };
    setPendingProfile(finalProfile);
    setWalkthroughStep(1);
  };

  const toggleHealthCondition = (id: string) => {
    setHealthConditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFoodPreference = (id: string) => {
    setFoodPreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (walkthroughStep !== null) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col justify-center min-h-[calc(100vh-8rem)] animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16], textAlign: 'left' }}>
          
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-2 uppercase tracking-widest">
              <span>App Walkthrough</span>
              <span>Feature {walkthroughStep} of 3</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${(walkthroughStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div
            style={{
              background: colors.white,
              borderRadius: radii.card,
              border: `1px solid ${colors.success}30`,
              boxShadow: shadows.card,
              padding: spacing[24],
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[16],
            }}
          >
            {walkthroughStep === 1 && (
              <>
                <img
                  src="/male_meal_prep.png"
                  alt="Personalized Meals"
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: radii.card }}
                />
                <h3 style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, margin: 0 }}>
                  1. Personalized Pakistani Meals
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, margin: 0, lineHeight: 1.5 }}>
                  Access customized daily nutritional targets, portion recommendations, and traditional Pakistani recipes specifically tailored for weight control and health conditions.
                </p>
                <button
                  onClick={() => setWalkthroughStep(2)}
                  className="hch-btn hch-btn--primary"
                  style={{ alignSelf: 'stretch', justifyContent: 'center', padding: '12px' }}
                >
                  Next: Workouts
                </button>
              </>
            )}

            {walkthroughStep === 2 && (
              <>
                <img
                  src="/male_workout.png"
                  alt="Joint-Safe Workouts"
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: radii.card }}
                />
                <h3 style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, margin: 0 }}>
                  2. Clinical Joint-Safe Workouts
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, margin: 0, lineHeight: 1.5 }}>
                  Access guided workout plans that adapt to knee-pain, heart conditions, and respiratory safeguards to keep physical training safe and effective.
                </p>
                <button
                  onClick={() => setWalkthroughStep(3)}
                  className="hch-btn hch-btn--primary"
                  style={{ alignSelf: 'stretch', justifyContent: 'center', padding: '12px' }}
                >
                  Next: Mind Support
                </button>
              </>
            )}

            {walkthroughStep === 3 && (
              <>
                <img
                  src="/mental_relaxation.png"
                  alt="Mind & Stress Support"
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: radii.card }}
                />
                <h3 style={{ fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 700, color: colors.text, margin: 0 }}>
                  3. Mind & Stress Support
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.muted, margin: 0, lineHeight: 1.5 }}>
                  Soothe your stress with the Live Stress Pacer breathing guide, keep gratitude journals, and seek support from your dedicated AI Mind Coach.
                </p>
                <button
                  onClick={() => {
                    if (pendingProfile) {
                      onComplete(pendingProfile);
                    }
                  }}
                  className="hch-btn hch-btn--primary"
                  style={{ alignSelf: 'stretch', justifyContent: 'center', padding: '12px' }}
                >
                  Complete & Enter Dashboard →
                </button>
              </>
            )}
          </div>
          
          {/* Medical disclaimer in footer of walkthrough */}
          <p style={{ fontFamily: fonts.body, fontSize: '0.625rem', color: colors.muted, textAlign: 'center', marginTop: spacing[12] }}>
            ⚠️ Disclaimer: Not a substitute for medical advice. Please consult a qualified health professional before starting any plan.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col justify-center min-h-[calc(100vh-8rem)] animate-fade-in">
      
      {/* Header and Step Indicators */}
      {!isCalculating && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-2 uppercase tracking-widest">
            <button 
              onClick={handlePrevStep} 
              className="flex items-center text-text-body hover:text-purple-600 transition font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </button>
            <span>Step {step} of {totalSteps}</span>
          </div>
          
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Onboarding Container Box */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-300/[0.03] min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: Welcome/Intro */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-fade-in flex flex-col items-center">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm" style={{ maxHeight: '200px' }}>
              <img 
                src="/onboarding_welcome.png" 
                alt="Welcome to Pakistan HealthCare Hub" 
                style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
              />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-text-headline">Welcome to Pakistan HealthCare Hub</h2>
              <p className="text-xs text-text-body max-w-md mx-auto leading-relaxed">
                Take our quick 1-minute wellness quiz to configure customized dietary portion limits, joint-safe home workout programs, and respiratory pacing pacers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STEP 2: Bio-Metrics */}
        {step === 2 && (
          <div className="space-y-6 text-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], borderBottom: `1px solid ${colors.success}15`, paddingBottom: spacing[16] }}>
              <div style={{ width: '60px', height: '60px', borderRadius: radii.button, overflow: 'hidden', flexShrink: 0, border: `1px solid ${colors.success}30` }}>
                <img src="/onboarding_metrics.png" alt="Metrics Setup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-headline flex items-center">
                  <Sliders className="w-5 h-5 text-purple-600 mr-2 shrink-0" />
                  Configure Bio-Metrics
                </h2>
                <p className="text-xs text-text-muted">
                  Input your metrics to calibrate your targeted metabolic limits.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Age</label>
                  <span className="text-xs font-mono font-bold text-purple-600">{age} yrs</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Gender Radio Select */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'prefer-not-to-say'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition active:scale-95 capitalize ${
                        gender === g
                          ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                          : 'border-slate-200 bg-white text-text-body hover:bg-slate-50'
                      }`}
                    >
                      {g === 'prefer-not-to-say' ? 'Other' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height Sliders */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Height</label>
                  <span className="text-xs font-mono font-bold text-purple-600">{heightFt} ft {heightIn} in <span className="text-[10px] text-text-muted">({heightCm} cm)</span></span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-text-muted block text-right">Feet: {heightFt}</span>
                    <input
                      type="range"
                      min="4"
                      max="7"
                      value={heightFt}
                      onChange={(e) => setHeightFt(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-text-muted block text-right">Inches: {heightIn}</span>
                    <input
                      type="range"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Weight</label>
                    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => { if (weightUnit === 'lbs') { setWeight(Math.round(weight / 2.205)); setWeightUnit('kg'); } }}
                        className={`px-1.5 py-0.5 rounded ${weightUnit === 'kg' ? 'bg-white shadow-sm text-purple-600' : 'text-text-muted'}`}
                      >KG</button>
                      <button
                        type="button"
                        onClick={() => { if (weightUnit === 'kg') { setWeight(Math.round(weight * 2.205)); setWeightUnit('lbs'); } }}
                        className={`px-1.5 py-0.5 rounded ${weightUnit === 'lbs' ? 'bg-white shadow-sm text-purple-600' : 'text-text-muted'}`}
                      >LBS</button>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-600">{weight} {weightUnit}</span>
                </div>
                <input
                  type="range"
                  min={weightUnit === 'kg' ? '35' : '75'}
                  max={weightUnit === 'kg' ? '180' : '400'}
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Activity Level Cards */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Activity Level</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'sedentary', label: 'Sedentary', desc: 'Mostly sitting (desk job, low steps)' },
                    { id: 'lightly-active', label: 'Lightly Active', desc: 'Light exercise or 5k-8k steps/day' },
                    { id: 'moderately-active', label: 'Moderately Active', desc: 'Workouts 3x/week or active lifestyle' },
                    { id: 'very-active', label: 'Very Active', desc: 'Heavy training or physical occupation' }
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityLevel(act.id as UserProfile['activityLevel'])}
                      className={`p-3 rounded-2xl border text-left transition active:scale-[0.98] ${
                        activityLevel === act.id
                          ? 'border-purple-600 bg-purple-50/30 ring-1 ring-purple-100 shadow-sm'
                          : 'border-slate-100 bg-white text-text-body hover:bg-slate-50'
                      }`}
                    >
                      <strong className={`block text-xs font-bold ${activityLevel === act.id ? 'text-purple-700' : 'text-text-headline'}`}>{act.label}</strong>
                      <span className="text-[10px] text-text-muted block mt-0.5 leading-tight">{act.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Health Focus */}
        {step === 3 && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="text-xl font-bold text-text-headline flex items-center">
                <Apple className="w-5 h-5 text-purple-600 mr-2 shrink-0" />
                Select Health Focus
              </h2>
              <p className="text-xs text-text-muted">
                Help us align macro targets and exercise restrictors to protect your joints and heart.
              </p>
            </div>

            <div className="space-y-5">
              
              {/* Primary Health Goal */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Primary Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'lose-weight', label: 'Weight Management', desc: 'Calculate calorie deficits safely.' },
                    { id: 'build-muscle', label: 'Muscle Conditioning', desc: 'Highlight protein targets and recovery.' },
                    { id: 'stay-healthy', label: 'Heart & Diet Balance', desc: 'Promote low-sodium & heart-safe portions.' },
                    { id: 'reduce-stress', label: 'Stress & Sleep Support', desc: 'Highlight relaxing breathwork pacing.' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id as UserProfile['goal'])}
                      className={`p-3 rounded-2xl border text-left transition active:scale-[0.98] ${
                        goal === g.id
                          ? 'border-purple-600 bg-purple-50/30 ring-1 ring-purple-100 shadow-sm'
                          : 'border-slate-100 bg-white text-text-body hover:bg-slate-50'
                      }`}
                    >
                      <strong className={`block text-xs font-bold ${goal === g.id ? 'text-purple-700' : 'text-text-headline'}`}>{g.label}</strong>
                      <span className="text-[10px] text-text-muted block mt-0.5 leading-tight">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions Multi-Select */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Safety Concerns (Select All That Apply)</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'diabetes', label: 'Blood Sugar / Diabetes' },
                    { id: 'high-blood-pressure', label: 'Hypertension' },
                    { id: 'heart-condition', label: 'Heart Complications' },
                    { id: 'joint-pain', label: 'Knee / Joint Pain' },
                    { id: 'back-pain', label: 'Spine / Back Strain' },
                    { id: 'asthma', label: 'Asthma / Breathing' }
                  ].map((cond) => {
                    const isSelected = healthConditions.includes(cond.id);
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => toggleHealthCondition(cond.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition active:scale-[0.98] flex items-center justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/20 text-purple-700'
                            : 'border-slate-100 bg-white text-text-body hover:bg-slate-50'
                        }`}
                      >
                        <span>{cond.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Food Preferences */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'non-vegetarian', label: 'Standard Diet' },
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'halal-only', label: 'Halal Only' },
                    { id: 'no-dairy', label: 'Lactose Free' }
                  ].map((diet) => {
                    const isSelected = foodPreferences.includes(diet.id);
                    return (
                      <button
                        key={diet.id}
                        type="button"
                        onClick={() => toggleFoodPreference(diet.id)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition active:scale-[0.95] ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/20 text-purple-700 font-bold'
                            : 'border-slate-100 bg-slate-50 text-text-body hover:bg-slate-100'
                        }`}
                      >
                        {diet.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 border border-slate-200 text-text-body text-xs font-bold rounded-xl transition active:scale-95"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center space-x-1"
              >
                <span>Generate Strategy</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Instant Strategy Generation & Low-Friction Signup Form */}
        {step === 4 && isCalculating && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            {/* Spinning load state indicator */}
            <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h3 className="text-base font-bold text-text-headline">Calibrating Strategy Blueprint...</h3>
              <div className="h-10 flex items-center justify-center text-xs text-purple-600 font-bold font-mono transition-all duration-300">
                {LOADING_CHECKLIST[loadingTipsIndex]}
              </div>
            </div>
          </div>
        )}

        {step === 4 && !isCalculating && (
          <div className="space-y-6 text-left animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], borderBottom: `1px solid ${colors.success}15`, paddingBottom: spacing[16] }}>
              <div style={{ width: '60px', height: '60px', borderRadius: radii.button, overflow: 'hidden', flexShrink: 0, border: `1px solid ${colors.success}30` }}>
                <img src="/onboarding_results.png" alt="Celebration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-headline flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 shrink-0" />
                  Your Customized Strategy Payoff
                </h2>
                <p className="text-xs text-text-muted">
                  Here are your instant metabolic targets and safety recommendations.
                </p>
              </div>
            </div>

            {/* Strategy Cards Stack */}
            <div className="space-y-3.5">
              
              {/* Calorie Card */}
              <div className="p-4 bg-purple-50/20 border border-purple-100 rounded-xl shadow-sm space-y-2">
                <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Calorie & Macro Targets</span>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-2xl font-mono font-extrabold text-purple-700">{calculatedCalories} <span className="text-xs font-sans text-text-body font-bold">kcal / day</span></span>
                  <span className="text-[10px] font-bold text-text-muted bg-white border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm">BMI: {bmi} ({bmiCategory})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-text-muted block font-mono text-[8px] uppercase">Carbs</span>
                    <strong className="text-text-headline">{carbGrams}g</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-text-muted block font-mono text-[8px] uppercase">Protein</span>
                    <strong className="text-text-headline">{proteinGrams}g</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-text-muted block font-mono text-[8px] uppercase">Fat</span>
                    <strong className="text-text-headline">{fatGrams}g</strong>
                  </div>
                </div>
              </div>

              {/* Workout recommendation */}
              <div className="p-3.5 bg-emerald-50/10 border border-emerald-100 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100"><Dumbbell className="w-4 h-4" /></span>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-emerald-700 uppercase font-bold tracking-wider">Knee & Joint-Safe Training</span>
                  <h4 className="text-xs font-bold text-text-headline">
                    {healthConditions.includes('joint-pain') ? "Knee-Safe Beginner Level 1 Workouts" : healthConditions.includes('heart-condition') ? "Heart-Restricted Cardio Warmup" : "General Cardio Fat-Burn Program"}
                  </h4>
                  <p className="text-[10px] text-text-body leading-tight">Home-based routines customized to keep physical strain safe and therapeutic.</p>
                </div>
              </div>

              {/* Mind recommendation */}
              <div className="p-3.5 bg-sky-50/15 border border-sky-100 rounded-xl flex items-start space-x-3.5">
                <span className="p-2 rounded-lg bg-sky-50 text-sky-600 shrink-0 border border-sky-100"><Brain className="w-4 h-4" /></span>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-sky-700 uppercase font-bold tracking-wider">Respiratory & Stress Relief</span>
                  <h4 className="text-xs font-bold text-text-headline">
                    {healthConditions.includes('asthma') || goal === 'reduce-stress' ? "4-7-8 Deep Sleep Breathing Cycle" : "Cozy Box Pacing breathing (4-4-4-4)"}
                  </h4>
                  <p className="text-[10px] text-text-body leading-tight">Simple breathing checks to pace metabolic activity and oxygenation levels.</p>
                </div>
              </div>

            </div>

            {/* LOW-FRICTION SIGNUP FORM PAYOFF */}
            <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-5 space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-text-headline flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mr-1.5" />
                    Register Free to Save Progress
                  </h4>
                  <p className="text-[10.5px] text-text-muted">
                    Save your custom blueprint profile to access the logs, history, and recipes.
                  </p>
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name to save..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-lg p-2.5 text-text-headline placeholder-text-muted text-xs transition"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 py-2.5 border border-slate-200 text-text-body text-xs font-bold rounded-xl transition active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-purple-500/10 transition active:scale-95"
                >
                  Save & Open Dashboard →
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Medical Disclaimer */}
      <p style={{ fontFamily: fonts.body, fontSize: '0.625rem', color: colors.muted, textAlign: 'center', marginTop: spacing[16], opacity: 0.8 }}>
        ⚠️ Disclaimer: Not a substitute for medical advice. Please consult a qualified health professional before starting any plan.
      </p>
    </div>
  );
}
