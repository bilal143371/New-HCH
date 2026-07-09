import React from 'react';
import { Shield, Sparkles, Phone, Mail, MapPin, Award, Heart } from 'lucide-react';
import { theme } from '../styles/theme';
import '../styles/design-system.css';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

export default function AboutView() {
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
              width: '28px',
              height: '28px',
              borderRadius: radii.button,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              <Shield size={14} style={{ color: colors.white }} />
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

      {/* Development Team Card */}
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
          <Award size={18} style={{ color: colors.primary }} />
          <h3 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Project Development Team
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[16] }}>
          {[
            { num: 1, name: "Muhammad Jamal", role: "Project Lead & Integration" },
            { num: 2, name: "Zainab Irfan", role: "UI/UX Design & Architecture" },
            { num: 3, name: "Laiba Khan", role: "Clinical Data Refiner" },
            { num: 4, name: "Aqsa Haider", role: "Frontend Developer" },
            { num: 5, name: "Ujala Ashraf", role: "Quality Assurance & Compliance" }
          ].map((dev) => (
            <div
              key={dev.num}
              style={{
                padding: spacing[16],
                borderRadius: radii.card,
                background: '#FAF7F2',
                border: `1px solid ${colors.success}20`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: spacing[4],
              }}
            >
              <span style={{ fontSize: '0.625rem', fontFamily: fonts.body, fontWeight: 700, color: colors.accent }}>0{dev.num}</span>
              <h4 style={{ fontFamily: fonts.heading, fontSize: fontSizes.sm, fontWeight: 700, color: colors.text, margin: 0 }}>{dev.name}</h4>
              <span style={{ fontSize: '0.6875rem', fontFamily: fonts.body, color: colors.muted }}>{dev.role}</span>
            </div>
          ))}
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

    </div>
  );
}
