import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, Flame, Heart, Sparkles, LogIn, Clock, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TiltCard from './TiltCard';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onStartGuest: () => void;
  onLogin: (username: string) => void;
}

const SLOGANS = [
  "✦ Begin your journey to better health today.",
  "✦ Simple home workouts and customized healthy meals.",
  "✦ Take care of your mind, body, and soul."
];

export default function LandingPage({
  onStartOnboarding,
  onStartGuest,
  onLogin
}: LandingPageProps) {
  const [sloganIndex, setSloganIndex] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'nutrition' | 'fitness' | 'mind' | 'reminders'>('nutrition');

  // Cycle slogans every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Please enter your name.');
      return;
    }
    onLogin(usernameInput.trim());
    setIsLoginModalOpen(false);
  };

  // Stagger variants for smooth content entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-bg-deep text-text-body relative overflow-hidden">
      {/* Immersive 3D floating background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] left-[15%] w-72 h-72 bg-gold-primary/5 rounded-full filter blur-[100px]"
        />
        <motion.div 
          animate={{
            x: [0, -50, 70, 0],
            y: [0, 90, -60, 0],
            scale: [1, 0.85, 1.15, 1]
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gold-primary/[0.04] rounded-full filter blur-[120px]"
        />
      </div>

      {/* Hero Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-4 py-12 text-center flex-grow flex flex-col justify-center relative z-10"
      >
        {/* Dynamic Slogan Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center self-center px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-gold-primary mr-2 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.span 
              key={sloganIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-xs md:text-sm font-sans font-medium text-text-gold"
            >
              {SLOGANS[sloganIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-headline mb-4"
        >
          Your Health. <span className="text-gradient-purple">Your Way.</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl font-sans font-medium text-text-headline max-w-2xl mx-auto mb-6"
        >
          Take Care of Your Health — The Smart Way
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="text-sm md:text-md text-text-body max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Get your food plan, workout routine, and mental health support — all in one free app. Specifically customized for traditional diets and lifestyle.
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold text-purple-50 btn-3d-purple uppercase tracking-wider"
            id="cta-get-started"
          >
            Get Started Free →
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold text-text-headline btn-3d-slate uppercase tracking-wider"
            id="cta-login"
          >
            Already registered? Log In
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center space-x-6 text-xs md:text-sm text-text-muted font-mono mb-12 border-y border-white/[0.04] py-4 max-w-lg mx-auto"
        >
          <span>⚡ 10,000+ Users</span>
          <span className="text-white/20">|</span>
          <span>🎁 100% Free</span>
          <span className="text-white/20">|</span>
          <span>🛠️ 3 Tools in 1</span>
        </motion.div>

        {/* Guest Mode Banner */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-bg-card border border-purple-500/25 shadow-deep mb-16 text-left relative overflow-hidden"
        >
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-purple-400 mt-1 sm:mt-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-headline mb-0.5">
                  Try Before You Sign Up (Guest Mode)
                </h3>
                <p className="text-xs text-text-body">
                  Explore every single helper inside Health Care Hub instantly. Use full app free for 3 days with local save!
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStartGuest}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold btn-3d-purple font-mono shrink-0 uppercase tracking-wider"
            >
              Try as Guest →
            </motion.button>
          </div>
        </motion.div>

        {/* What's Included Grid */}
        <div className="text-left max-w-4xl mx-auto mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-text-gold font-mono text-center mb-8"
          >
            WHAT'S INCLUDED: Everything You Need to Stay Healthy
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard>
              <div className="p-6 rounded-xl bg-bg-card border border-white/[0.04] hover:border-gold-primary/20 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary mb-4">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2">🥗 Food Plan</h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Balanced recipes calculated exactly to fit your daily calories, with heart-safe and sugar-safe guidelines built-in.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-xl bg-bg-card border border-white/[0.04] hover:border-gold-primary/20 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary mb-4">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2">🏃 Easy Workouts</h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Simple knee-safe, back-safe bodyweight workouts with clear visual timers. Beginner-locked for heart conditions.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-xl bg-bg-card border border-purple-500/15 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col justify-between card-3d-purple">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 mb-4">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2">🧠 Mental Relaxation</h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Mindful breathing models like 4-7-8 and Sleep Prep to naturally relieve day-to-day stress, headache, and fatigue.
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* INTERACTIVE FEATURE EXPLORER SHOWCASE */}
        <div className="text-left max-w-4xl mx-auto mb-16 border-t border-white/[0.04] pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-text-gold font-mono text-center mb-2"
          >
            ✦ INTERACTIVE CAPABILITIES DISCOVERY ✦
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-text-muted mb-8 max-w-lg mx-auto"
          >
            Explore how Health Care Hub guides your lifestyle decisions. Click any category below to preview how it works:
          </motion.p>

          {/* Tabs Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-xl max-w-2xl mx-auto">
            <button
              onClick={() => setActiveFeatureTab('nutrition')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'nutrition'
                  ? 'bg-purple-600 text-purple-50 shadow-lg shadow-purple-500/20'
                  : 'text-text-body hover:bg-white/[0.03] hover:text-text-headline'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Nutrition Kitchen</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('fitness')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'fitness'
                  ? 'bg-purple-600 text-purple-50 shadow-lg shadow-purple-500/20'
                  : 'text-text-body hover:bg-white/[0.03] hover:text-text-headline'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Fitness Training</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('mind')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'mind'
                  ? 'bg-purple-600 text-purple-50 shadow-lg shadow-purple-500/20'
                  : 'text-text-body hover:bg-white/[0.03] hover:text-text-headline'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Mind Support</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('reminders')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'reminders'
                  ? 'bg-purple-600 text-purple-50 shadow-lg shadow-purple-500/20'
                  : 'text-text-body hover:bg-white/[0.03] hover:text-text-headline'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Wellness Reminders</span>
            </button>
          </div>

          {/* Active Tab Content Render */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-bg-card border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-deep flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Left Column: Visual Mockup representation of the dashboard tool */}
              <div className="w-full md:w-1/2 space-y-4">
                {activeFeatureTab === 'nutrition' && (
                  <div className="p-5 rounded-xl bg-bg-surface border border-white/[0.04] space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 rounded-bl-lg font-bold">HEALTHY PORTIONS</div>
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                      <span className="text-xs font-bold text-text-headline">Weekly Diet Sheet</span>
                      <span className="text-[10px] font-mono text-gold-primary font-bold">Target: 2,100 kcal</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] p-2 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span>🌅 Breakfast: Bran Flatbread + Egg</span>
                        <span className="text-text-gold font-mono font-bold">310 kcal</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] p-2 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span>☀️ Lunch: Lentils Soup + Salad</span>
                        <span className="text-text-gold font-mono font-bold">420 kcal</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] p-2 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span>🌙 Dinner: Grilled Lean Protein + Greens</span>
                        <span className="text-text-gold font-mono font-bold">540 kcal</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-text-muted">
                      <span>Carbs: 180g</span>
                      <span>Protein: 120g</span>
                      <span>Fat: 55g</span>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'fitness' && (
                  <div className="p-5 rounded-xl bg-bg-surface border border-white/[0.04] space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-yellow-500 bg-yellow-500/10 rounded-bl-lg font-bold">KNEE & HEART SAFE</div>
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                      <span className="text-xs font-bold text-text-headline">Active Exercise Timer</span>
                      <span className="px-2 py-0.5 bg-gold-primary/10 text-gold-primary text-[9px] rounded font-mono font-bold uppercase">BEGINNER PROGRAM</span>
                    </div>
                    <div className="py-4 text-center space-y-2">
                      <div className="text-2xl font-mono font-bold tracking-tight text-text-headline">01:45</div>
                      <div className="text-[10px] text-text-gold font-mono uppercase tracking-wider">NEXT: CHAIR WALL SQUAT (30s REST)</div>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-gold-primary h-full w-[65%]" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-text-muted pt-1">
                      <span>ELAPSED: 4 MIN</span>
                      <span>TOTAL: 12 MIN</span>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'mind' && (
                  <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/25 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-purple-300 bg-purple-500/15 rounded-bl-lg font-bold">CONFIDENTIAL</div>
                    <div className="flex justify-between items-center border-b border-purple-500/15 pb-2">
                      <span className="text-xs font-bold text-text-headline">Stress Counsel Logs</span>
                      <span className="text-[10px] font-mono text-purple-300 font-bold">3 Active Targets</span>
                    </div>
                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <div className="p-2.5 rounded bg-purple-500/5 border border-purple-500/15 text-text-muted">
                        <strong className="text-purple-300 text-[10px] block font-mono uppercase mb-0.5">HEALTH STRATEGY IDENTIFIED:</strong>
                        "Avoid fast hydration; take tiny sips and practice muscle relaxation to alleviate day-end headaches."
                      </div>
                      <div className="p-2 bg-white/[0.01] text-[10px] text-text-muted italic border-l-2 border-purple-400/30 pl-2">
                        Reflection: "Feeling lighter after pacing my breath. Ready to sleep early today."
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'reminders' && (
                  <div className="p-5 rounded-xl bg-bg-surface border border-white/[0.04] space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-blue-400 bg-blue-400/10 rounded-bl-lg font-bold">LIVE METRICS</div>
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                      <span className="text-xs font-bold text-text-headline">My Daily Ledger Tracker</span>
                      <span className="text-[10px] font-mono text-blue-400 font-bold">80% Hydrated</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                      <div className="p-2.5 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span className="block text-[9px] font-mono text-text-muted uppercase">WATER LOG</span>
                        <strong className="text-blue-400 text-xs">2.4 / 3.0 Liters</strong>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span className="block text-[9px] font-mono text-text-muted uppercase">STEP COUNTER</span>
                        <strong className="text-emerald-400 text-xs">7,200 / 8,000 steps</strong>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span className="block text-[9px] font-mono text-text-muted uppercase">SLEEP LEDGER</span>
                        <strong className="text-purple-400 text-xs">7.5 / 8 Hours</strong>
                      </div>
                      <div className="p-2.5 bg-white/[0.02] rounded border border-white/[0.03]">
                        <span className="block text-[9px] font-mono text-text-muted uppercase">FASTING CYCLE</span>
                        <strong className="text-amber-400 text-[10px]">Active Pre-Dawn</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Descriptions & Detailed Benefits list */}
              <div className="w-full md:w-1/2 space-y-4">
                {activeFeatureTab === 'nutrition' && (
                  <>
                    <h3 className="text-base font-bold text-text-headline flex items-center">
                      <Flame className="w-4 h-4 text-gold-primary mr-2" /> Personalized Wellness Kitchen
                    </h3>
                    <p className="text-xs text-text-body leading-relaxed">
                      Enjoy a tailored, metabolic-approved eating regime that features local, accessible foods. Say goodbye to strict, unpalatable constraints and replace ingredients with healthy, heart-safe varieties.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Automatic Calories Allocation</strong>: Tailors carbs, fats, and protein precisely to fit your exact bio-onboarding specs.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Comprehensive Search Ledger</strong>: Instant food macro analysis spanning traditional recipes and daily snacks.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Local Kitchen Swapper</strong>: Replace high-oil or refined-wheat items with healthy low-sodium/lower-cholesterol equivalents.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Snapshot Analyzer</strong>: Estimate food plates, portion densities, and overall values via our static image calculator.</span>
                      </li>
                    </ul>
                  </>
                )}

                {activeFeatureTab === 'fitness' && (
                  <>
                    <h3 className="text-base font-bold text-text-headline flex items-center">
                      <Activity className="w-4 h-4 text-gold-primary mr-2" /> Knee-Safe & Goal-Focused Training
                    </h3>
                    <p className="text-xs text-text-body leading-relaxed">
                      Execute simple, joint-safe workouts at home with no heavy equipment required. The platform respects your chronic parameters and heart history, dynamically locking advanced exertion levels to protect you.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Live Activity Timer</strong>: Follow clear high-contrast step-by-step guides with rest metronomes and simple sound aids.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Chronic Safety Adjuster</strong>: Restricts high-impact, intense cardio if user flags history of heart or knee complications.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Permanent Workout Archive</strong>: Log durations, exertion scales, and category counts to maintain structured streaks.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Beginner Cardio Splits</strong>: Body weight workouts designed to optimize cardiovascular health safely and gently.</span>
                      </li>
                    </ul>
                  </>
                )}

                {activeFeatureTab === 'mind' && (
                  <>
                    <h3 className="text-base font-bold text-text-headline flex items-center">
                      <Smile className="w-4 h-4 text-gold-primary mr-2" /> Mind Counselor & Cozy Pacing
                    </h3>
                    <p className="text-xs text-text-body leading-relaxed">
                      Soothe day-end anxiety or insomnia. Connect with a private counseling companion, write gratitude checklists, or breathe with custom metronomes to slow down your heart rate.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Non-Judgmental Conversation</strong>: Share life stresses, work pressure, or routine blockages inside a secure environment.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Smart Auto-Notes Synthesis</strong>: Chat summaries automatically register daily hurdles and active strategies on your board.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Dynamic Metronomes</strong>: Follow 4-7-8, Deep Sleep Prep, or custom breathing timers with interactive visual expansions.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Gratitude Log</strong>: Build a repository of warm, positive memories to review during challenging moments.</span>
                      </li>
                    </ul>
                  </>
                )}

                {activeFeatureTab === 'reminders' && (
                  <>
                    <h3 className="text-base font-bold text-text-headline flex items-center">
                      <Clock className="w-4 h-4 text-gold-primary mr-2" /> Unified Wellness Ledger & Alerts
                    </h3>
                    <p className="text-xs text-text-body leading-relaxed">
                      Organize your hydration targets, step goals, sleep habits, and fasting timelines. View automated trend breakdowns and clinical scientific rationales that help you understand your metrics.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Interactive Water Gauge</strong>: Click custom cups to fill your digital bottle, monitoring target hydration percentages.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Daily Sleep & Step Logs</strong>: Maintain structured records of steps taken and rest duration inside local storage.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Scientific Highlight Audits</strong>: Real clinical rationales detailing nutritional and physical targets on your active dashboard.</span>
                      </li>
                      <li className="flex items-start text-xs text-text-body">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mr-2.5 mt-0.5" />
                        <span><strong>Fasting Assistance Module</strong>: Tracks Sehri/Iftari windows with automated sunrise and sunset schedule helpers.</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* HOW HEALTH CARE HUB WORKS - STEP BY STEP */}
        <div className="text-left max-w-4xl mx-auto mb-16 border-t border-white/[0.04] pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-text-gold font-mono text-center mb-8"
          >
            ✦ THE 3-STEP WELLNESS BLUEPRINT ✦
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 relative p-5 bg-bg-card border border-white/[0.04] rounded-xl">
              <span className="text-3xl font-mono font-extrabold text-gold-primary/30 block">01</span>
              <h4 className="text-sm font-bold text-text-headline">Build Bio-Profile</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Take our 1-minute onboarding survey. Input physical metrics, dietary interests, activity levels, and custom cardiovascular/joint concerns.
              </p>
            </div>

            <div className="space-y-3 relative p-5 bg-bg-card border border-white/[0.04] rounded-xl">
              <span className="text-3xl font-mono font-extrabold text-gold-primary/30 block">02</span>
              <h4 className="text-sm font-bold text-text-headline">Follow Tailored Directives</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Use our automated food charts, joint-safe physical workouts with live audio rest-timers, and mindful breathing cycles to stabilize stress.
              </p>
            </div>

            <div className="space-y-3 relative p-5 bg-bg-card border border-white/[0.04] rounded-xl">
              <span className="text-3xl font-mono font-extrabold text-gold-primary/30 block">03</span>
              <h4 className="text-sm font-bold text-text-headline">Log Progress & Save History</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Log daily steps, cups of water, calories, and sleep. Use guest mode or register a free account to back up and preserve your history.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Quote Section */}
        <div className="text-left max-w-4xl mx-auto mb-16 border-t border-white/[0.04] pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-text-gold font-mono text-center mb-8"
          >
            ✦ PERSONAL STORIES FROM OUR MEMBERS ✦
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TiltCard>
              <div className="p-6 rounded-xl bg-bg-card border border-white/[0.04] shadow-card relative h-full">
                <span className="text-3xl text-gold-primary/20 font-serif absolute top-3 left-4">“</span>
                <p className="text-sm md:text-md font-serif italic text-text-headline leading-relaxed mb-4 pl-4">
                  This app helped me walk more. My knees do not hurt anymore.
                </p>
                <div className="text-[11px] font-mono text-text-muted pl-4">
                  — BILAL, LAHORE
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-xl bg-bg-card border border-white/[0.04] shadow-card relative h-full">
                <span className="text-3xl text-gold-primary/20 font-serif absolute top-3 left-4">“</span>
                <p className="text-sm md:text-md font-serif italic text-text-headline leading-relaxed mb-4 pl-4">
                  I love the low-oil recipes. They taste good and keep my sugar safe.
                </p>
                <div className="text-[11px] font-mono text-text-muted pl-4">
                  — AMINA, KARACHI
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

      </motion.div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/[0.04] px-4 md:px-8 text-xs text-text-muted text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onStartOnboarding} className="hover:text-text-gold transition">Features</button>
          <span>•</span>
          <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-text-gold transition">Log In</button>
          <span>•</span>
          <button onClick={onStartGuest} className="hover:text-text-gold transition">Try as Guest</button>
        </div>
        <div>
          © 2026 Health Care Hub (HH)
        </div>
      </footer>

      {/* Simple Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="w-full max-w-md p-6 rounded-xl bg-bg-surface border border-white/[0.08] shadow-deep"
            >
              <h2 className="text-lg font-bold text-text-headline mb-2 flex items-center">
                <LogIn className="w-5 h-5 text-gold-primary mr-2" /> Log In to Your Health Care Hub
              </h2>
              <p className="text-xs text-text-body mb-6">
                Enter your name to access your previous session and synchronized metrics instantly.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    Password (Optional for Demo)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave empty or enter any password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none rounded-lg p-3 text-text-headline placeholder-text-muted text-sm"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-400 font-mono">{loginError}</p>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-lg text-xs font-bold text-text-body bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-lg text-xs font-bold text-bg-deep bg-gold-primary hover:bg-gold-light transition"
                  >
                    Log In
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

