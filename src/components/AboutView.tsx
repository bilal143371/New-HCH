import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, Phone, Mail, MapPin, Award, Heart, BookOpen, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { theme } from '../styles/theme';
import '../styles/design-system.css';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

interface TeamMember {
  name: string;
  role: string;
  tag: string;
  tagColor: string;
  avatar: string;
  description: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Zainab Irfan",
    role: "Frontend Structure (HTML)",
    tag: "Structure & DOM",
    tagColor: "#5B8DBE", // Soft tracking-blue
    avatar: "/team_zainab.png",
    description: "Zainab shaped the entire semantic structure of every page you're navigating right now."
  },
  {
    name: "Aqsa Haider",
    role: "CSS Styling & Responsive Design",
    tag: "Styling & Responsive",
    tagColor: "#F2865E", // Warm coral accent
    avatar: "/team_aqsa.png",
    description: "Aqsa crafted our beautiful styles, custom themes, and flawless responsive layouts."
  },
  {
    name: "Laiba Khan",
    role: "AI Validation System Integration",
    tag: "AI & Logic",
    tagColor: "#2F5233", // Deep primary green
    avatar: "/team_laiba.png",
    description: "Laiba integrated our smart AI verification rules and client validation paths."
  },
  {
    name: "Ujala Ashraf",
    role: "Documentation & Report Writing",
    tag: "Documentation",
    tagColor: "#e6a23c", // Warm amber
    avatar: "/team_ujala.png",
    description: "Ujala structured all documentation, user guides, and compliance reports."
  }
];

export default function AboutView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Touch Swiping states
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Auto-advance logic
  useEffect(() => {
    if (!isHovered) {
      autoPlayTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
      }, 5000);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const diff = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;
    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }
    touchStart.current = null;
    touchEnd.current = null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[24], textAlign: 'left' }} id="about-view">
      
      {/* Calm Cover Photo Header Banner */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          borderRadius: radii.card,
          backgroundImage: 'url("/hero_mockup.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          boxShadow: shadows.card,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: spacing[24],
        }}
      >
        {/* Deep Green brand overlay gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${colors.primary}e0, ${colors.primary}50)`,
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: radii.button,
              background: colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxShadow: shadows.card,
            }}>
              <img 
                src="/logo.png" 
                alt="Health Care Hub Logo" 
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.accent, textTransform: 'uppercase', fontFamily: fonts.body }}>
              Regional Wellness Pilot
            </span>
          </div>
          
          <h1 style={{ fontFamily: fonts.heading, fontSize: '1.75rem', fontWeight: 800, color: colors.white, margin: `${spacing[8]} 0 0` }}>
            About Health Care Hub
          </h1>
          <p style={{ fontFamily: fonts.body, fontSize: '0.8125rem', color: '#FAF7F2df', margin: `${spacing[4]} 0 0`, maxWidth: '520px' }}>
            Learn more about our mission, our development team, and professional healthcare helpline.
          </p>
        </div>
      </div>

      {/* Mission Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[12], borderBottom: `1px solid ${colors.success}30`, paddingBottom: spacing[12] }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: radii.button,
            background: `${colors.primary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary,
          }}>
            <Shield size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: fonts.heading, fontSize: fontSizes.lg, fontWeight: 700, color: colors.text, margin: 0 }}>
              Our Core Philosophy
            </h2>
            <span style={{ fontSize: '0.5625rem', fontFamily: fonts.body, color: colors.muted, textTransform: 'uppercase', fontWeight: 700 }}>
              Simple Health Literacy for Pakistan
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
          <p style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, margin: 0, lineHeight: 1.6 }}>
            <strong>Pakistan HealthCare Hub (HCH)</strong> is dedicated to providing clinical-grade, accessible, and simple digital wellness tools. Our platform is specifically customized to support traditional Pakistani lifestyles, regional dietary recipes, chronic physical safety restrictions (such as knee-joint and spine pacing), and stress-relief breathing routines.
          </p>
          <p style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, color: colors.primary, margin: 0, fontStyle: 'italic', borderLeft: `3px solid ${colors.accent}`, paddingLeft: spacing[12], lineHeight: 1.5 }}>
            "Our ultimate goal is to bring health literacy and portion awareness to the everyday citizen (Aam Insaan), making healthy living straightforward, safe, and 100% free."
          </p>
        </div>
      </div>

      {/* 3D Rotating Team Showcase Card */}
      <div
        style={{
          background: colors.white,
          borderRadius: radii.card,
          border: `1px solid ${colors.success}30`,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[24],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8], borderBottom: `1px solid ${colors.success}30`, paddingBottom: spacing[12] }}>
          <Award size={18} style={{ color: colors.primary }} />
          <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Meet Our Project Development Team
          </h3>
        </div>

        {/* Part 1: Team Lead Spotlight */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: spacing[12], background: '#FAF7F2', borderRadius: radii.card, padding: spacing[20], border: `1.5px solid ${colors.success}45` }}>
          <div style={{ width: '90px', height: '90px', borderRadius: radii.full, overflow: 'hidden', border: `3px solid ${colors.primary}`, boxShadow: shadows.card }}>
            <img src="/team_jamal_shakoor.png" alt="Jamal Shakoor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.625rem', fontFamily: fonts.body, fontWeight: 700, color: colors.accent, textTransform: 'uppercase', background: `${colors.accent}12`, padding: '2px 8px', borderRadius: radii.button }}>Team Lead Spotlight</span>
            <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.base, fontWeight: 800, color: colors.text, margin: `${spacing[8]} 0 0` }}>Muhammad Jamal Shakoor</h4>
            <span style={{ fontSize: fontSizes.xs, fontFamily: fonts.body, fontWeight: 600, color: colors.primary }}>Team Lead — Backend & Database Development</span>
            <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, lineHeight: 1.6, marginTop: spacing[8], maxWidth: '440px', margin: `${spacing[8]} auto 0` }}>
              Jamal architected our full database model, backend integration loops, and coordinate systems that power Health Care Hub.
            </p>
          </div>
        </div>

        {/* Part 2: Team Members 3D Carousel */}
        <div 
          style={{ position: 'relative', minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: `${spacing[16]} 0` }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient blob decorations in the background for visual depth */}
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: '100px', height: '100px', background: `${colors.accent}10`, filter: 'blur(30px)', borderRadius: radii.full, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '120px', height: '120px', background: `${colors.primary}08`, filter: 'blur(40px)', borderRadius: radii.full, pointerEvents: 'none' }} />

          {/* Perspective Container */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px', height: '240px', perspective: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {TEAM_MEMBERS.map((member, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
              const isNext = index === (activeIndex + 1) % TEAM_MEMBERS.length;
              
              // 3D positioning styles
              let transform = 'translateZ(-150px) rotateY(0deg)';
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';
              let blur = 'blur(4px)';
              let zIndex = 0;

              if (isActive) {
                transform = 'translateZ(0px) rotateY(0deg)';
                opacity = 1;
                pointerEvents = 'auto';
                blur = 'none';
                zIndex = 10;
              } else if (isPrev) {
                transform = 'translateX(-120px) translateZ(-100px) rotateY(35deg)';
                opacity = 0.45;
                zIndex = 5;
              } else if (isNext) {
                transform = 'translateX(120px) translateZ(-100px) rotateY(-35deg)';
                opacity = 0.45;
                zIndex = 5;
              }

              return (
                <div
                  key={member.name}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    maxWidth: '280px',
                    background: colors.white,
                    borderRadius: radii.card,
                    padding: spacing[16],
                    boxShadow: shadows.card,
                    border: `1.5px solid ${isActive ? member.tagColor : `${colors.success}30`}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: spacing[8],
                    transform,
                    opacity,
                    zIndex,
                    pointerEvents,
                    filter: blur,
                    transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.65s, filter 0.65s',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: radii.full, overflow: 'hidden', border: `2px solid ${member.tagColor}`, marginBottom: spacing[4] }}>
                    <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>
                    {member.name}
                  </h4>

                  <span style={{ fontSize: '0.6875rem', fontFamily: fonts.body, fontWeight: 600, color: member.tagColor }}>
                    {member.role}
                  </span>

                  <p style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.muted, lineHeight: 1.5, margin: 0 }}>
                    {member.description}
                  </p>

                  <span style={{ fontSize: '0.5625rem', fontFamily: fonts.body, fontWeight: 700, color: colors.white, background: member.tagColor, padding: '2px 8px', borderRadius: radii.button, marginTop: spacing[4] }}>
                    {member.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], marginTop: spacing[16], zIndex: 12 }}>
            <button
              onClick={handlePrev}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radii.full,
                border: `1.5px solid ${colors.success}50`,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.primary,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.primary}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.white; }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: spacing[8] }}>
              {TEAM_MEMBERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: activeIndex === i ? '16px' : '6px',
                    height: '6px',
                    borderRadius: radii.full,
                    border: 'none',
                    background: activeIndex === i ? colors.primary : `${colors.primary}30`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radii.full,
                border: `1.5px solid ${colors.success}50`,
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.primary,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.primary}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.white; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Support Helpline Card */}
      <div
        style={{
          background: colors.white,
          borderRadius: radii.card,
          border: `1px solid ${colors.success}30`,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[20],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8], borderBottom: `1px solid ${colors.success}30`, paddingBottom: spacing[12] }}>
          <Sparkles size={18} style={{ color: colors.primary }} />
          <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Support & Submission Details
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing[20] }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: radii.button,
              background: `${colors.primary}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
              flexShrink: 0,
            }}>
              <Phone size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.5625rem', fontFamily: fonts.body, color: colors.muted, textTransform: 'uppercase', fontWeight: 700 }}>Official Submission Helpline</span>
              <strong style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, display: 'block', marginTop: '2px' }}>+92 309 4530756</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: radii.button,
              background: `${colors.primary}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
              flexShrink: 0,
            }}>
              <Mail size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.5625rem', fontFamily: fonts.body, color: colors.muted, textTransform: 'uppercase', fontWeight: 700 }}>Email Contact</span>
              <strong style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, display: 'block', marginTop: '2px' }}>support@healthcarehub.org</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: radii.button,
              background: `${colors.primary}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
              flexShrink: 0,
            }}>
              <MapPin size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.5625rem', fontFamily: fonts.body, color: colors.muted, textTransform: 'uppercase', fontWeight: 700 }}>regional pilot scope</span>
              <strong style={{ fontFamily: fonts.body, fontSize: fontSizes.sm, color: colors.text, display: 'block', marginTop: '2px' }}>Karachi & Lahore, Pakistan</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: References & Acknowledgements section */}
      <div
        style={{
          background: colors.white,
          borderRadius: radii.card,
          border: `1px solid ${colors.success}30`,
          boxShadow: shadows.card,
          padding: spacing[24],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[20],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8], borderBottom: `1px solid ${colors.success}30`, paddingBottom: spacing[12] }}>
          <BookOpen size={18} style={{ color: colors.primary }} />
          <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            References & Acknowledgements
          </h3>
        </div>

        <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, margin: 0 }}>
          This project was built using the following tools, resources, and references:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
          
          {/* Frameworks */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{ width: '28px', height: '28px', borderRadius: radii.button, background: `${colors.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
              🚀
            </div>
            <div>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Frameworks & Libraries</h4>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, marginTop: '2px', lineHeight: 1.4 }}>
                Powered by React 19, Vite, Express, TailwindCSS, Motion, and Lucide React.
              </p>
            </div>
          </div>

          {/* Design Inspiration */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{ width: '28px', height: '28px', borderRadius: radii.button, background: `${colors.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
              🎨
            </div>
            <div>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Design Inspiration</h4>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, marginTop: '2px', lineHeight: 1.4 }}>
                Inspired by the visual simplicity and tracking systems of Noom, MyFitnessPal, and Headspace (used for educational/inspiration purposes only).
              </p>
            </div>
          </div>

          {/* Data Sources */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{ width: '28px', height: '28px', borderRadius: radii.button, background: `${colors.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
              📊
            </div>
            <div>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Data & Content Sources</h4>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, marginTop: '2px', lineHeight: 1.4 }}>
                Nutritional values mapped from standard regional databases, optimized for traditional Pakistani food recipes.
              </p>
            </div>
          </div>

          {/* Academic Supervision */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12] }}>
            <div style={{ width: '28px', height: '28px', borderRadius: radii.button, background: `${colors.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, flexShrink: 0 }}>
              <GraduationCap size={16} />
            </div>
            <div>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>Academic Supervision & Institution</h4>
              <p style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, marginTop: '2px', lineHeight: 1.4 }}>
                Riphah International University Township Campus
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
