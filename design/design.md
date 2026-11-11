# Seed Design Document
SOURCE: https://fruitful.com (via awwwards.com/sites/fruitful) | GALLERY: awwwards.com Sites of the Day archive | DATE CRAWLED: 2026-11-11 | PAGES VISITED: Home, Pricing, Guide, Story

## 1. Concept and voice
- Big idea in one sentence: Calm, tactile financial guidance presented with physical editorial charm and interactive playfulness.
- Tone of copy: Direct, unpretentious, reassuring. Sentences are concise (under 12 words average). Zero financial jargon.

## 2. Color system
| Token/role | Hex | Approx. share of screen | Used for |
| --- | --- | --- | --- |
| Surface / Canvas | #161a22 / #f9f8f4 | 60% | Base canvas surface |
| Primary Ink | #0d1117 | 25% | Headings, primary content, borders |
| Pastel Accent 1 (Mint) | #a7f3d0 | 8% | Feature pill highlights, verified tags |
| Pastel Accent 2 (Sky/Lavender) | #dbeafe | 5% | Selection outlines, secondary chip fills |
| Border Rim | rgba(255, 255, 255, 0.12) | 2% | Structural division, glass specular edges |

- Contrast structure: Crisp readable high-contrast ink against translucent glass plates; pastel accents reserved strictly for interactive state and verification.
- Overlays & Glass: Multi-stop backdrop blur (`backdrop-filter: blur(20px)`), frosted refraction, zero background gradient slop.

## 3. Typography
| Role | Family | Size (clamp or px) | Weight | Line-height | Tracking | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Display H1 | Sora / Geometric Grotesk | clamp(2.75rem, 5.5vw, 5rem) | 650 | 1.05 | -0.03em | Sentence |
| Section H2 | Sora / Geometric Grotesk | clamp(1.85rem, 3.2vw, 3rem) | 600 | 1.15 | -0.02em | Sentence |
| Feature Title H3 | Sora | 1.25rem (20px) | 550 | 1.3 | -0.01em | Sentence |
| Body Text | Sora / Modern Sans | 1rem (16px) | 400 | 1.6 | 0 | Sentence |
| AST/Code/Pills | Martian Mono / Azeret | 0.8125rem (13px) | 500 | 1.4 | +0.02em | Mixed / Mono |

## 4. Layout and spacing
- Grid: 12-column adaptive grid, max-width 1280px, responsive gutters 24px (mobile) to 48px (desktop).
- Spacing rhythm: 8px base unit with exponential jumps: 8, 16, 24, 32, 48, 64, 96, 128px.
- Navigation & Footer: Liquid glass floating bar anchored with contextual state pills and rapid actions.

## 5. Components
- Glass Cards: Pure liquid glass plates with 1px translucent borders (`rgba(255, 255, 255, 0.14)`), `box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 12px 36px rgba(0,0,0,0.3)`.
- Action Buttons: High-specular pill buttons with refractive top-edge bevel and spring hover state (`transform: translateY(-2px) scale(1.02)`).
- Status Indicators: Emerald and pastel-toned micro-pulsing telemetry pips.

## 6. Motion spec
- Libraries: GSAP 3.12, ScrollTrigger, Lenis smooth scrolling (lerp: 0.1, duration: 1.2s).
- Easing library:
  - Spring-reveal: `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out)
  - Interactive click: `cubic-bezier(0.34, 1.56, 0.64, 1)` (back.out)
  - Color flood transition: `cubic-bezier(0.7, 0, 0.3, 1)`
- Animation Catalog:
  | # | Trigger | Target | Properties from -> to | Duration | Ease | Notes |
  |---|---|---|---|---|---|---|
  | 1 | Page Load | Hero Headline & Badge | opacity: 0, y: 30 -> 1, 0 | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Staggered 0.12s |
  | 2 | Auto-Sim / Loop | Simulator Cursor | x, y coordinates along spline | 1.2s | cubic-bezier(0.25, 1, 0.5, 1) | Simulates real hand movement |
  | 3 | Hover / Target | Selection Box | stroke-dashoffset: 20 -> 0 | 0.35s | linear | Animated dashed outline |
  | 4 | Double-Click | Text Element | outline, bg highlight, caret | 0.2s | ease-out | Transitions to editable input |
  | 5 | Type Simulation | Text Content | string slicing with typing cadence | 0.08s/char | stepped | Simulates developer typing |
  | 6 | Save Action | Save Button & Dock | scale: 0.96 -> 1.04 -> 1.0, pulse glow | 0.4s | back.out | Tactile affirmative click |
  | 7 | AST Diff Reveal | File Toast / Drawer | y: 20, opacity: 0 -> 0, 1 | 0.5s | cubic-bezier(0.16, 1, 0.3, 1) | Slides up with line numbers |
  | 8 | Index Item Expand | Accordion Drawer | height: 0 -> auto, opacity 0 -> 1 | 0.45s | cubic-bezier(0.16, 1, 0.3, 1) | Fluid content expansion |

## 7. Interaction catalog
- Interactive Simulator Switcher: Toggle between "Live Automation Demo" and "Try It Live (Interactive Sandbox)".
- Click-to-inspect on demo page: Visitors can click elements, trigger toolbar, edit strings, and watch code diffs generate.
- Command Copy Dock: One-click copying with animated feedback and glass checkmark flash.
- Framework Filter Matrix: Instant toggle between Next.js, Vite, Astro, Vue, Svelte tabs.

## 8. Media treatment
- Vector AST schema illustrations and live CSS/DOM interactive simulation canvas.
- No blurry stock photos or generic 3D illustrations. Pure real-time DOM graphics and physical glass layers.

## 9. Tech and performance
- Clean vanillajs + GSAP + Lenis.
- Zero heavyweight WebGL dependencies that drain battery.
- 60fps GPU-accelerated transforms and backdrop-filters.

## 10. Why it works
1. Direct kinetic proof: You don't read marketing claims; you see the live edit in action.
2. Tactile liquid glass materiality: Refractive edges, specular highlights, and pure optical depth without artificial gradients.
3. Developer-to-developer honesty: Clean code diffs, real terminal syntax, transparent limitations.
4. Editorial precision: Clear typographic rhythm and structured technical indexing.
5. High micro-interaction polish: Every button press, toggle, and hover feels weighted and deliberate.

## 11. Never copy
Fruitful's exact financial illustrations, logo, domain assets, or copy. We apply our own concept, layout skeleton, and technical live-edit domain.

