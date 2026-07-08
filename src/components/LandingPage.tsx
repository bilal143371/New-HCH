import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Flame, Heart, Sparkles, LogIn, Clock, Smile, Dumbbell, Soup, Brain, ArrowRight } from 'lucide-react';
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

// Custom Premium Medical-Grade SVG Icons colored in Slate, Sky Blue, and Mint Green
const SVGIconNutrition = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#10B981"/>
    <path d="M8.5 10.5C9.32843 10.5 10 9.82843 10 9C10 8.17157 9.32843 7.5 8.5 7.5C7.67157 7.5 7 8.17157 7 9C7 9.82843 7.67157 10.5 8.5 10.5Z" fill="#0284C7"/>
    <path d="M15.5 10.5C16.3284 10.5 17 9.82843 17 9C17 8.17157 16.3284 7.5 15.5 7.5C14.6716 7.5 14 8.17157 14 9C14 9.82843 14.6716 10.5 15.5 10.5Z" fill="#0284C7"/>
  </svg>
);

const SVGIconFitness = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" fill="#0284C7"/>
  </svg>
);

const SVGIconMind = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C7.5 3 3.7 6.4 3.1 10.8C2.3 11.2 1.8 12.1 1.8 13C1.8 14.1 2.5 14.9 3.5 15.1C3.8 18.9 7 21.9 11 21.9C15.8 21.9 19.8 18.2 20.2 13.5C21.2 13.1 21.8 12.1 21.8 11C21.8 9.6 20.5 8.4 19.1 8.8C18.1 5.4 15.3 3 12 3ZM12 5.5C14.2 5.5 16.1 7.1 16.8 9.3C15.4 9.1 14.1 9.8 13.5 11C12.9 12.2 13.1 13.7 14 14.6C13.5 15.8 12.3 16.5 11 16.5C9.3 16.5 8 15.2 8 13.5C8 12.5 8.5 11.6 9.3 11C8.2 10.4 7.5 9.3 7.5 8C7.5 6.6 8.6 5.5 10 5.5C10.7 5.5 11.4 5.8 11.9 6.3C12 6.3 12 6.3 12 6.3C12.1 6.3 12.1 6.3 12.2 6.3C12.6 5.8 13.3 5.5 14 5.5H12Z" fill="#10B981"/>
    <circle cx="12" cy="11.5" r="2" fill="#0284C7"/>
  </svg>
);

const SVGIconReminders = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12Z" fill="#10B981"/>
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20ZM12.5 7H11V13L16.2 16.2L17 15L12.5 12.3V7Z" fill="#0284C7"/>
  </svg>
);

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
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-bg-deep text-text-body relative overflow-hidden">
      {/* Immersive sky-blue gradient background glow */}
      <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-b from-purple-100/40 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-200/15 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Main Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-16 text-center lg:text-left flex-grow flex flex-col justify-center relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column (60% equivalent: col-span-7) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Slogan Banner */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6 shadow-sm self-center lg:self-start"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-2 animate-pulse shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span 
                  key={sloganIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] md:text-xs font-sans font-semibold text-purple-700 tracking-tight"
                >
                  {SLOGANS[sloganIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Hero Content */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-text-headline mb-4 leading-tight"
            >
              Your Health. <span className="text-gradient-purple">Your Way.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg lg:text-xl font-sans font-semibold text-text-headline mb-4"
            >
              Take Care of Your Health — The Smart Way
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-xs md:text-sm text-text-body max-w-xl mb-8 leading-relaxed"
            >
              Get your food plan, workout routine, and mental health support — all in one free app. Specifically customized for traditional diets and lifestyle.
            </motion.p>

            {/* CTA Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10 w-full sm:w-auto"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onStartOnboarding}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold text-white btn-3d-purple uppercase tracking-wider flex items-center justify-center space-x-1.5"
                id="cta-get-started"
              >
                <span>Find Your Healthy Strategy (1-Min Quiz) →</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold text-text-headline btn-3d-slate uppercase tracking-wider"
                id="cta-login"
              >
                Already registered? Log In
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column (40% equivalent: col-span-5) */}
          <div className="col-span-1 lg:col-span-5 flex items-center justify-center">
            
            {/* Desktop: realistic laptop/browser frame showing Daily Tracker (Phase 9) */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:block w-full"
            >
              <div className="relative w-full aspect-[4/3] max-w-sm mx-auto bg-slate-800 rounded-2xl p-1.5 shadow-2xl border-4 border-slate-700">
                {/* Top Browser Bar */}
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 rounded-t-xl text-[8px] text-slate-500 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                  <span className="pl-2 select-none opacity-60">healthcare-hub.org/home</span>
                </div>
                {/* Browser Screen Content */}
                <div className="w-full h-[calc(100%-1.25rem)] bg-[#F8FAFC] rounded-b-xl p-4 overflow-hidden text-left flex flex-col justify-between">
                  {/* Mock Top bar */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4 h-4 rounded-full bg-purple-650 text-white text-[8px] font-bold flex items-center justify-center">J</div>
                      <span className="text-[9px] font-bold text-slate-800">Jamal's Hub</span>
                    </div>
                    <span className="text-[7px] font-mono bg-purple-100 text-purple-705 px-1.5 rounded-full font-bold">Guest</span>
                  </div>

                  {/* Daily Basis Tracker circles */}
                  <div className="bg-white border border-slate-100 p-2.5 rounded-xl space-y-2 shadow-sm flex-grow flex flex-col justify-center">
                    <div className="text-[7.5px] font-bold text-slate-700 font-mono">DAILY BASIS Vitals</div>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="flex flex-col items-center bg-slate-50 p-1 rounded-lg border border-slate-100/50">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="16" cy="16" r="13" className="stroke-slate-200" strokeWidth="2.5" fill="none" />
                            <circle cx="16" cy="16" r="13" className="stroke-emerald-500" strokeWidth="2.5" fill="none" strokeDasharray="81.6" strokeDashoffset="25" />
                          </svg>
                          <span className="absolute text-[7px] font-bold text-slate-800">4k</span>
                        </div>
                        <span className="text-[5.5px] text-[#64748B] font-bold block mt-1 uppercase font-mono">Steps</span>
                      </div>
                      <div className="flex flex-col items-center bg-slate-50 p-1 rounded-lg border border-slate-100/50">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="16" cy="16" r="13" className="stroke-slate-200" strokeWidth="2.5" fill="none" />
                            <circle cx="16" cy="16" r="13" className="stroke-sky-500" strokeWidth="2.5" fill="none" strokeDasharray="81.6" strokeDashoffset="35" />
                          </svg>
                          <span className="absolute text-[7px] font-bold text-slate-800">5🥛</span>
                        </div>
                        <span className="text-[5.5px] text-[#64748B] font-bold block mt-1 uppercase font-mono">Water</span>
                      </div>
                      <div className="flex flex-col items-center bg-slate-50 p-1 rounded-lg border border-slate-100/50">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="16" cy="16" r="13" className="stroke-slate-200" strokeWidth="2.5" fill="none" />
                            <circle cx="16" cy="16" r="13" className="stroke-purple-650" strokeWidth="2.5" fill="none" strokeDasharray="81.6" strokeDashoffset="15" />
                          </svg>
                          <span className="absolute text-[7px] font-bold text-slate-800">7h</span>
                        </div>
                        <span className="text-[5.5px] text-[#64748B] font-bold block mt-1 uppercase font-mono">Sleep</span>
                      </div>
                    </div>
                  </div>

                  {/* Small live banner at the bottom */}
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-1.5 mt-2 flex justify-between items-center text-[7px] text-purple-700">
                    <span>✓ Custom Nutrition Active</span>
                    <span className="font-mono font-bold">1,850 kcal</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile/Tablet Fallback Mockup (Visible on small screens) */}
            <motion.div
              variants={itemVariants}
              className="block lg:hidden w-full max-w-md mx-auto mt-2"
            >
              <img
                src="/hero_mockup.png"
                alt="Health Care Hub Dashboard Phone Mockup surrounded by Fresh Healthy Ingredients"
                className="w-full h-auto rounded-xl border border-slate-150 shadow-md"
              />
            </motion.div>

          </div>
        </div>

        {/* Social Proof */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center space-x-6 text-[10px] md:text-xs text-text-muted font-mono mb-12 border-y border-slate-200/50 py-3.5 max-w-md mx-auto"
        >
          <span>⚡ 10,000+ Users</span>
          <span className="text-slate-200">•</span>
          <span>🎁 100% Free</span>
          <span className="text-slate-200">•</span>
          <span>🛠️ 3 Tools in 1</span>
        </motion.div>

        {/* Guest Mode Banner Card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full max-w-2xl mx-auto p-5 rounded-2xl bg-white border border-purple-100 shadow-md shadow-purple-500/[0.02] mb-16 text-left relative overflow-hidden"
        >
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-purple-500/[0.02] rounded-full blur-xl"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 mt-1 sm:mt-0 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-headline mb-0.5">
                  Try Before You Sign Up (Guest Mode)
                </h3>
                <p className="text-xs text-text-body">
                  Explore every helper inside Health Care Hub instantly. Use the full app free for 3 days with local data save!
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStartGuest}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold btn-3d-purple shrink-0 uppercase tracking-wider font-mono"
            >
              Try as Guest →
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Grid ("What's Included") */}
        <div className="text-left w-full mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono text-center mb-8"
          >
            ✦ WHAT'S INCLUDED: THREE INTEGRATED CLINICAL LAYERS ✦
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard>
              <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-md shadow-emerald-500/[0.01] hover:border-emerald-300 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  {/* High Quality Male Meal Prep Image */}
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                    <img 
                      src="/male_meal_prep.png" 
                      alt="Male model prepping a healthy nutritious meal plate with fresh organic vegetables" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                    <SVGIconNutrition />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2 flex items-center gap-1.5">
                    🥗 Nutrition Kitchen
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Custom recipes calculated to fit your exact daily metabolic values, featuring local food tables, healthy alternatives, and heart/sugar safety filters.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-2xl bg-white border border-sky-100 shadow-md shadow-sky-500/[0.01] hover:border-sky-300 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  {/* High Quality Male Fitness Workout Image */}
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                    <img 
                      src="/male_workout.png" 
                      alt="Male model doing a joint safe bodyweight stretch in home gym" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                    <SVGIconFitness />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2 flex items-center gap-1.5">
                    🏃 Knee-Safe Fitness
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Joint-safe, cardio, and resistance moves with interactive visual guides and sound cues. Automatically restricts difficulty levels for chronic conditions.
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-md shadow-purple-500/[0.01] hover:border-purple-300 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  {/* High Quality Calm Mind Illustration */}
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                    <img 
                      src="/mental_relaxation.png" 
                      alt="Abstract soft meditation bubble breathing illustration" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                    <SVGIconMind />
                  </div>
                  <h3 className="text-sm font-bold text-text-headline mb-2 flex items-center gap-1.5">
                    🧠 Supportive Mind
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Private stress pacing, gratitude logs, and respiratory metronomes (like 4-7-8 and sleep prep cycles) to quickly ease day-end stress and headaches.
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* INTERACTIVE CAPABILITIES DISCOVERY MOCKUP */}
        <div className="text-left w-full mb-16 border-t border-slate-200/50 pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono text-center mb-2"
          >
            ✦ INTERACTIVE CAPABILITIES PREVIEW ✦
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-text-muted mb-8 max-w-md mx-auto"
          >
            Select a feature tab below to preview our real-time guidance tools inside a simulated web app dashboard environment.
          </motion.p>

          {/* Active Tab Selector (Pills) */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100/80 border border-slate-200/50 p-1.5 rounded-xl max-w-2xl mx-auto">
            <button
              onClick={() => setActiveFeatureTab('nutrition')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'nutrition'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'text-text-body hover:bg-slate-200/50 hover:text-text-headline'
              }`}
            >
              <Soup className="w-3.5 h-3.5" />
              <span>Nutrition</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('fitness')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'fitness'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'text-text-body hover:bg-slate-200/50 hover:text-text-headline'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Fitness</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('mind')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'mind'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'text-text-body hover:bg-slate-200/50 hover:text-text-headline'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Mind Support</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('reminders')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                activeFeatureTab === 'reminders'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'text-text-body hover:bg-slate-200/50 hover:text-text-headline'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ledger Hub</span>
            </button>
          </div>

          {/* Simulated Mobile Dashboard Frame */}
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-center bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-400/[0.02]">
            
            {/* Phone Screen Mockup */}
            <div className="w-full md:w-[320px] shrink-0 bg-slate-800 rounded-[36px] p-3 shadow-2xl border-4 border-slate-700 relative mx-auto">
              {/* Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-1 bg-slate-900 rounded-full"></div>
              </div>
              
              {/* Phone Screen Contents */}
              <div className="bg-bg-deep rounded-[26px] overflow-hidden border border-slate-900 min-h-[380px] flex flex-col justify-between text-left relative text-text-body select-none">
                {/* Mock Status Bar */}
                <div className="flex justify-between items-center px-6 pt-5 pb-2 text-[9px] font-mono text-slate-400 font-bold bg-white border-b border-slate-50">
                  <span>9:41 AM</span>
                  <div className="flex items-center space-x-1">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Mock Inner Card Frame Body */}
                <div className="p-4 flex-grow space-y-3 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeFeatureTab === 'nutrition' && (
                      <motion.div
                        key="mock-nutrition"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-text-headline">Macro Balance Kitchen</span>
                          <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">1,800 kcal Target</span>
                        </div>
                        
                        {/* Interactive SVG Calorie Ring Progress Bar */}
                        <div className="flex items-center space-x-3.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="26"
                                className="stroke-slate-100"
                                strokeWidth="5.5"
                                fill="transparent"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="26"
                                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                                strokeWidth="5.5"
                                fill="transparent"
                                strokeDasharray="163.3"
                                strokeDashoffset={163.3 - (163.3 * 1070) / 1800}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[9px] font-extrabold text-text-headline">1,070</span>
                              <span className="text-[6px] text-text-muted font-bold font-mono">/ 1,800</span>
                            </div>
                          </div>
                          <div className="flex-grow space-y-1 text-[9px]">
                            <div className="flex justify-between font-bold text-text-headline">
                              <span>Consumed</span>
                              <span className="text-emerald-600 font-mono">59%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[59%]"></div>
                            </div>
                            <span className="text-[7.5px] text-text-muted font-bold block">Remaining: 730 kcal</span>
                                       <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <span>🍳 Breakfast: Multigrain Roti with Soft Poached Egg</span>
                            <span className="text-emerald-650 font-mono font-bold">290 kcal</span>
                          </div>
                          <div className="flex justify-between items-center text-[9px] p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <span>🍲 Lunch: Traditional Moong Daal Soup + Garden Kachi Salad</span>
                            <span className="text-emerald-655 font-mono font-bold">390 kcal</span>
                          </div>
                          <div className="flex justify-between items-center text-[9px] p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <span>🍢 Dinner: Grilled Skinless Chicken Kebab</span>
                            <span className="text-emerald-660 font-mono font-bold">390 kcal</span>
                          </div>
                        </div>                       </div>
                        </div>
                      </motion.div>
                    )}

                    {activeFeatureTab === 'fitness' && (
                      <motion.div
                        key="mock-fitness"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-text-headline">Chair Wall Squats</span>
                          <span className="text-[9px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-bold">Rest Timer</span>
                        </div>
                        <div className="py-4 text-center space-y-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="text-3xl font-mono font-extrabold tracking-tight text-text-headline">00:45</div>
                          <div className="text-[8px] text-sky-600 font-mono uppercase tracking-wider">Breathing In / Out</div>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-600 h-full w-[60%]" />
                        </div>
                      </motion.div>
                    )}

                    {activeFeatureTab === 'mind' && (
                      <motion.div
                        key="mock-mind"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-text-headline">Breathing Metronome</span>
                          <span className="text-[9px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-bold">4-7-8 Pace</span>
                        </div>
                        <div className="p-3 bg-white border border-purple-100 rounded-xl space-y-2">
                          <div className="flex items-center justify-center h-16">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center animate-ping">
                              <Smile className="w-5 h-5 text-purple-600" />
                            </div>
                          </div>
                          <p className="text-[9px] text-center text-text-muted italic">"Inhale deeply through nose (4s)"</p>
                        </div>
                      </motion.div>
                    )}

                    {activeFeatureTab === 'reminders' && (
                      <motion.div
                        key="mock-reminders"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3.5"
                      >
                        <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                          <span className="text-[11px] font-bold text-text-headline">Hydration Ledger</span>
                          <span className="text-[9px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-bold">75% Achieved</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <span className="block text-[8px] font-mono text-text-muted uppercase">WATER LOG</span>
                            <strong className="text-sky-600 text-[10px]">2.2 / 3.0 L</strong>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <span className="block text-[8px] font-mono text-text-muted uppercase">STEP TRACKER</span>
                            <strong className="text-emerald-600 text-[10px]">6,100 steps</strong>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm col-span-2">
                            <span className="block text-[8px] font-mono text-text-muted uppercase">FASTING CYCLE</span>
                            <strong className="text-amber-600 text-[10px]">Sehri Ended / Iftari in 5 hrs</strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mock App Bottom Bar with Custom Premium SVGs */}
                <div className="grid grid-cols-4 border-t border-slate-100 bg-white px-2 py-2 text-center text-[7.5px] font-mono font-bold text-slate-400">
                  <div className={`flex flex-col items-center ${activeFeatureTab === 'nutrition' ? 'text-purple-600' : ''}`}>
                    <SVGIconNutrition />
                    <span>Food</span>
                  </div>
                  <div className={`flex flex-col items-center ${activeFeatureTab === 'fitness' ? 'text-purple-600' : ''}`}>
                    <SVGIconFitness />
                    <span>Fit</span>
                  </div>
                  <div className={`flex flex-col items-center ${activeFeatureTab === 'mind' ? 'text-purple-600' : ''}`}>
                    <SVGIconMind />
                    <span>Mind</span>
                  </div>
                  <div className={`flex flex-col items-center ${activeFeatureTab === 'reminders' ? 'text-purple-600' : ''}`}>
                    <SVGIconReminders />
                    <span>Log</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Column */}
            <div className="flex-grow text-left space-y-4">
              {activeFeatureTab === 'nutrition' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-text-headline flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-2 border border-emerald-100"><SVGIconNutrition /></span>
                    Macro Portion Calculations
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Enjoy eating meals tailored exactly to your bio-onboarding specifications. We provide a customized menu based on ingredients that are accessible locally in Pakistan.
                  </p>
                  <ul className="space-y-2 pt-1.5">
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Automatic Macro Splits</strong>: Carbs, fats, and protein are calculated based on your target weight goals.</span>
                    </li>
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Traditional Swapper</strong>: Substitute high-oil ingredients with healthy lower-cholesterol alternatives.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'fitness' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-text-headline flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mr-2 border border-sky-100"><SVGIconFitness /></span>
                    Beginner Knee & Heart-Safe Moves
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    No gym equipment required. Work out safely with our custom routines. If you have joint pain or high blood pressure, the system locks advanced moves.
                  </p>
                  <ul className="space-y-2 pt-1.5">
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Active Rest Timer</strong>: Clear indicators let you perform intervals with structured rest times.</span>
                    </li>
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Restriction Shield</strong>: Protects user cardiovascular systems by filtering high-impact moves automatically.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'mind' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-text-headline flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-2 border border-purple-100"><SVGIconMind /></span>
                    Stress Counsel & Breath Pacing
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Ease day-end physical fatigue, anxiety, and headaches. Log cozy reminders, write gratitude lists, or breathe with custom pacing bubbles.
                  </p>
                  <ul className="space-y-2 pt-1.5">
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Mental Pacing Metronome</strong>: Follow visual inhalation guides to reduce heart rate and lower stress.</span>
                    </li>
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Journal Ledger</strong>: A private dashboard to record warm memories and track mental energy.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'reminders' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-text-headline flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mr-2 border border-slate-200"><SVGIconReminders /></span>
                    Hydration & Fasting Tracker
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    Maintain structured records of water cups, steps taken, and rest cycles. Includes Ramadan fasting windows (Sehri and Iftari) automatically.
                  </p>
                  <ul className="space-y-2 pt-1.5">
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Cups Ledger Gauge</strong>: Tap to log standard glasses of water and monitor daily hydration targets.</span>
                    </li>
                    <li className="flex items-start text-xs text-text-body">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2 mt-0.5" />
                      <span><strong>Fasting Timetable</strong>: Tracks sunrise/sunset limits based on local time zones.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3-STEP WELLNESS BLUEPRINT (Responsive Timeline) */}
        <div className="text-left w-full mb-16 border-t border-slate-200/50 pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono text-center mb-8"
          >
            ✦ THE 3-STEP WELLNESS BLUEPRINT ✦
          </motion.h2>

          {/* Desktop view: Horizontal Layout */}
          <div className="hidden md:grid grid-cols-3 gap-6 relative">
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <span className="text-4xl font-mono font-extrabold text-purple-100 block mb-2">01</span>
              <h4 className="text-sm font-bold text-text-headline mb-2">Build Bio-Profile</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Take our 1-minute onboarding survey. Input physical metrics, dietary interests, activity levels, and custom cardiovascular/joint concerns.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <span className="text-4xl font-mono font-extrabold text-purple-100 block mb-2">02</span>
              <h4 className="text-sm font-bold text-text-headline mb-2">Follow Tailored Directives</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Use our automated food charts, joint-safe physical workouts with live audio rest-timers, and mindful breathing cycles to stabilize stress.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <span className="text-4xl font-mono font-extrabold text-purple-100 block mb-2">03</span>
              <h4 className="text-sm font-bold text-text-headline mb-2">Log Daily Ledger</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Log daily steps, cups of water, calories, and sleep. Use guest mode or register a free account to back up and preserve your history.
              </p>
            </div>
          </div>

          {/* Mobile view: Elegant Interactive Vertical Timeline */}
          <div className="md:hidden relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8">
            <div className="relative">
              {/* Dot */}
              <div className="absolute -left-[43px] top-1.5 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold border-4 border-bg-deep ring-2 ring-purple-100 shadow-sm">
                01
              </div>
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-text-headline mb-1.5">Build Bio-Profile</h4>
                <p className="text-xs text-text-body leading-relaxed">
                  Take our 1-minute onboarding survey. Input physical metrics, dietary interests, activity levels, and custom cardiovascular/joint concerns.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Dot */}
              <div className="absolute -left-[43px] top-1.5 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold border-4 border-bg-deep ring-2 ring-purple-100 shadow-sm">
                02
              </div>
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-text-headline mb-1.5">Follow Tailored Directives</h4>
                <p className="text-xs text-text-body leading-relaxed">
                  Use our automated food charts, joint-safe physical workouts with live audio rest-timers, and mindful breathing cycles to stabilize stress.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Dot */}
              <div className="absolute -left-[43px] top-1.5 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold border-4 border-bg-deep ring-2 ring-purple-100 shadow-sm">
                03
              </div>
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <h4 className="text-sm font-bold text-text-headline mb-1.5">Log Daily Ledger</h4>
                <p className="text-xs text-text-body leading-relaxed">
                  Log daily steps, cups of water, calories, and sleep. Use guest mode or register a free account to back up and preserve your history.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Quote Section */}
        <div className="text-left w-full mb-16 border-t border-slate-200/50 pt-12">
          <motion.h2 
            variants={itemVariants}
            className="text-xs font-bold uppercase tracking-widest text-purple-600 font-mono text-center mb-8"
          >
            ✦ PERSONAL STORIES FROM OUR MEMBERS ✦
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TiltCard>
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm relative h-full hover:shadow-md transition-all duration-300">
                <span className="text-3xl text-purple-600/10 font-serif absolute top-3 left-4">“</span>
                <p className="text-xs md:text-sm font-serif italic text-text-headline leading-relaxed mb-4 pl-4 pt-1">
                  This app helped me walk more. My knees do not hurt anymore.
                </p>
                <div className="text-[10px] font-mono text-text-muted pl-4">
                  — BILAL, LAHORE
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm relative h-full hover:shadow-md transition-all duration-300">
                <span className="text-3xl text-purple-600/10 font-serif absolute top-3 left-4">“</span>
                <p className="text-xs md:text-sm font-serif italic text-text-headline leading-relaxed mb-4 pl-4 pt-1">
                  I love the low-oil recipes. They taste good and keep my sugar safe.
                </p>
                <div className="text-[10px] font-mono text-text-muted pl-4">
                  — AMINA, KARACHI
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

      </motion.div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200/50 px-4 md:px-8 text-xs text-text-muted text-center flex flex-col items-center gap-6 max-w-5xl mx-auto relative z-10">
        
        {/* Project Development Team attribution section (Phase 8) */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-left grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-600">✦ Project Development Team</h4>
            <p className="text-[11px] text-text-body mt-1.5 leading-relaxed">
              This wellness portal is proudly designed and developed by:
            </p>
            <ol className="list-decimal list-inside text-[11px] text-text-headline font-semibold space-y-0.5 mt-2">
              <li>Muhammad Jamal</li>
              <li>Zainab Irfan</li>
              <li>Laiba Khan</li>
              <li>Aqsa Haider</li>
              <li>Ujala Ashraf</li>
            </ol>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end">
            <div className="text-left md:text-right">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">Official Submission Contact</span>
              <strong className="text-xs text-purple-750 block mt-1">Support Helpline: +92 309 4530756</strong>
            </div>
            <span className="text-[9.5px] text-text-muted font-mono mt-3 md:mt-0">Karachi & Lahore Regional Welfare Pilot System</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 border-t border-slate-200/40 pt-4">
          <div className="flex items-center space-x-4">
            <button onClick={onStartOnboarding} className="hover:text-purple-600 transition">Features</button>
            <span>•</span>
            <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-purple-600 transition">Log In</button>
            <span>•</span>
            <button onClick={onStartGuest} className="hover:text-purple-600 transition">Try as Guest</button>
          </div>
          <div>
            © 2026 Health Care Hub (HCH)
          </div>
        </div>
        <p className="text-[10px] text-text-muted/80 leading-relaxed text-center sm:text-left border-t border-slate-200/40 pt-4 w-full">
          Disclaimer: Health Care Hub (HCH) provides nutritional, breathing, and physical fitness guidelines for informational purposes only. It is not medical advice. If you suffer from underlying cardiovascular, metabolic, or joint conditions, consult a physician before using these programs.
        </p>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-100 shadow-2xl"
            >
              <h2 className="text-base font-bold text-text-headline mb-1 flex items-center">
                <LogIn className="w-5 h-5 text-purple-600 mr-2 shrink-0" /> Log In to Your Account
              </h2>
              <p className="text-xs text-text-body mb-5">
                Enter your name to access your previous session and synchronized metrics instantly.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-lg p-2.5 text-text-headline placeholder-text-muted text-xs transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave empty or enter any password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none rounded-lg p-2.5 text-text-headline placeholder-text-muted text-xs transition"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-650 font-mono">{loginError}</p>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="w-1/2 py-2 rounded-lg text-xs font-bold text-text-body bg-slate-100 hover:bg-slate-200 border border-slate-200/50 transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition active:scale-95 shadow-sm shadow-purple-500/10"
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
