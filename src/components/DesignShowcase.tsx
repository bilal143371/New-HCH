/**
 * DesignShowcase.tsx
 * ──────────────────
 * A standalone preview of every design-system token.
 * Renders sample headings, buttons, a card, color swatches, and the spacing scale.
 *
 * Mount at `/design` or render anywhere temporarily — it is fully self-contained
 * and does NOT affect existing page layouts.
 */
import React from 'react';
import { theme } from '../styles/theme';
import '../styles/design-system.css';

const { colors, fonts, fontSizes, radii, shadows, spacing } = theme;

/* ─── Small helpers ──────────────────────────────────────────────── */
const Swatch: React.FC<{ name: string; hex: string }> = ({ name, hex }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[8] }}>
    <div
      className="hch-swatch"
      style={{ backgroundColor: hex }}
      title={`${name}: ${hex}`}
    />
    <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted, fontWeight: 500 }}>
      {name}
    </span>
    <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted }}>
      {hex}
    </span>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="hch-heading hch-heading--lg"
    style={{ marginBottom: spacing[16], marginTop: spacing[48], borderBottom: `2px solid ${colors.success}`, paddingBottom: spacing[8], display: 'inline-block' }}
  >
    {children}
  </h2>
);

/* ─── Main Showcase ──────────────────────────────────────────────── */
const DesignShowcase: React.FC = () => {
  return (
    <div className="hch-showcase">
      {/* ── Title ───────────────────────────────────────────── */}
      <header style={{ marginBottom: spacing[48] }}>
        <h1
          className="hch-heading hch-heading--xl"
          style={{ color: colors.primary, marginBottom: spacing[8] }}
        >
          Health Care Hub — Design System
        </h1>
        <p className="hch-muted" style={{ maxWidth: '520px' }}>
          A preview of every token defined in <code style={{ fontWeight: 600 }}>src/styles/theme.ts</code>.
          Nothing here touches existing page layouts.
        </p>
      </header>

      {/* ── Colors ──────────────────────────────────────────── */}
      <SectionTitle>Colors</SectionTitle>
      <div style={{ display: 'flex', gap: spacing[24], flexWrap: 'wrap' }}>
        {(Object.entries(colors) as [string, string][]).map(([name, hex]) => (
          <Swatch key={name} name={name} hex={hex} />
        ))}
      </div>

      {/* ── Typography ──────────────────────────────────────── */}
      <SectionTitle>Typography</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[16] }}>
        <h1 className="hch-heading hch-heading--xl">Heading XL — Fraunces 36px</h1>
        <h2 className="hch-heading hch-heading--lg">Heading LG — Fraunces 24px</h2>
        <h3 className="hch-heading hch-heading--md">Heading MD — Fraunces 18px</h3>
        <p className="hch-body">
          Body copy — Inter 16px. The quick brown fox jumps over the lazy dog.
          This text demonstrates the standard body style used across the entire application.
        </p>
        <p className="hch-muted">
          Muted caption — Inter 14px. Secondary information and metadata.
        </p>
      </div>

      {/* ── Buttons ─────────────────────────────────────────── */}
      <SectionTitle>Buttons</SectionTitle>
      <div style={{ display: 'flex', gap: spacing[16], flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="hch-btn hch-btn--primary">Primary Action</button>
        <button className="hch-btn hch-btn--accent">Accent Action</button>
        <button className="hch-btn hch-btn--outline">Outline</button>
      </div>
      <div style={{ marginTop: spacing[16] }}>
        <p className="hch-muted">
          Border-radius: {radii.button} · Shadow on hover: {shadows.card}
        </p>
      </div>

      {/* ── Card ────────────────────────────────────────────── */}
      <SectionTitle>Card</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: spacing[24] }}>
        <div className="hch-card">
          <h3 className="hch-heading hch-heading--md" style={{ marginBottom: spacing[8] }}>
            Daily Health Summary
          </h3>
          <p className="hch-body" style={{ marginBottom: spacing[16] }}>
            Your vitals are looking great today. Keep up the consistent routine — hydration
            and sleep are both trending upward.
          </p>
          <button className="hch-btn hch-btn--primary">View Details</button>
        </div>

        <div className="hch-card">
          <h3 className="hch-heading hch-heading--md" style={{ marginBottom: spacing[8] }}>
            Meal Plan Ready
          </h3>
          <p className="hch-body" style={{ marginBottom: spacing[16] }}>
            A new balanced meal plan has been generated for this week.
            2,100 kcal · 45% carbs · 30% protein · 25% fat.
          </p>
          <div style={{ display: 'flex', gap: spacing[8] }}>
            <button className="hch-btn hch-btn--accent">Start Plan</button>
            <button className="hch-btn hch-btn--outline">Customize</button>
          </div>
        </div>

        <div className="hch-card" style={{ borderLeft: `4px solid ${colors.success}` }}>
          <h3 className="hch-heading hch-heading--md" style={{ marginBottom: spacing[8], color: colors.primary }}>
            ✓ Medication Taken
          </h3>
          <p className="hch-muted">
            All 3 medications logged for this morning. Next reminder at 8:00 PM.
          </p>
        </div>
      </div>

      {/* ── Spacing Scale ───────────────────────────────────── */}
      <SectionTitle>Spacing Scale</SectionTitle>
      <div style={{ display: 'flex', gap: spacing[16], alignItems: 'flex-end', flexWrap: 'wrap' }}>
        {(Object.entries(spacing) as [string, string][]).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[4] }}>
            <div
              style={{
                width: val,
                height: val,
                backgroundColor: colors.success,
                borderRadius: radii.button,
                border: `1px solid ${colors.primary}`,
                opacity: 0.7,
              }}
            />
            <span style={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.muted }}>
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* ── Radii ───────────────────────────────────────────── */}
      <SectionTitle>Border Radius</SectionTitle>
      <div style={{ display: 'flex', gap: spacing[24], alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[8] }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: colors.white, borderRadius: radii.card, boxShadow: shadows.card, border: `2px solid ${colors.success}` }} />
          <span className="hch-muted">Card {radii.card}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[8] }}>
          <div style={{ width: '80px', height: '48px', backgroundColor: colors.primary, borderRadius: radii.button }} />
          <span className="hch-muted">Button {radii.button}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[8] }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: colors.accent, borderRadius: radii.full }} />
          <span className="hch-muted">Full</span>
        </div>
      </div>

      {/* ── Shadow ──────────────────────────────────────────── */}
      <SectionTitle>Shadow</SectionTitle>
      <div style={{ display: 'flex', gap: spacing[32], alignItems: 'center' }}>
        <div style={{ width: '160px', height: '100px', backgroundColor: colors.white, borderRadius: radii.card, boxShadow: shadows.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="hch-muted">{shadows.card.split(')')[0]})</span>
        </div>
        <p className="hch-muted" style={{ maxWidth: '300px' }}>
          One shadow to rule them all. Used for every elevated surface — cards, modals, dropdowns.
        </p>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ marginTop: spacing[48], paddingTop: spacing[24], borderTop: `1px solid ${colors.success}` }}>
        <p className="hch-muted">
          Tokens defined in <code>src/styles/theme.ts</code> · CSS classes in <code>src/styles/design-system.css</code>
        </p>
      </footer>
    </div>
  );
};

export default DesignShowcase;
