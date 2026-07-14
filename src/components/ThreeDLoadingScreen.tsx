import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Heart, Activity } from 'lucide-react';

interface ThreeDLoadingScreenProps {
  onComplete: () => void;
  username?: string;
}

const LOADING_STAGES = [
  { text: "Initializing personal health profile projection...", icon: Shield },
  { text: "Calibrating personalized caloric & protein budgets...", icon: Activity },
  { text: "Compiling custom dietary meal plans...", icon: Sparkles },
  { text: "Configuring heart-safe exercise tables...", icon: Heart },
  { text: "Constructing your secure Health Care Hub...", icon: Shield }
];

export default function ThreeDLoadingScreen({ onComplete, username }: ThreeDLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Increment progress up to 100% over 3 seconds
    const duration = 2800; // total duration of loader in ms
    const intervalTime = 40; // update frequency
    const step = 100 / (duration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 150);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Rotate through loading text stages
    const stageDuration = duration / LOADING_STAGES.length;
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stageDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [onComplete]);


  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0D14] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* 3D Keyframe Definitions */}
      <style>{`
        @keyframes orbit-x {
          0% { transform: rotateX(0deg) rotateY(45deg); }
          100% { transform: rotateX(360deg) rotateY(45deg); }
        }
        @keyframes orbit-y {
          0% { transform: rotateX(45deg) rotateY(0deg); }
          100% { transform: rotateX(45deg) rotateY(360deg); }
        }
        @keyframes orbit-z {
          0% { transform: rotateZ(0deg) rotateX(30deg); }
          100% { transform: rotateZ(360deg) rotateX(30deg); }
        }
        .perspective-container {
          perspective: 1000px;
        }
        .three-d-ring {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main 3D Stage */}
      <div className="relative w-80 h-80 flex items-center justify-center perspective-container">
        {/* Ring 1: Outer Gold Ring (X-Axis Rotation) */}
        <div 
          style={{ animation: 'orbit-x 8s linear infinite' }}
          className="absolute w-64 h-64 border-2 border-dashed border-gold-primary/20 rounded-full three-d-ring flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-gold-primary rounded-full absolute -top-2 left-1/2 -translate-x-1/2 shadow-[0_0_15px_#F4A220]" />
        </div>

        {/* Ring 2: Middle Emerald/Cyan Ring (Y-Axis Rotation) */}
        <div 
          style={{ animation: 'orbit-y 6s linear infinite' }}
          className="absolute w-48 h-48 border border-emerald-400/20 rounded-full three-d-ring flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-emerald-400 rounded-full absolute top-1/2 -left-1.5 -translate-y-1/2 shadow-[0_0_12px_#34d399]" />
        </div>

        {/* Ring 3: Inner Pulsing Ring (Z-Axis Rotation) */}
        <div 
          style={{ animation: 'orbit-z 4s linear infinite' }}
          className="absolute w-32 h-32 border-2 border-white/5 rounded-full three-d-ring flex items-center justify-center"
        >
          <div className="w-2.5 h-2.5 bg-white rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#ffffff]" />
        </div>

        {/* Central Core Sphere */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-white border border-gold-primary/30 flex items-center justify-center shadow-[0_0_35px_rgba(244,162,32,0.15)] overflow-hidden">
          {/* Pulsing glow layer */}
          <div className="absolute inset-0 bg-gold-primary/5 animate-pulse" />
          
          <img 
            src="/logo.png" 
            alt="Health Care Hub Logo" 
            style={{ 
              height: '46px', 
              width: '46px', 
              objectFit: 'contain', 
              position: 'relative', 
              zIndex: 10 
            }} 
            className="animate-pulse"
          />
        </div>
      </div>

      {/* Text Info Container */}
      <div className="max-w-md w-full px-6 text-center space-y-6 mt-6 relative z-10">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gold-primary uppercase tracking-widest font-mono block">
            {username ? `Welcome, ${username}` : 'Activating Hub'}
          </span>
          <h3 className="text-md font-extrabold text-text-headline tracking-tight transition-all duration-300">
            HEALTH CARE HUB
          </h3>
          <p className="text-xs text-text-muted font-mono h-8 flex items-center justify-center max-w-sm mx-auto leading-relaxed transition-all duration-200">
            {LOADING_STAGES[stageIndex].text}
          </p>
        </div>

        {/* Linear Loading Tracker */}
        <div className="space-y-2 max-w-xs mx-auto">
          <div className="w-full h-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(244,162,32,0.5)]"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted font-bold">
            <span>SECURE BRIDGE</span>
            <span className="text-text-gold">{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
