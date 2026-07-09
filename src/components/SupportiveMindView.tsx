import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { theme } from '../styles/theme';
import '../styles/design-system.css';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Send, 
  BookOpen, 
  Plus, 
  Trash2, 
  Smile, 
  TrendingUp, 
  Calendar, 
  Info, 
  User, 
  SmilePlus, 
  Activity,
  CheckCircle,
  Clock,
  HelpCircle,
  Wind,
  Volume2,
  VolumeX,
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface SupportiveMindViewProps {
  profile: UserProfile;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: string;
}

interface SelfCareLog {
  id: string;
  date: string;
  mood: string;
  anxietyLevel: number;
  gratitude: string;
  negativeThought?: string;
  reframedThought?: string;
}

interface Memory {
  id: string;
  category: 'Trigger' | 'Strategy' | 'Affirmation' | 'Goal';
  content: string;
  timestamp: string;
}

const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'm1',
    category: 'Strategy',
    content: 'Enjoys walking in Shalimar Gardens / park to cool down when stress levels build.',
    timestamp: 'Just now'
  },
  {
    id: 'm2',
    category: 'Goal',
    content: 'Focusing on sleeping before 11 PM and reducing black-and-white thinking during work pressure.',
    timestamp: 'Just now'
  },
  {
    id: 'm3',
    category: 'Strategy',
    content: 'Practices the 4-7-8 breathing cycle whenever feeling sudden chest tightness or panic.',
    timestamp: 'Just now'
  }
];

const SUGGESTED_PROMPTS = [
  "I am feeling stressed about work today.",
  "How can I challenge my negative thoughts?",
  "I'm feeling down and just want someone to listen.",
  "Can you give me a simple mindfulness exercise?"
];

export default function SupportiveMindView({ profile }: SupportiveMindViewProps) {
  // Navigation inside SupportiveMindView: 'chat', 'notebook', 'logs', 'relax'
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'notebook' | 'logs' | 'relax'>('chat');
  
  // Counselor Mode: 'CBT Coach', 'Deep Listen', 'Friend Mode'
  const [counselMode, setCounselMode] = useState<'CBT Coach' | 'Deep Listen' | 'Friend Mode'>('CBT Coach');

  // Zen Breathing & Soundscapes States
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingState, setBreathingState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [breathingPattern, setBreathingPattern] = useState<'478' | 'box' | 'calm'>('478');
  const [breathingCycles, setBreathingCycles] = useState(0);

  // Audio Context & Nodes
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [rainGainNode, setRainGainNode] = useState<GainNode | null>(null);
  const [oceanGainNode, setOceanGainNode] = useState<GainNode | null>(null);
  const [windGainNode, setWindGainNode] = useState<GainNode | null>(null);
  const [brownGainNode, setBrownGainNode] = useState<GainNode | null>(null);

  const [rainVol, setRainVol] = useState(0);
  const [oceanVol, setOceanVol] = useState(0);
  const [windVol, setWindVol] = useState(0);
  const [brownVol, setBrownVol] = useState(0);

  const playSingingBowl = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(864, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);
      
      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 2.5);
      osc2.stop(ctx.currentTime + 2.5);
    } catch (e) {
      console.warn("Singing bowl play failed:", e);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            setBreathingState((currState) => {
              if (breathingPattern === '478') {
                if (currState === 'idle' || currState === 'exhale') {
                  playSingingBowl();
                  setBreathingSeconds(4);
                  return 'inhale';
                } else if (currState === 'inhale') {
                  playSingingBowl();
                  setBreathingSeconds(7);
                  return 'hold';
                } else {
                  playSingingBowl();
                  setBreathingSeconds(8);
                  setBreathingCycles(c => c + 1);
                  return 'exhale';
                }
              } else if (breathingPattern === 'box') {
                if (currState === 'idle' || currState === 'exhale') {
                  playSingingBowl();
                  setBreathingSeconds(4);
                  return 'inhale';
                } else if (currState === 'inhale') {
                  playSingingBowl();
                  setBreathingSeconds(4);
                  return 'hold';
                } else if (currState === 'hold') {
                  playSingingBowl();
                  setBreathingSeconds(4);
                  return 'exhale';
                } else {
                  playSingingBowl();
                  setBreathingSeconds(4);
                  setBreathingCycles(c => c + 1);
                  return 'hold';
                }
              } else {
                if (currState === 'idle' || currState === 'exhale') {
                  playSingingBowl();
                  setBreathingSeconds(5);
                  return 'inhale';
                } else {
                  playSingingBowl();
                  setBreathingSeconds(5);
                  setBreathingCycles(c => c + 1);
                  return 'exhale';
                }
              }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathingState('idle');
      setBreathingSeconds(4);
      setBreathingCycles(0);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathingPattern]);

  const updateVolume = (type: string, val: number) => {
    let ctx = audioCtx;
    if (!ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioContextClass();
      setAudioCtx(ctx);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const setNodeVolume = (
      gainNode: GainNode | null, 
      setGainNode: React.Dispatch<React.SetStateAction<GainNode | null>>, 
      typeStr: string
    ) => {
      if (!gainNode && ctx) {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        if (typeStr === 'brown') {
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
          }
        } else if (typeStr === 'wind') {
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.04 * white)) / 1.04;
            lastOut = data[i];
            data[i] *= 2.0;
          }
        } else if (typeStr === 'ocean') {
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            const mod = Math.sin((i / bufferSize) * Math.PI * 2);
            data[i] = (lastOut + (0.03 * white)) / 1.03;
            lastOut = data[i];
            data[i] *= (1.5 + mod * 0.8);
          }
        } else {
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const node = ctx.createGain();
        node.gain.setValueAtTime(val / 100, ctx.currentTime);
        source.connect(node);
        node.connect(ctx.destination);
        source.start();
        setGainNode(node);
      } else if (gainNode) {
        gainNode.gain.setValueAtTime(val / 100, ctx.currentTime);
      }
    };

    if (type === 'rain') {
      setRainVol(val);
      setNodeVolume(rainGainNode, setRainGainNode, 'rain');
    } else if (type === 'ocean') {
      setOceanVol(val);
      setNodeVolume(oceanGainNode, setOceanGainNode, 'ocean');
    } else if (type === 'wind') {
      setWindVol(val);
      setNodeVolume(windGainNode, setWindGainNode, 'wind');
    } else if (type === 'brown') {
      setBrownVol(val);
      setNodeVolume(brownGainNode, setBrownGainNode, 'brown');
    }
  };

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notebook memories state
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<'Trigger' | 'Strategy' | 'Affirmation' | 'Goal'>('Strategy');

  // Self Care Log states
  const [selfCareLogs, setSelfCareLogs] = useState<SelfCareLog[]>([]);
  const [logMood, setLogMood] = useState('Peaceful');
  const [logAnxiety, setLogAnxiety] = useState(3);
  const [logGratitude, setLogGratitude] = useState('');
  const [logNegativeThought, setLogNegativeThought] = useState('');
  const [logReframedThought, setLogReframedThought] = useState('');
  const [logSuccessMessage, setLogSuccessMessage] = useState(false);

  // Initialize data from LocalStorage
  useEffect(() => {
    // 1. Chat Messages
    const savedMessages = localStorage.getItem('mind_coach_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        // Fallback to default greeting
        initializeDefaultGreeting();
      }
    } else {
      initializeDefaultGreeting();
    }

    // 2. Notebook memories
    const savedMemories = localStorage.getItem('mind_coach_memories');
    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        setMemories(DEFAULT_MEMORIES);
      }
    } else {
      setMemories(DEFAULT_MEMORIES);
      localStorage.setItem('mind_coach_memories', JSON.stringify(DEFAULT_MEMORIES));
    }

    // 3. Self-care logs
    const savedLogs = localStorage.getItem('self_care_logs');
    if (savedLogs) {
      try {
        setSelfCareLogs(JSON.parse(savedLogs));
      } catch (e) {
        setSelfCareLogs([]);
      }
    }
  }, []);

  // Save chat messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mind_coach_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initializeDefaultGreeting = () => {
    const greeting: Message = {
      id: 'g1',
      role: 'assistant',
      content: `Assalamu alaikum, ${profile?.name || 'Friend'}! I am your dedicated CBT Coach. Let's work together to look at your thoughts, reframe stress, and find practical ways to feel better. What is on your mind?`,
      timestamp: new Date(),
      mode: 'CBT Coach'
    };
    setMessages([greeting]);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear your conversation history?')) {
      localStorage.removeItem('mind_coach_messages');
      initializeDefaultGreeting();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText('');
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      mode: counselMode
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Map to simplified schema expected by backend endpoint
      const payloadMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/supportive-mind-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: payloadMessages,
          mode: counselMode,
          profile
        })
      });

      if (!response.ok) {
        throw new Error('Chat service returned an error');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I am reflecting on what you said. Let's continue working through it.",
        timestamp: new Date(),
        mode: counselMode
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Smart auto-memory generation for high-fidelity experience
      // If user logs something positive or a trigger, extract a summary
      if (text.length > 15) {
        extractAutomaticMemory(text, data.response);
      }

    } catch (err) {
      console.error("Error chatting with supportive mind coach:", err);
      // Fallback message
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I appreciate you sharing that with me, ${profile?.name || 'Friend'}. Remember that challenging automatic negative thoughts is a step-by-step process. Can you find a friendlier way to reframe the main thought that is bothering you?`,
        timestamp: new Date(),
        mode: counselMode
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Smart heuristic extraction of memories
  const extractAutomaticMemory = (userText: string, botText: string) => {
    const lowercaseUser = userText.toLowerCase();
    let newMem: Memory | null = null;

    if (lowercaseUser.includes('scared') || lowercaseMsgIncludesAny(lowercaseUser, ['worry', 'anxious', 'fear', 'trigger'])) {
      newMem = {
        id: 'am_' + Date.now(),
        category: 'Trigger',
        content: `Identified stress trigger: "${userText.substring(0, 75)}${userText.length > 75 ? '...' : ''}"`,
        timestamp: new Date().toLocaleDateString()
      };
    } else if (lowercaseMsgIncludesAny(lowercaseUser, ['practice', 'try', 'breath', 'walk', 'exercise', 'meditate', 'read'])) {
      newMem = {
        id: 'am_' + Date.now(),
        category: 'Strategy',
        content: `Coping Strategy: User is testing: "${userText.substring(0, 75)}${userText.length > 75 ? '...' : ''}"`,
        timestamp: new Date().toLocaleDateString()
      };
    } else if (lowercaseMsgIncludesAny(lowercaseUser, ['goal', 'want', 'hope', 'aim', 'plan'])) {
      newMem = {
        id: 'am_' + Date.now(),
        category: 'Goal',
        content: `Personal aspiration: "${userText.substring(0, 75)}${userText.length > 75 ? '...' : ''}"`,
        timestamp: new Date().toLocaleDateString()
      };
    }

    if (newMem) {
      setMemories(prev => {
        // Prevent duplicate memories
        if (prev.some(m => m.content.toLowerCase().substring(0, 20) === newMem!.content.toLowerCase().substring(0, 20))) {
          return prev;
        }
        const updated = [newMem!, ...prev].slice(0, 10); // Keep max 10
        localStorage.setItem('mind_coach_memories', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const lowercaseMsgIncludesAny = (str: string, terms: string[]) => {
    return terms.some(term => str.includes(term));
  };

  // Add memory manually
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const newMem: Memory = {
      id: Date.now().toString(),
      category: newMemoryCategory,
      content: newMemoryText.trim(),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newMem, ...memories];
    setMemories(updated);
    localStorage.setItem('mind_coach_memories', JSON.stringify(updated));
    setNewMemoryText('');
  };

  const handleDeleteMemory = (id: string) => {
    const filtered = memories.filter(m => m.id !== id);
    setMemories(filtered);
    localStorage.setItem('mind_coach_memories', JSON.stringify(filtered));
  };

  // Add Self-Care Log
  const handleAddSelfCareLog = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: SelfCareLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      mood: logMood,
      anxietyLevel: logAnxiety,
      gratitude: logGratitude.trim() || 'Grateful for another healthy day.',
      negativeThought: logNegativeThought.trim() || undefined,
      reframedThought: logReframedThought.trim() || undefined
    };

    const updated = [newLog, ...selfCareLogs];
    setSelfCareLogs(updated);
    localStorage.setItem('self_care_logs', JSON.stringify(updated));

    // Clear form and show success
    setLogGratitude('');
    setLogNegativeThought('');
    setLogReframedThought('');
    setLogSuccessMessage(true);

    setTimeout(() => {
      setLogSuccessMessage(false);
    }, 4000);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm('Delete this self-care log entry?')) {
      const filtered = selfCareLogs.filter(l => l.id !== id);
      setSelfCareLogs(filtered);
      localStorage.setItem('self_care_logs', JSON.stringify(filtered));
    }
  };

  // Helper colors for category tags
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Trigger': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Strategy': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Affirmation': return 'bg-gold-primary/10 text-text-gold border border-gold-primary/20';
      case 'Goal': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      default: return 'bg-white/5 text-text-muted border border-white/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" id="supportive-mind-view">
      
      {/* HEADER IMAGE BANNER */}
      <div
        className="hero-banner-responsive"
        style={{
          position: 'relative',
          borderRadius: radii.card,
          overflow: 'hidden',
          boxShadow: shadows.card,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: spacing[24],
        }}
      >
        <img
          src="/mental_relaxation.png"
          alt="Calming Mind & Self-Care banner"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors.primary}f2 0%, ${colors.primary}77 70%, transparent 100%)`,
            zIndex: 1,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, color: colors.white, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing[16], width: '100%' }}>
          <div>
            <h2
              className="hch-heading"
              style={{
                fontSize: '2rem',
                fontWeight: 750,
                color: colors.white,
                margin: 0,
              }}
            >
              Supportive Mind & Self-Care
            </h2>
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: fontSizes.sm,
                color: 'rgba(255, 255, 255, 0.9)',
                margin: `${spacing[8]} 0 0`,
                maxWidth: '520px',
                lineHeight: 1.5,
              }}
            >
              A supportive companion who listens when you are stressed, worried, or feeling low. Practice reframing thoughts or journal your gratitude.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: spacing[12], borderRadius: radii.card, border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', gap: spacing[8] }}>
            <Heart size={16} style={{ color: colors.accent, fill: colors.accent }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Current Wellbeing</span>
              <span style={{ fontSize: '0.75rem', color: colors.white, fontWeight: 700 }}>
                {selfCareLogs.length > 0 ? `${selfCareLogs[0].mood} Mood` : 'Warmly Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sub-navigation Tabs (Simplified large grid buttons) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[16] }}>
        {[
          {
            id: 'chat' as const,
            title: 'Talk to Coach',
            description: 'Chat with your AI companion for CBT guidance and listening support.',
            icon: Smile,
          },
          {
            id: 'notebook' as const,
            title: 'Notebook',
            description: 'Review your triggers, coping strategies, and mental goals.',
            icon: BookOpen,
          },
          {
            id: 'logs' as const,
            title: 'Self-Log',
            description: 'Log your mood, anxiety, and gratitude for reflection.',
            icon: SmilePlus,
          },
          {
            id: 'relax' as const,
            title: 'Sounds & Breathing',
            description: 'Breathing exercises and ambient sound mixer.',
            icon: Wind,
          },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                background: colors.white,
                borderRadius: radii.card,
                boxShadow: shadows.card,
                border: isActive ? `2px solid ${colors.primary}` : `1px solid ${colors.success}30`,
                padding: spacing[16],
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[8],
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = colors.primary + '50'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = colors.success + '30'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
                <div style={{
                  background: isActive ? colors.primary : `${colors.primary}10`,
                  color: isActive ? colors.white : colors.primary,
                  width: '32px',
                  height: '32px',
                  borderRadius: radii.button,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TabIcon size={16} />
                </div>
                <span style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text }}>
                  {tab.title}
                </span>
              </div>
              <p style={{ fontFamily: fonts.body, fontSize: '0.6875rem', color: colors.muted, margin: 0, lineHeight: 1.4 }}>
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: TALK TO YOUR COACH (CHAT) */}
      {activeSubTab === 'chat' && (
        <div className="space-y-4">
          
          {/* Chat mode selection panel */}
          <div className="bg-bg-card border border-white/[0.06] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono block mb-1">CHAT COUNSEL MODE</span>
              <p className="text-[11px] text-text-body">Select a therapeutic style that matches your current emotional needs.</p>
            </div>
            
            <div className="flex space-x-1.5 bg-bg-deep p-1 rounded-lg border border-white/[0.04]">
              {(['CBT Coach', 'Deep Listen', 'Friend Mode'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCounselMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition font-sans ${
                    counselMode === mode
                      ? 'bg-gold-primary text-bg-deep shadow-sm font-extrabold'
                      : 'text-text-body hover:text-text-headline'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container Box */}
          <div
            style={{
              background: colors.white,
              border: `1px solid ${colors.success}30`,
              borderRadius: radii.card,
              boxShadow: shadows.card,
              display: 'flex',
              flexDirection: 'column',
              height: '520px',
              overflow: 'hidden',
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: spacing[16],
                borderBottom: `1px solid ${colors.success}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12] }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: radii.full,
                  background: `${colors.primary}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Brain size={18} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>
                    {counselMode === 'CBT Coach' && 'CBT Reframe Specialist'}
                    {counselMode === 'Deep Listen' && 'Empathic Listener'}
                    {counselMode === 'Friend Mode' && 'Wellness Best Friend'}
                  </h4>
                  <span style={{ fontSize: '0.6875rem', fontFamily: fonts.body, color: colors.primary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: radii.full, background: '#2f5233', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                    Ready to guide you
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleClearChat}
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  color: colors.muted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: `4px ${spacing[8]}`,
                  borderRadius: radii.button,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${colors.primary}10`}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                Clear History
              </button>
            </div>

            {/* Chat messages stream */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: spacing[24], display: 'flex', flexDirection: 'column', gap: spacing[16] }} className="scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isBot ? 'flex-start' : 'flex-end',
                      width: '100%',
                    }}
                  >
                    <div style={{ maxWidth: '75%', display: 'flex', alignItems: 'flex-start', gap: spacing[12], flexDirection: isBot ? 'row' : 'row-reverse' }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: radii.full,
                          background: isBot ? `${colors.primary}15` : `${colors.accent}15`,
                          border: `1px solid ${isBot ? colors.primary : colors.accent}30`,
                          color: isBot ? colors.primary : colors.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {isBot ? 'CO' : 'ME'}
                      </div>

                      {/* Bubble */}
                      <div
                        style={{
                          borderRadius: radii.card,
                          padding: `${spacing[12]} ${spacing[16]}`,
                          fontSize: '0.75rem',
                          fontFamily: fonts.body,
                          lineHeight: 1.5,
                          background: isBot ? '#FAF7F2' : colors.primary,
                          color: isBot ? colors.text : colors.white,
                          border: `1px solid ${isBot ? `${colors.success}60` : 'transparent'}`,
                          boxShadow: shadows.card,
                          borderTopLeftRadius: isBot ? 0 : radii.card,
                          borderTopRightRadius: isBot ? radii.card : 0,
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                        
                        {/* Timestamp or mode indicator */}
                        <div style={{ fontSize: '0.625rem', marginTop: spacing[4], display: 'flex', alignItems: 'center', gap: spacing[8], opacity: 0.7 }}>
                          <span>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isBot && msg.mode && (
                            <span style={{ fontSize: '0.5625rem', background: `${colors.success}30`, color: colors.primary, padding: '1px 6px', borderRadius: radii.full, fontWeight: 700 }}>
                              {msg.mode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: radii.full,
                      background: `${colors.primary}15`,
                      border: `1px solid ${colors.primary}30`,
                      color: colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                    }}>
                      CO
                    </div>
                    <div style={{
                      borderRadius: radii.card,
                      padding: `${spacing[12]} ${spacing[16]}`,
                      background: '#FAF7F2',
                      color: colors.muted,
                      border: `1px solid ${colors.success}60`,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[8],
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.primary, display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.primary, display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }}></span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.primary, display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }}></span>
                      <span style={{ fontSize: '0.6875rem' }}>Coach is reflecting...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested quick Prompts */}
            {messages.length <= 2 && (
              <div style={{ padding: `${spacing[8]} ${spacing[16]}`, borderTop: `1px solid ${colors.success}30`, display: 'flex', gap: spacing[8], overflowX: 'auto' }} className="no-scrollbar">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    style={{
                      padding: '4px 12px',
                      background: '#FAF7F2',
                      border: `1px solid ${colors.success}50`,
                      color: colors.primary,
                      borderRadius: radii.full,
                      fontSize: '0.6875rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.primary;
                      e.currentTarget.style.color = colors.white;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FAF7F2';
                      e.currentTarget.style.color = colors.primary;
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <div style={{ padding: spacing[16], borderTop: `1px solid ${colors.success}30` }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[8],
                  background: '#FAF7F2',
                  border: `1px solid ${colors.success}50`,
                  borderRadius: radii.card,
                  padding: spacing[8],
                }}
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask CBT questions, or share what's on your mind..."
                  style={{
                    flexGrow: 1,
                    background: 'transparent',
                    outline: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontFamily: fonts.body,
                    color: colors.text,
                    resize: 'none',
                    padding: `4px ${spacing[8]}`,
                    maxHeight: '64px',
                  }}
                />
                
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{
                    padding: '8px 16px',
                    borderRadius: radii.button,
                    background: inputText.trim() ? colors.primary : `${colors.primary}30`,
                    color: colors.white,
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    border: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Send size={12} />
                </button>
              </form>
              <div className="text-[9px] text-text-muted font-mono mt-1 px-1 flex items-center">
                <Info className="w-3 h-3 mr-1 shrink-0" />
                Tip: Type anything and hit Enter. The CBT Coach auto-memorizes strategies or triggers mentioned!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: COACH'S NOTEBOOK */}
      {activeSubTab === 'notebook' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-bg-card border border-white/[0.06] p-5 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <BookOpen className="w-5 h-5 text-gold-primary" />
              <div>
                <h3 className="text-sm font-bold text-text-headline">Your Dedicated Memory Vault</h3>
                <p className="text-[11px] text-text-body">Here is what the Mind Coach remembers about your triggers, goals, and coping strategies to personalize future sessions.</p>
              </div>
            </div>

            {/* Quick explanation alert */}
            <div className="p-3 bg-gold-primary/5 border border-gold-primary/10 rounded-xl flex items-start space-x-2.5 text-[11px] leading-relaxed text-text-gold">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Smart Auto-Notes:</strong> When chatting in Counselor Mode, the Mind Coach automatically highlights and registers significant strategies, goals, or triggers to keep this board updated. You can also add or remove entries manually below.
              </span>
            </div>

            {/* Add manual note form */}
            <form onSubmit={handleAddMemory} className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-3 text-left">
              <h4 className="text-[11px] font-bold text-text-headline uppercase tracking-wider font-mono">Record a Mental Note</h4>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/4">
                  <label className="block text-[10px] text-text-muted font-mono mb-1 uppercase">Category</label>
                  <select
                    value={newMemoryCategory}
                    onChange={(e: any) => setNewMemoryCategory(e.target.value)}
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none text-xs text-text-headline p-2.5 rounded-lg"
                  >
                    <option value="Strategy">Strategy</option>
                    <option value="Trigger">Trigger</option>
                    <option value="Goal">Goal</option>
                    <option value="Affirmation">Affirmation</option>
                  </select>
                </div>
                
                <div className="flex-grow">
                  <label className="block text-[10px] text-text-muted font-mono mb-1 uppercase">Insight or Technique</label>
                  <input
                    type="text"
                    required
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="e.g. Walking for 10 minutes helps diffuse negative thought spirals."
                    className="w-full bg-bg-card border border-white/[0.08] focus:border-gold-primary outline-none text-xs text-text-headline p-2.5 rounded-lg placeholder-text-muted"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-primary hover:bg-gold-light text-bg-deep text-xs font-bold rounded-lg transition shadow flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin to Notebook</span>
                </button>
              </div>
            </form>

            {/* Memories list */}
            <div className="space-y-3 pt-2 text-left">
              <h4 className="text-[11px] font-bold text-text-headline uppercase tracking-wider font-mono">Pinned Insights ({memories.length})</h4>
              
              {memories.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted border border-dashed border-white/[0.06] rounded-xl">
                  Your Notebook is empty. Pin a note above or start chatting with the Coach to auto-generate memories!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-3 bg-bg-deep border border-white/[0.04] rounded-xl flex items-start justify-between gap-3 group hover:border-gold-primary/20 transition"
                    >
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${getCategoryBadgeClass(mem.category)}`}>
                            {mem.category}
                          </span>
                          <span className="text-[9px] text-text-muted font-mono">{mem.timestamp}</span>
                        </div>
                        <p className="text-xs text-text-body font-sans leading-relaxed">
                          {mem.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="text-text-muted hover:text-red-400 p-1 rounded hover:bg-white/5 opacity-40 group-hover:opacity-100 transition shrink-0"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: SELF CARE LOGS */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid md:grid-cols-5 gap-6 text-left">
            {/* Form Column - 2/5 */}
            <div className="md:col-span-2 bg-bg-card border border-white/[0.06] p-5 rounded-2xl space-y-4 self-start">
              <div className="flex items-center space-x-2">
                <SmilePlus className="w-5 h-5 text-gold-primary" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-headline">Record Self-Care</h3>
              </div>
              <p className="text-[11px] text-text-body leading-relaxed">
                Log your daily mood, track anxiety, and write a simple gratitude statement. Journaling stabilizes emotions.
              </p>

              {logSuccessMessage && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-400 flex items-center space-x-2 animate-bounce">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Self-care log registered successfully!</span>
                </div>
              )}

              <form onSubmit={handleAddSelfCareLog} className="space-y-4">
                {/* Mood picker */}
                <div>
                  <label className="block text-[10px] text-text-muted font-mono uppercase mb-2">How do you feel today?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Peaceful', 'Calm', 'Energetic', 'Stressed', 'Low', 'Worried'].map((m) => {
                      const isActive = logMood === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setLogMood(m)}
                          className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition ${
                            isActive
                              ? 'bg-gold-primary border-gold-primary text-bg-deep font-extrabold'
                              : 'bg-white/[0.02] border-white/[0.06] text-text-body hover:bg-white/[0.05]'
                          }`}
                        >
                          <span className="block text-sm mb-0.5">
                            {m === 'Peaceful' && '😇'}
                            {m === 'Calm' && '🧘'}
                            {m === 'Energetic' && '⚡'}
                            {m === 'Stressed' && '🤯'}
                            {m === 'Low' && '😔'}
                            {m === 'Worried' && '😰'}
                          </span>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Anxiety Level scale */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-text-muted font-mono uppercase">Anxiety Level (0-10)</label>
                    <span className="text-xs font-bold text-text-gold font-mono bg-gold-primary/10 px-2 py-0.5 rounded-full border border-gold-primary/20">
                      {logAnxiety} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={logAnxiety}
                    onChange={(e) => setLogAnxiety(parseInt(e.target.value))}
                    className="w-full accent-gold-primary cursor-pointer h-1 bg-white/[0.08] rounded-lg outline-none"
                  />
                  <div className="flex justify-between text-[8px] text-text-muted font-mono mt-1">
                    <span>0 (Peaceful)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>

                {/* Gratitude statement */}
                <div>
                  <label className="block text-[10px] text-text-muted font-mono uppercase mb-1.5">What are you grateful for today?</label>
                  <input
                    type="text"
                    value={logGratitude}
                    onChange={(e) => setLogGratitude(e.target.value)}
                    placeholder="e.g. My family, clean water, or a quiet tea break."
                    className="w-full bg-bg-deep border border-white/[0.08] focus:border-gold-primary outline-none text-xs text-text-headline p-2.5 rounded-lg placeholder-text-muted"
                  />
                </div>

                {/* Optional CBT Reframing thought */}
                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-3">
                  <span className="text-[9px] font-bold text-text-gold uppercase tracking-wider font-mono flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" /> OPTIONAL CBT REFRAMING
                  </span>
                  
                  <div>
                    <label className="block text-[9px] text-text-muted font-mono mb-1">Automatic Negative Thought</label>
                    <textarea
                      value={logNegativeThought}
                      onChange={(e) => setLogNegativeThought(e.target.value)}
                      placeholder="e.g. 'I will fail my exam because I got one question wrong.'"
                      rows={1}
                      className="w-full bg-bg-deep border border-white/[0.08] focus:border-gold-primary outline-none text-xs text-text-headline p-2 rounded-lg placeholder-text-muted"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-text-muted font-mono mb-1">Balanced Alternative thought</label>
                    <textarea
                      value={logReframedThought}
                      onChange={(e) => setLogReframedThought(e.target.value)}
                      placeholder="e.g. 'Getting one question wrong is normal. I can study and do fine.'"
                      rows={1}
                      className="w-full bg-bg-deep border border-white/[0.08] focus:border-gold-primary outline-none text-xs text-text-headline p-2 rounded-lg placeholder-text-muted"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold-primary hover:bg-gold-light text-bg-deep text-xs font-bold rounded-lg transition shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Self-Care Log</span>
                </button>
              </form>
            </div>

            {/* History Column - 3/5 */}
            <div className="md:col-span-3 bg-bg-card border border-white/[0.06] p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-gold-primary" />
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-headline">Logs & Trends</h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  {selfCareLogs.length} Entries
                </span>
              </div>

              {/* Minimalist Mood History Bar Chart */}
              {selfCareLogs.length > 0 && (
                <div className="p-4 bg-bg-deep border border-white/[0.04] rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-text-headline uppercase tracking-wider font-mono block">Anxiety Level Tracking</span>
                  
                  <div className="flex items-end justify-between h-20 gap-1.5 pt-4 px-2">
                    {selfCareLogs.slice(0, 7).reverse().map((log) => {
                      const pct = Math.max(8, (log.anxietyLevel / 10) * 100);
                      const isHigh = log.anxietyLevel >= 6;
                      return (
                        <div key={log.id} className="flex-grow flex flex-col items-center group">
                          {/* Tooltip */}
                          <div className="absolute bg-bg-card border border-white/10 px-2 py-1 rounded text-[8px] text-text-headline font-mono mb-24 opacity-0 group-hover:opacity-100 transition shadow pointer-events-none z-10">
                            Anxiety: {log.anxietyLevel}/10
                          </div>
                          
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              isHigh ? 'bg-red-500/60 group-hover:bg-red-400' : 'bg-gold-primary/60 group-hover:bg-gold-light'
                            }`}
                            style={{ height: `${pct}%` }}
                          ></div>
                          
                          {/* Label */}
                          <span className="text-[7px] text-text-muted font-mono mt-1.5 truncate max-w-[40px]">
                            {log.date.substring(4, 10)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past logs list */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-text-headline uppercase tracking-wider font-mono text-left">Previous Logs</h4>
                
                {selfCareLogs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-text-muted border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center space-y-2">
                    <Calendar className="w-8 h-8 text-white/[0.08]" />
                    <span>No self-care entries logged yet. Record your first log on the left!</span>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {selfCareLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 bg-bg-deep border border-white/[0.04] rounded-xl flex items-start justify-between gap-3 hover:border-white/[0.08] transition"
                      >
                        <div className="space-y-2 text-left flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-text-headline">
                              {log.date}
                            </span>
                            <span className="px-2 py-0.5 bg-gold-primary/10 text-text-gold rounded-full text-[8px] font-bold font-mono">
                              {log.mood}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold font-mono ${
                              log.anxietyLevel >= 6 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              Anxiety: {log.anxietyLevel}/10
                            </span>
                          </div>

                          <div className="text-xs text-text-body italic bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                            <span className="text-[8px] font-bold uppercase font-mono text-text-muted block not-italic mb-1">Gratitude Note</span>
                            "{log.gratitude}"
                          </div>

                          {log.negativeThought && log.reframedThought && (
                            <div className="grid sm:grid-cols-2 gap-2 p-2.5 bg-gold-primary/[0.02] border border-gold-primary/10 rounded">
                              <div>
                                <span className="text-[8px] font-mono font-bold text-red-400 uppercase block mb-0.5">Automatic Thought</span>
                                <p className="text-[10px] text-text-body italic">"{log.negativeThought}"</p>
                              </div>
                              <div className="border-t sm:border-t-0 sm:border-l border-white/[0.04] pt-1.5 sm:pt-0 sm:pl-2.5">
                                <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase block mb-0.5">CBT Alternative Reframe</span>
                                <p className="text-[10px] text-text-headline italic">"{log.reframedThought}"</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-text-muted hover:text-red-400 p-1 rounded hover:bg-white/5 transition shrink-0 mt-0.5"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: ZEN BREATHING & SOUNDSCAPES */}
      {activeSubTab === 'relax' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in text-left">
          
          {/* Interactive Breathing Bubble (Live Stress Pacer) */}
          <div
            style={{
              background: colors.white,
              border: `1px solid ${colors.success}30`,
              borderRadius: radii.card,
              boxShadow: shadows.card,
              padding: spacing[24],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: spacing[24],
            }}
          >
            <div style={{ alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Breathing Visualizer</span>
              <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0 }}>Live Stress Pacer</h3>
              <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, margin: 0, lineHeight: 1.4 }}>
                Choose a custom breathing pattern. Follow the circle size and text prompts to relax.
              </p>
            </div>

            {/* Pattern Selection Dropdown */}
            <div style={{ width: '100%' }}>
              <label style={{ fontSize: '0.625rem', fontFamily: fonts.body, fontWeight: 700, color: colors.text, textTransform: 'uppercase', display: 'block', marginBottom: spacing[8] }}>Select Pattern</label>
              <select
                value={breathingPattern}
                disabled={breathingActive}
                onChange={(e) => {
                  const pat = e.target.value as any;
                  setBreathingPattern(pat);
                  setBreathingSeconds(pat === 'calm' ? 5 : 4);
                }}
                style={{
                  width: '100%',
                  background: '#FAF7F2',
                  border: `1px solid ${colors.success}50`,
                  borderRadius: radii.button,
                  padding: spacing[12],
                  fontSize: '0.75rem',
                  fontFamily: fonts.body,
                  color: colors.text,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="478">🧘 4-7-8 Breathing (Deep De-Stress)</option>
                <option value="box">📦 Box Breathing (Tactical Focus)</option>
                <option value="calm">🌊 Calm Breathing (Heart Rate Cohort)</option>
              </select>
            </div>

            {/* Animated SVG Breathing Circle */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer pulsing glow circle */}
              <div 
                className="absolute rounded-full transition-all duration-[1000ms] ease-in-out"
                style={{
                  background: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}20`,
                  width: breathingState === 'inhale' ? '170px' : breathingState === 'hold' ? '170px' : '90px',
                  height: breathingState === 'inhale' ? '170px' : breathingState === 'hold' ? '170px' : '90px',
                  boxShadow: breathingState === 'inhale' || breathingState === 'hold' ? `0 0 30px ${colors.primary}40` : 'none'
                }}
              />
              
              {/* Inner solid circle */}
              <div 
                className="rounded-full flex flex-col items-center justify-center text-center transition-all duration-[1000ms] ease-in-out shadow-lg"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.text})`,
                  width: breathingState === 'inhale' ? '130px' : breathingState === 'hold' ? '130px' : '75px',
                  height: breathingState === 'inhale' ? '130px' : breathingState === 'hold' ? '130px' : '75px',
                }}
              >
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.white, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.04em' }}>
                  {breathingState === 'idle' && 'READY'}
                  {breathingState === 'inhale' && 'Breathe In'}
                  {breathingState === 'hold' && 'HOLD'}
                  {breathingState === 'exhale' && 'Breathe Out'}
                </span>
                <span style={{ fontSize: fontSizes.lg, fontWeight: 800, color: colors.white, marginTop: spacing[4] }}>
                  {breathingActive ? `${breathingSeconds}s` : '🧘'}
                </span>
              </div>
            </div>

            {/* Cycles counter */}
            {breathingActive && (
              <span style={{ fontSize: '0.75rem', fontFamily: fonts.body, color: colors.primary, fontWeight: 700 }}>
                ✓ Completed Cycles: {breathingCycles}
              </span>
            )}

            {/* Controls */}
            <div style={{ width: '100%' }}>
              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className={breathingActive ? "hch-btn hch-btn--outline" : "hch-btn hch-btn--primary"}
                style={{
                  width: '100%',
                  fontSize: fontSizes.xs,
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {breathingActive ? 'Stop Session' : 'Start Breathing Exercise'}
              </button>
            </div>
          </div>

          {/* Offline Soundscape Mixer */}
          <div
            style={{
              background: colors.white,
              border: `1px solid ${colors.success}30`,
              borderRadius: radii.card,
              boxShadow: shadows.card,
              padding: spacing[24],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: spacing[24],
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: colors.accent, uppercase: true, tracking: '0.04em', fontFamily: fonts.body }}>Ambient Soundscapes</span>
              <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0 }}>Offline Soundscapes Mixer</h3>
              <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, margin: 0, lineHeight: 1.4 }}>
                Adjust sliders to mix relaxing sounds. Web audio generates noise loops locally.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
              {[
                { id: 'rain', label: 'Gentle Summer Rain', vol: rainVol },
                { id: 'ocean', label: 'Tidal Ocean Waves', vol: oceanVol },
                { id: 'wind', label: 'Forest Tree Wind', vol: windVol },
                { id: 'brown', label: 'Relaxing Brown Noise', vol: brownVol }
              ].map((sound) => (
                <div key={sound.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: colors.text }}>
                    <span>{sound.label}</span>
                    <span style={{ fontFamily: fonts.body, color: colors.primary, fontWeight: 700 }}>{sound.vol}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sound.vol}
                    onChange={(e) => updateVolume(sound.id, parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                    style={{ accentColor: colors.primary }}
                  />
                </div>
              ))}
            </div>

            {/* Quick action: singing bowl */}
            <div
              style={{
                padding: spacing[12],
                background: '#FAF7F2',
                border: `1px solid ${colors.success}50`,
                borderRadius: radii.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.625rem', fontFamily: fonts.body, color: colors.primary, fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Tibetan singing bowl</span>
                <span style={{ fontSize: '0.6875rem', color: colors.muted, display: 'block', marginTop: '2px' }}>Play clean 432 Hz chime tone</span>
              </div>
              <button
                onClick={playSingingBowl}
                className="hch-btn hch-btn--outline"
                style={{
                  padding: '12px 20px',
                  fontSize: fontSizes.xs,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Strike Bowl</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
