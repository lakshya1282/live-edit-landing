# Design Tokens: live-edit (Minimalist White & Liquid Glass)

## 1. Minimalist White Palette & Liquid Glass Tokens
```css
:root {
  /* Canvas Foundations (Pure White & Subtle Crisp Sheets) */
  --canvas-bg: #ffffff;
  --canvas-subtle: #f8fafc;
  --canvas-elevated: #ffffff;
  --canvas-border: rgba(0, 0, 0, 0.08);

  /* Crystalline Liquid Glass Surfaces (Light Mode) */
  --glass-surface: rgba(255, 255, 255, 0.78);
  --glass-surface-hover: rgba(255, 255, 255, 0.92);
  --glass-surface-subtle: rgba(248, 250, 252, 0.65);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-border-hover: rgba(0, 0, 0, 0.16);
  --glass-border-glassy: rgba(255, 255, 255, 0.9);

  /* Optical Liquid Glass Specular & Refraction */
  --specular-top: inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
  --specular-bottom: inset 0 -1px 1px 0 rgba(0, 0, 0, 0.03);
  --shadow-ambient: 0 20px 48px -12px rgba(0, 0, 0, 0.08);
  --shadow-lift: 0 12px 32px -4px rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --glass-backdrop-blur: blur(24px) saturate(180%);

  /* Heavy Black Ink & Contrast Inks */
  --text-primary: #0a0c10;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-inverse: #ffffff;

  /* Functional Accents */
  --accent-emerald: #059669;
  --accent-emerald-dark: #064e3b;
  --accent-emerald-soft: rgba(5, 150, 105, 0.08);

  --accent-blue: #0284c7;
  --accent-blue-soft: rgba(2, 132, 199, 0.08);

  --accent-amber: #d97706;
  --accent-amber-soft: rgba(217, 119, 6, 0.08);

  --accent-rose: #e11d48;
  --accent-rose-soft: rgba(225, 29, 72, 0.08);
}
```
