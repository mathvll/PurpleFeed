# Design Guidelines: Landing Page Impulsiona Digital

## Design Approach

**Landing Page Strategy**: Clean, conversion-focused design inspired by the provided mockup. Dark blue background with bold orange CTA creating high contrast and clear call-to-action. Platform selection cards are the primary interaction elements, designed for immediate visual recognition and easy clicking.

## Typography System

**Font Families** (via Google Fonts):
- Primary: 'Inter' - for UI elements, buttons, navigation (weights: 400, 500, 600, 700)
- Headings: 'Plus Jakarta Sans' - for hero titles and section headers (weights: 600, 700, 800)

**Hierarchy**:
- Hero Headlines: 4xl to 6xl, bold (Plus Jakarta Sans)
- Section Headers: 2xl to 3xl, semibold (Plus Jakarta Sans)
- Platform Names: xl, semibold (Plus Jakarta Sans)
- Body Text: base to lg, regular (Inter)
- Footer Text: sm, regular (Inter)

## Color Palette

**Background**:
- Main: Deep navy blue (#0a1628 / 220 70% 10%)
- Card background: Slightly lighter navy (#1a2640 / 220 60% 15%)

**Accent Colors**:
- Primary CTA: Vibrant orange (#ff9800 / 36 100% 50%)
- Gradient highlight: Cyan accent for "No Digital!" text (#00e5ff / 189 100% 50%)

**Text**:
- Primary: White (#ffffff)
- Secondary: Light gray (rgba(255, 255, 255, 0.8))
- Footer: Muted white (rgba(255, 255, 255, 0.7))

## Layout System

**Spacing Primitives**: Consistent spacing using Tailwind units
- Hero padding: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Section spacing: py-12 to py-16
- Container padding: px-4 to px-8

**Container Strategy**:
- Main content: max-w-6xl mx-auto
- Hero section: Full width with centered content
- Platform grid: 2x3 grid on desktop, single column on mobile

## Component Library

### Hero Section
**Main Banner**:
- Large heading: "Impulsione sua presença No Digital!"
  - "No Digital!" highlighted with cyan gradient
- Subtitle: "Somos a escolha preferida dos clientes por nossa excelência, custo-benefício e Suporte."
- Clean, centered layout
- Ample white space for readability

### Platform Selection
**Section Title**:
- "Escolha a melhor opção"
- Subtitle: "Encontre o serviço certo para você e comece agora."

**Platform Cards**:
- 2x3 grid layout (Instagram, TikTok, YouTube, Kwai, Facebook)
- Each card includes:
  - Platform icon (large, centered)
  - Platform name (centered below icon)
  - Dark blue background with subtle border
  - Hover effect: Brightness increase and subtle scale
  - Click redirects to https://app.impulsionalikes.com/
- Card design:
  - Rounded corners (rounded-lg)
  - Padding: p-8 to p-12
  - Aspect ratio: Square or near-square
  - Icon size: 64px to 80px

**Platform Icons**:
- Instagram: Gradient pink/purple/orange icon
- TikTok: Black background with white musical note
- YouTube: Red play button icon
- Kwai: Orange video camera icon
- Facebook: Blue 'f' icon

### CTA Button
**"COMEÇAR AGORA" Button**:
- Vibrant orange background (#ff9800)
- Large size with prominent placement
- Rounded-full shape
- White text, bold weight
- Hover: Slight brightness increase
- Center-aligned below platform cards

### Footer
**Quality Statement**:
- "Serviços de alta qualidade e entrega rápida garantidos"
- Centered text
- Muted white color
- Small to medium font size

## Responsive Behavior

**Desktop (lg and up)**:
- 2x3 grid for platform cards
- Larger hero text (5xl to 6xl)
- Spacious padding throughout

**Tablet (md)**:
- 2x2 grid with 5th card centered or wrapping
- Medium hero text (4xl to 5xl)
- Moderate padding

**Mobile (base)**:
- Single column layout
- Smaller hero text (3xl to 4xl)
- Stacked platform cards
- Full-width CTA button
- Compact spacing

## Interaction Patterns

**Animations** (Subtle and Professional):
- Card hover: Brightness increase + subtle scale (1.02)
- Button hover: Brightness increase
- Page load: Smooth fade-in
- All transitions: 200-300ms duration

**Micro-interactions**:
- Card click: Immediate navigation (no delay)
- Button click: Instant feedback
- Hover states: Clear visual indication

## Accessibility Standards

- All platform cards have proper labels and ARIA attributes
- Keyboard navigation: Tab through cards and button
- Focus states: Clear ring indicators
- Semantic HTML: <main>, <section>, <button>
- Alt text for platform icons
- High contrast text on dark background
- Touch targets minimum 44px for mobile

## Special Features

**Single-Page Focus**: No navigation, no distractions - entire page dedicated to platform selection
**Instant Redirect**: Click any platform card → immediate redirect to app.impulsionalikes.com
**Conversion Optimized**: Clear hierarchy guiding user to action

This design creates a clean, professional landing page that immediately communicates value and guides users to select their preferred platform.
