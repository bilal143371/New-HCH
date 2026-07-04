import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
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
      
      {/* Title Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-gold-primary/10 via-white/[0.01] to-white/[0.01] border border-gold-primary/20 rounded-2xl shadow-deep">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-gold-primary/15 text-gold-primary">
              <Brain className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-[10px] font-bold text-text-gold uppercase tracking-widest font-mono">Mind & Self-Care Hub</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans text-text-headline tracking-tight">
            Talk to Your Mind Coach
          </h2>
          <p className="text-xs text-text-body max-w-xl">
            A supportive companion who listens when you are stressed, worried, or feeling low. Practice reframing thoughts or journal your gratitude.
          </p>
        </div>
        
        {/* Quick status box */}
        <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl shrink-0">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <div className="text-left">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block font-mono">Current Wellbeing</span>
            <span className="text-xs text-text-headline font-bold font-mono">
              {selfCareLogs.length > 0 ? `${selfCareLogs[0].mood} Mood` : 'Warmly Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Sub-navigation Tabs */}
      <div className="flex border-b border-white/[0.08]">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold transition-all border-b-2 relative ${
            activeSubTab === 'chat'
              ? 'border-purple-500 text-purple-300 font-bold'
              : 'border-transparent text-text-muted hover:text-text-headline'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Talk to Your Coach</span>
        </button>
        <button
          onClick={() => setActiveSubTab('notebook')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold transition-all border-b-2 relative ${
            activeSubTab === 'notebook'
              ? 'border-purple-500 text-purple-300 font-bold'
              : 'border-transparent text-text-muted hover:text-text-headline'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Coach's Notebook (What I Remember)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold transition-all border-b-2 relative ${
            activeSubTab === 'logs'
              ? 'border-purple-500 text-purple-300 font-bold'
              : 'border-transparent text-text-muted hover:text-text-headline'
          }`}
        >
          <SmilePlus className="w-4 h-4" />
          <span>+ My Self-Care Logs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('relax')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs font-semibold transition-all border-b-2 relative ${
            activeSubTab === 'relax'
              ? 'border-purple-500 text-purple-300 font-bold'
              : 'border-transparent text-text-muted hover:text-text-headline'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Zen Breathing & Soundscapes</span>
        </button>
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
          <div className="bg-bg-card border border-white/[0.06] rounded-2xl shadow-deep overflow-hidden flex flex-col h-[520px]">
            {/* Chat header */}
            <div className="p-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gold-primary/15 flex items-center justify-center border border-gold-primary/20">
                  <Brain className="w-4.5 h-4.5 text-gold-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-headline">
                    {counselMode === 'CBT Coach' && 'CBT Reframe Specialist'}
                    {counselMode === 'Deep Listen' && 'Empathic Listener'}
                    {counselMode === 'Friend Mode' && 'Wellness Best Friend'}
                  </h4>
                  <span className="text-[9px] font-mono text-gold-primary flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                    Ready to guide you
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleClearChat}
                className="text-text-muted hover:text-red-400 text-xs font-semibold py-1 px-2 hover:bg-white/[0.03] rounded-lg transition"
                title="Clear current conversations"
              >
                Clear History
              </button>
            </div>

            {/* Chat messages stream */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  >
                    <div className={`max-w-[85%] flex items-start space-x-2.5 ${!isBot && 'flex-row-reverse space-x-reverse'}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold ${
                        isBot 
                          ? 'bg-gold-primary/10 border border-gold-primary/20 text-gold-primary' 
                          : 'bg-white/5 border border-white/10 text-text-headline'
                      }`}>
                        {isBot ? 'CO' : 'ME'}
                      </div>

                      {/* Bubble */}
                      <div className={`rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                        isBot 
                          ? 'bg-bg-deep text-text-body rounded-tl-none border border-white/[0.03]' 
                          : 'bg-gold-primary text-bg-deep font-medium rounded-tr-none shadow-md'
                      }`}>
                        <div className="whitespace-pre-line">{msg.content}</div>
                        
                        {/* Timestamp or mode indicator */}
                        <div className={`text-[8px] flex items-center space-x-1.5 ${isBot ? 'text-text-muted' : 'text-bg-deep/70'}`}>
                          <span>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isBot && msg.mode && (
                            <span className="px-1.5 py-0.5 bg-white/5 rounded-full text-[7px] font-mono">
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
                <div className="flex justify-start animate-pulse">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-[10px] text-gold-primary font-bold">
                      CO
                    </div>
                    <div className="bg-bg-deep text-text-muted rounded-2xl rounded-tl-none p-4 text-xs italic border border-white/[0.03] flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[10px]">Coach is reflecting...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-white/[0.01] border-t border-white/[0.04] overflow-x-auto whitespace-nowrap flex space-x-2">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="inline-block py-1.5 px-3 bg-bg-deep hover:bg-gold-primary/10 border border-white/[0.05] hover:border-gold-primary/30 rounded-full text-[10px] text-text-body hover:text-text-gold transition cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 bg-white/[0.01] border-t border-white/[0.06]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 bg-bg-deep border border-white/[0.06] rounded-xl p-2 focus-within:border-gold-primary/50 transition-all"
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
                  placeholder="Ask standard mindful questions, or write 'how to manage stress' / 'give me a breathing exercise'"
                  className="flex-grow bg-transparent outline-none border-none text-xs text-text-headline placeholder-text-muted resize-none px-2 py-1 max-h-16"
                />
                
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-lg transition-all ${
                    inputText.trim() 
                      ? 'bg-gold-primary text-bg-deep cursor-pointer hover:bg-gold-light hover:scale-105 active:scale-95' 
                      : 'bg-white/5 text-text-muted cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Interactive Breathing Bubble */}
          <div className="p-6 bg-bg-card border border-white/[0.06] rounded-2xl shadow-card flex flex-col justify-between items-center space-y-6 text-center">
            <div className="text-left w-full">
              <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-widest font-mono block">Breathing Visualizer</span>
              <h3 className="text-md font-bold text-text-headline mt-0.5">Zen Deep Breathing Bubble</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Choose a custom breathing pattern. Follow the circle size and text prompts to relax.
              </p>
            </div>

            {/* Pattern Selection Dropdown */}
            <div className="w-full text-left">
              <label className="block text-[8px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5">Select Pattern</label>
              <select
                value={breathingPattern}
                disabled={breathingActive}
                onChange={(e) => {
                  const pat = e.target.value as any;
                  setBreathingPattern(pat);
                  setBreathingSeconds(pat === 'calm' ? 5 : 4);
                }}
                className="w-full bg-bg-surface border border-white/[0.06] rounded-xl p-2.5 text-xs text-text-headline font-semibold cursor-pointer outline-none"
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
                className="absolute rounded-full transition-all duration-[1000ms] ease-in-out bg-purple-500/10 border border-purple-500/20"
                style={{
                  width: breathingState === 'inhale' ? '170px' : breathingState === 'hold' ? '170px' : '90px',
                  height: breathingState === 'inhale' ? '170px' : breathingState === 'hold' ? '170px' : '90px',
                  boxShadow: breathingState === 'inhale' || breathingState === 'hold' ? '0 0 30px rgba(124, 58, 237, 0.25)' : 'none'
                }}
              />
              
              {/* Inner solid circle */}
              <div 
                className="rounded-full flex flex-col items-center justify-center text-center transition-all duration-[1000ms] ease-in-out shadow-lg bg-gradient-to-br from-purple-500 to-purple-700"
                style={{
                  width: breathingState === 'inhale' ? '130px' : breathingState === 'hold' ? '130px' : '75px',
                  height: breathingState === 'inhale' ? '130px' : breathingState === 'hold' ? '130px' : '75px',
                }}
              >
                <span className="text-[10px] font-bold font-mono text-bg-deep uppercase tracking-wider block opacity-75">
                  {breathingState === 'idle' && 'READY'}
                  {breathingState === 'inhale' && 'Breathe In'}
                  {breathingState === 'hold' && 'HOLD'}
                  {breathingState === 'exhale' && 'Breathe Out'}
                </span>
                <span className="text-2xl font-extrabold text-bg-deep font-mono tracking-tight pt-0.5">
                  {breathingActive ? `${breathingSeconds}s` : '🧘'}
                </span>
              </div>
            </div>

            {/* Cycles counter */}
            {breathingActive && (
              <span className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                ✓ Completed Cycles: {breathingCycles}
              </span>
            )}

            {/* Controls */}
            <div className="flex space-x-3 w-full">
              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className={`flex-grow py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 active:scale-95 shadow cursor-pointer ${
                  breathingActive
                    ? 'bg-transparent border border-red-500/25 hover:bg-red-500/10 text-red-400'
                    : 'bg-purple-600 hover:bg-purple-500 text-purple-50'
                }`}
              >
                {breathingActive ? 'Stop Session' : 'Start Breathing Exercise'}
              </button>
            </div>
          </div>

          {/* Offline Soundscape Mixer */}
          <div className="p-6 bg-bg-card border border-white/[0.06] rounded-2xl shadow-card flex flex-col justify-between space-y-6">
            <div className="text-left">
              <span className="text-[10px] font-bold text-purple-300/70 uppercase tracking-widest font-mono block">Ambient Soundscapes</span>
              <h3 className="text-md font-bold text-text-headline mt-0.5">Offline Soundscapes Mixer</h3>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Adjust sliders to mix relaxing sounds. Web audio generates noise loops locally.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'rain', label: '🌧️ Gentle Summer Rain', vol: rainVol },
                { id: 'ocean', label: '🌊 Tidal Ocean Waves', vol: oceanVol },
                { id: 'wind', label: '🍃 Forest Tree Wind', vol: windVol },
                { id: 'brown', label: '🎚️ Relaxing Brown Noise', vol: brownVol }
              ].map((sound) => (
                <div key={sound.id} className="space-y-1.5 text-left">
                  <div className="flex justify-between text-[11px] font-semibold text-text-headline">
                    <span>{sound.label}</span>
                    <span className="font-mono text-purple-300">{sound.vol}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sound.vol}
                    onChange={(e) => updateVolume(sound.id, parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-white/[0.04] rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Quick action: singing bowl */}
            <div className="p-3 bg-bg-deep/45 border border-white/[0.04] rounded-xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider block">Tibetan singing bowl</span>
                <span className="text-[11px] text-text-body block mt-0.5">Play clean 432 Hz chime tone</span>
              </div>
              <button
                onClick={playSingingBowl}
                className="py-1.5 px-4 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/20 hover:border-purple-500/35 text-purple-200 text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <span>🔔 Strike Bowl</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
