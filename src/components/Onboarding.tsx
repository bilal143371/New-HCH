import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, Check, Sparkles, AlertCircle, Dumbbell, Flame, Heart, Activity, Sliders } from 'lucide-react';

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
  const totalSteps = 6;

  // Form States
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 28);
  const [gender, setGender] = useState<'male' | 'female' | 'prefer-not-to-say'>(initialProfile?.gender || 'male');
  const [country, setCountry] = useState(initialProfile?.country || 'United States');
  
  const [heightFt, setHeightFt] = useState<number>(initialProfile?.heightFt || 5);
  const [heightIn, setHeightIn] = useState<number>(initialProfile?.heightIn || 7);
  
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 75);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialProfile?.weightUnit || 'kg');

  const [goal, setGoal] = useState<UserProfile['goal']>(initialProfile?.goal || 'stay-healthy');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(initialProfile?.activityLevel || 'moderately-active');
  const [healthConditions, setHealthConditions] = useState<string[]>(initialProfile?.healthConditions || []);
  const [foodPreferences, setFoodPreferences] = useState<string[]>(initialProfile?.foodPreferences || ['non-vegetarian']);

  // Helpers
  // total inches -> cm: (ft * 12 + in) * 2.54
  const computedHeightCm = Math.round(((heightFt * 12) + heightIn) * 2.54);

  // Live conversion for Weight Switch
  const toggleWeightUnit = () => {
    if (weightUnit === 'kg') {
      // KG -> LBS (1 kg = 2.20462 lbs)
      setWeight(Math.round(weight * 2.20462));
      setWeightUnit('lbs');
    } else {
      // LBS -> KG
      setWeight(Math.round(weight / 2.20462));
      setWeightUnit('kg');
    }
  };

  const getWeightInKg = (): number => {
    return weightUnit === 'kg' ? weight : Math.round(weight / 2.20462);
  };

  const handleGoalSelect = (selected: UserProfile['goal']) => {
    setGoal(selected);
  };

  const handleActivitySelect = (selected: UserProfile['activityLevel']) => {
    setActivityLevel(selected);
  };

  const toggleHealthCondition = (condition: string) => {
    if (condition === 'none') {
      setHealthConditions([]);
      return;
    }
    setHealthConditions((prev) => {
      const isAlreadySelected = prev.includes(condition);
      if (isAlreadySelected) {
        return prev.filter((c) => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  const toggleFoodPreference = (pref: string) => {
    setFoodPreferences((prev) => {
      const isAlreadySelected = prev.includes(pref);
      if (isAlreadySelected) {
        return prev.filter((p) => p !== pref);
      } else {
        return [...prev, pref];
      }
    });
  };

  const validateAndNext = () => {
    if (step === 1) {
      if (!name.trim()) return;
      if (age < 10 || age > 100) return;
    }
    if (step === 2) {
      if (heightFt < 1 || heightFt > 9) return;
      if (heightIn < 0 || heightIn > 11) return;
      if (weight <= 0) return;
    }
    
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      // Submit full payload
      const finalProfile: UserProfile = {
        name,
        age,
        gender,
        country,
        heightFt,
        heightIn,
        weight,
        weightUnit,
        weightKg: getWeightInKg(),
        goal,
        activityLevel,
        healthConditions,
        foodPreferences
      };
      onComplete(finalProfile);
    }
  };

  const stepBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Checkbox lists
  const HEALTH_CONDITIONS_LIST = [
    { id: 'diabetes', label: 'Diabetes', desc: 'Blood sugar management needs.' },
    { id: 'high-blood-pressure', label: 'High Blood Pressure', desc: 'Avoid high salt and excessive strain.' },
    { id: 'heart-condition', label: 'Heart Condition', desc: 'Workouts limited to safe intensity.' },
    { id: 'joint-pain', label: 'Knee / Joint Pain', desc: 'Hide jump-based or heavy leg loading.' },
    { id: 'back-pain', label: 'Back Pain', desc: 'Warn on heavy lifts, suggest posture care.' },
    { id: 'asthma', label: 'Asthma', desc: 'Rank calming breathing exercises first.' },
  ];

  const FOOD_PREFS_LIST = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'non-vegetarian', label: 'Non-vegetarian (all foods)' },
    { id: 'no-dairy', label: 'No Dairy (Lactose Free)' },
    { id: 'no-gluten', label: 'No Gluten' },
    { id: 'halal-only', label: 'Halal only' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center min-h-[calc(100vh-8rem)] animate-fade-in">
      {/* Progress Bar & Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2 uppercase tracking-widest">
          <button 
            onClick={stepBack} 
            className="flex items-center text-text-body hover:text-text-gold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
          </button>
          <span>Step {step} of {totalSteps}</span>
        </div>
        
        {/* Dynamic customized track */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gold-dark to-gold-primary transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main card box container */}
      <div className="p-6 md:p-8 rounded-xl bg-bg-card border border-white/[0.06] shadow-deep flex flex-col justify-between min-h-[380px]">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                Tell us about yourself
              </h2>
              <p className="text-xs text-text-muted">
                Let's customize your profile. We use your age and gender for calculations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilal Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    Age (10 - 100)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 28)}
                    className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm transition"
                  />
                  {age < 10 || age > 100 ? (
                    <span className="text-[10px] text-red-400 font-mono mt-1 block">Age must be between 10 and 100.</span>
                  ) : null}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-bg-surface border border-white/[0.06] focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none rounded-lg p-3 text-text-headline text-sm transition"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['male', 'female', 'prefer-not-to-say'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-lg text-xs font-bold border transition ${
                        gender === g
                          ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                          : 'border-white/[0.06] bg-bg-surface text-text-body hover:border-white/[0.12]'
                      }`}
                    >
                      {g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Other / Prefer not to say'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Body Measurements */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                Your Body Measurements
              </h2>
              <p className="text-xs text-text-muted">
                These are mandatory to compute your daily calorie, protein, and hydration targets.
              </p>
            </div>

            <div className="space-y-6">
              {/* Height Row with side-by-side feet and inches */}
              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 bg-bg-surface border border-white/[0.06] rounded-lg p-3">
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={heightFt}
                      onChange={(e) => setHeightFt(parseInt(e.target.value) || 5)}
                      className="w-full bg-transparent border-none outline-none text-text-headline text-center font-mono text-lg"
                    />
                    <span className="text-xs text-text-muted font-bold font-mono">FT</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-bg-surface border border-white/[0.06] rounded-lg p-3">
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border-none outline-none text-text-headline text-center font-mono text-lg"
                    />
                    <span className="text-xs text-text-muted font-bold font-mono">IN</span>
                  </div>
                </div>
                
                {/* Live cm conversion helper text */}
                <p className="text-xs text-text-gold font-mono mt-2 text-right">
                  = {computedHeightCm} cm
                </p>
              </div>

              {/* Weight Row with TOGGLE switch */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Weight
                  </label>
                  
                  {/* KG / LBS switch toggle */}
                  <div className="flex items-center space-x-2 bg-bg-surface p-1 rounded-lg border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => weightUnit !== 'kg' && toggleWeightUnit()}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition font-mono ${
                        weightUnit === 'kg'
                          ? 'bg-gold-primary text-bg-deep'
                          : 'text-text-muted hover:text-text-headline'
                      }`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => weightUnit !== 'lbs' && toggleWeightUnit()}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition font-mono ${
                        weightUnit === 'lbs'
                          ? 'bg-gold-primary text-bg-deep'
                          : 'text-text-muted hover:text-text-headline'
                      }`}
                    >
                      LBS
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-bg-surface border border-white/[0.06] rounded-lg p-3">
                  <input
                    type="number"
                    min={1}
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none text-text-headline text-left font-mono text-lg pl-2"
                  />
                  <span className="text-xs text-text-muted font-bold font-mono uppercase pr-2">{weightUnit}</span>
                </div>

                {/* Helper conversion display below */}
                <p className="text-xs text-text-muted font-mono mt-2">
                  Stored as {getWeightInKg()} KG for calculations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Health Goal */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                What is your main health goal?
              </h2>
              <p className="text-xs text-text-muted">
                This configures your calorie buffer and exercise focus list.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'lose-weight', label: 'Lose Weight', sub: 'Burn fat and feel lighter', icon: <Flame className="w-4 h-4 text-orange-400" /> },
                { id: 'build-muscle', label: 'Build Muscle', sub: 'Get stronger and gain mass', icon: <Dumbbell className="w-4 h-4 text-yellow-400" /> },
                { id: 'stay-healthy', label: 'Stay Healthy', sub: 'Maintain my current health', icon: <Heart className="w-4 h-4 text-red-400" /> },
                { id: 'reduce-stress', label: 'Reduce Stress', sub: 'Feel calm and sleep better', icon: <Sliders className="w-4 h-4 text-indigo-400" /> },
                { id: 'improve-fitness', label: 'Improve Fitness', sub: 'More energy and endurance', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
              ].map((g) => {
                const isSelected = goal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => handleGoalSelect(g.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-gold-primary bg-gold-primary/[0.08] shadow-[0_0_20px_rgba(244,162,32,0.15)]'
                        : 'border-white/[0.06] bg-bg-surface hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-gold-primary/10 text-gold-primary' : 'bg-white/[0.03] text-text-muted'}`}>
                        {g.icon}
                      </div>
                      <div>
                        <h4 className={`text-xs md:text-sm font-bold ${isSelected ? 'text-gold-primary' : 'text-text-headline'}`}>
                          {g.label}
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-body">{g.sub}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gold-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-bg-deep stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Activity Level */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                How active are you?
              </h2>
              <p className="text-xs text-text-muted">
                Daily calorie requirements are heavily based on your physical movement level.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'sedentary', label: '🛋️ Sedentary', desc: 'I sit most of the day' },
                { id: 'lightly-active', label: '🚶 Lightly Active', desc: 'I walk a bit or light exercise 1–2 days/week' },
                { id: 'moderately-active', label: '🏋️ Moderately Active', desc: 'I exercise 3–4 days/week' },
                { id: 'very-active', label: '🏃 Very Active', desc: 'I work out hard 5–6 days/week' },
                { id: 'extremely-active', label: '⚡ Extremely Active', desc: 'Intense daily training or physical job' },
              ].map((act) => {
                const isSelected = activityLevel === act.id;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleActivitySelect(act.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-gold-primary bg-gold-primary/[0.08] shadow-[0_0_20px_rgba(244,162,32,0.15)]'
                        : 'border-white/[0.06] bg-bg-surface hover:border-white/[0.12]'
                    }`}
                  >
                    <div>
                      <h4 className={`text-xs md:text-sm font-bold ${isSelected ? 'text-gold-primary' : 'text-text-headline'}`}>
                        {act.label}
                      </h4>
                      <p className="text-[10px] md:text-xs text-text-body">{act.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gold-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-bg-deep stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Health Info Checklist with Interactive Body Map */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                Any existing health conditions?
              </h2>
              <p className="text-xs text-text-muted">
                Select from the list or tap the glowing joints directly on the body map below to protect those areas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Column Checkboxes */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 text-left">
                {HEALTH_CONDITIONS_LIST.map((cond) => {
                  const isSelected = healthConditions.includes(cond.id);
                  return (
                    <div
                      key={cond.id}
                      onClick={() => toggleHealthCondition(cond.id)}
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                          : 'border-white/[0.04] bg-bg-surface hover:border-white/[0.08]'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isSelected ? 'border-purple-500 bg-purple-600' : 'border-white/20'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-text-headline'}`}>
                          {cond.label}
                        </h4>
                        <p className="text-[10px] text-text-body mt-0.5">{cond.desc}</p>
                      </div>
                    </div>
                  );
                })}

                {/* None option */}
                <div
                  onClick={() => toggleHealthCondition('none')}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    healthConditions.length === 0
                      ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                      : 'border-white/[0.04] bg-bg-surface hover:border-white/[0.08]'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    healthConditions.length === 0 ? 'border-purple-500 bg-purple-600' : 'border-white/20'
                  }`}>
                    {healthConditions.length === 0 && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${healthConditions.length === 0 ? 'text-purple-300' : 'text-text-headline'}`}>
                      None of the above
                    </h4>
                    <p className="text-[10px] text-text-body mt-0.5">I am completely healthy and cleared for physical exercise.</p>
                  </div>
                </div>
              </div>

              {/* Right Column Interactive Body SVG */}
              <div className="flex flex-col items-center bg-bg-deep/45 border border-white/[0.04] p-4 rounded-2xl relative">
                <span className="absolute top-2.5 right-3 text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider">TAP GLOWING JOINTS</span>
                
                <svg viewBox="0 0 120 220" className="w-32 h-56 select-none">
                  {/* Silhouette */}
                  <path
                    d="M60,20 C64,20 67,23 67,28 C67,33 64,36 60,36 C56,36 53,33 53,28 C53,23 56,20 60,20 Z 
                       M60,37 C54,37 47,43 45,55 L43,90 C42,95 45,98 48,96 L51,94 L51,140 L44,200 C43,205 47,208 50,205 L60,155 L70,205 C73,208 77,205 76,200 L69,140 L69,94 L72,96 C75,98 78,95 77,90 L75,55 C73,43 66,37 60,37 Z"
                    className="fill-white/[0.04] stroke-white/20 stroke-[1.5] transition"
                  />
                  
                  {/* Neck/Spine Node -> high-blood-pressure (General strain) */}
                  <g className="cursor-pointer group" onClick={() => toggleHealthCondition('high-blood-pressure')}>
                    <circle cx="60" cy="45" r="10" className={`transition fill-purple-500/10 ${healthConditions.includes('high-blood-pressure') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    <circle cx="60" cy="45" r="5" className={`stroke-2 transition-all ${healthConditions.includes('high-blood-pressure') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                  </g>

                  {/* Chest/Heart Node -> heart-condition */}
                  <g className="cursor-pointer group" onClick={() => toggleHealthCondition('heart-condition')}>
                    <circle cx="60" cy="65" r="11" className={`transition fill-purple-500/10 ${healthConditions.includes('heart-condition') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    <circle cx="60" cy="65" r="5" className={`stroke-2 transition-all ${healthConditions.includes('heart-condition') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                  </g>

                  {/* Spine/Back Node -> back-pain */}
                  <g className="cursor-pointer group" onClick={() => toggleHealthCondition('back-pain')}>
                    <circle cx="60" cy="98" r="12" className={`transition fill-purple-500/10 ${healthConditions.includes('back-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    <circle cx="60" cy="98" r="5" className={`stroke-2 transition-all ${healthConditions.includes('back-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                  </g>

                  {/* Left Knee Node -> joint-pain */}
                  <g className="cursor-pointer group" onClick={() => toggleHealthCondition('joint-pain')}>
                    <circle cx="51" cy="155" r="11" className={`transition fill-purple-500/10 ${healthConditions.includes('joint-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    <circle cx="51" cy="155" r="4.5" className={`stroke-2 transition-all ${healthConditions.includes('joint-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                  </g>

                  {/* Right Knee Node -> joint-pain */}
                  <g className="cursor-pointer group" onClick={() => toggleHealthCondition('joint-pain')}>
                    <circle cx="69" cy="155" r="11" className={`transition fill-purple-500/10 ${healthConditions.includes('joint-pain') ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
                    <circle cx="69" cy="155" r="4.5" className={`stroke-2 transition-all ${healthConditions.includes('joint-pain') ? 'fill-purple-500 stroke-white' : 'fill-transparent stroke-purple-400/70 animate-pulse'}`} />
                  </g>
                </svg>

                <div className="text-[9px] font-mono text-text-muted mt-2 text-center w-full">
                  Tap joints: Neck (BP) · Chest (Heart) · Spine (Back) · Knees (Joints)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Food Preferences Checklist */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-text-headline mb-1">
                Your Food Preferences
              </h2>
              <p className="text-xs text-text-muted">
                These options dictate recipes and nutritional ingredients generated for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
              {FOOD_PREFS_LIST.map((pref) => {
                const isSelected = foodPreferences.includes(pref.id);
                return (
                  <div
                    key={pref.id}
                    onClick={() => toggleFoodPreference(pref.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-gold-primary bg-gold-primary/[0.03]'
                        : 'border-white/[0.04] bg-bg-surface hover:border-white/[0.08]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      isSelected ? 'border-gold-primary bg-gold-primary' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-bg-deep stroke-[3]" />}
                    </div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-gold-primary' : 'text-text-headline'}`}>
                      {pref.label}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button Controls */}
        <div className="flex space-x-3 pt-6 border-t border-white/[0.04] mt-6">
          <button
            type="button"
            onClick={stepBack}
            className="w-1/3 py-3 rounded-lg text-xs font-bold text-text-body bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            type="button"
            onClick={validateAndNext}
            className="w-2/3 py-3 rounded-lg text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light hover:scale-[1.01] transition active:scale-[0.98]"
          >
            {step === totalSteps ? 'Save profile & Build plan ✦' : 'Next Step →'}
          </button>
        </div>

      </div>
    </div>
  );
}
