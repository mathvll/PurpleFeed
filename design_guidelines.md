# Design Guidelines: TikTok & Instagram News Social Blog

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from Instagram's card-based feed aesthetics combined with Medium's content readability and Twitter's engagement patterns. The dark theme with violet/purple gradients creates a distinctive, modern identity that differentiates from standard news platforms.

## Typography System

**Font Families** (via Google Fonts):
- Primary: 'Inter' - for UI elements, buttons, navigation (weights: 400, 500, 600, 700)
- Headings: 'Plus Jakarta Sans' - for post titles and section headers (weights: 600, 700, 800)
- Body: 'Inter' - for post content and descriptions (weight: 400, 500)

**Hierarchy**:
- Hero/Main Headlines: 3xl to 5xl, bold (Plus Jakarta Sans)
- Post Titles: xl to 2xl, semibold (Plus Jakarta Sans)
- Section Headers: lg to xl, semibold (Plus Jakarta Sans)
- Body Text: base to lg, regular (Inter)
- Meta Info (dates, authors, counts): sm to base, medium (Inter)
- Captions/Labels: xs to sm, medium (Inter)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, and 24 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-24
- Card gaps: gap-4, gap-6, gap-8
- Margins: m-4, m-6, m-8

**Container Strategy**:
- Main content: max-w-7xl mx-auto px-4
- Post feed: max-w-4xl mx-auto
- Reading content: max-w-3xl
- Sidebar elements: w-80 to w-96

**Grid Layouts**:
- Desktop feed: 2-column masonry grid (grid-cols-2 gap-6)
- Tablet: Single column (grid-cols-1)
- Featured posts: Full-width hero cards
- Sidebar widgets: Stacked vertical layout

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header with backdrop blur effect
- Logo left-aligned with gradient text treatment
- Main nav items: Feed, TikTok, Instagram, Criar Post (center-aligned)
- Search bar with icon (medium width, rounded-full)
- User profile avatar and notification bell (right-aligned)
- Mobile: Hamburger menu with slide-out drawer

### Feed Components

**Post Cards** (Primary Content):
- Elevated cards with subtle border and shadow depth
- Card header: Platform badge (TikTok/Instagram with icon), author info, timestamp
- Featured image with 16:9 or 4:3 aspect ratio, rounded-lg corners, object-cover
- Post title: Bold, 2xl, clickable
- Content preview: 3-4 lines with gradient fade-out
- Engagement bar footer: Like button with count, comment icon with count, share button, bookmark
- Hover state: Subtle lift effect (translate-y-1)

**Category Pills**:
- Horizontal scroll on mobile
- Rounded-full badges with icons
- "Todos", "TikTok", "Instagram", "Tendências", "Novidades"
- Active state: Filled with gradient background

**Trending Sidebar Widget**:
- "Em Alta" header with flame icon
- Compact list of trending topics (5-7 items)
- Each item: Small thumbnail, truncated title, view count
- Numbered ranking indicators

### Post Creation Interface

**Create Post Form**:
- Modal overlay or dedicated page
- Platform selector (toggle between TikTok/Instagram)
- Title input: Large, prominent text field
- Rich text editor for content with formatting toolbar
- Image upload area: Drag-and-drop zone with preview
- Category/tags selector with autocomplete
- Publish button: Prominent gradient CTA

### Engagement Elements

**Like Button**:
- Heart icon (Heroicons) that fills on interaction
- Animated scale pulse on click
- Counter beside icon

**Comment Section**:
- Nested thread design (max 2 levels)
- Avatar + username + timestamp
- Reply button inline
- Comment input: Rounded text area with emoji picker
- Sort options: Mais Recentes, Mais Curtidos

**Share Menu**:
- Dropdown with share options
- Copy link, WhatsApp, Twitter, Facebook
- Icons from Heroicons

### Content Display

**Full Post View**:
- Hero image: Full-width, max-h-96, object-cover
- Breadcrumb navigation above title
- Large title (3xl to 4xl)
- Author byline with avatar, name, date, read time
- Share and bookmark buttons (floating or sticky)
- Content in readable column (max-w-3xl)
- Related posts carousel at bottom

**User Profile Card**:
- Avatar with gradient border ring
- Display name + username
- Bio (2-3 lines)
- Stats row: Posts count, Followers, Following
- Follow/Seguir button with gradient

## Images

**Hero Section**: 
- Large hero banner showcasing vibrant social media imagery
- Abstract composition blending TikTok/Instagram visual elements
- Gradient overlay from dark purple at top to transparent at bottom
- Text overlaid: "Últimas Notícias" + "TikTok & Instagram" tagline
- CTA buttons with blur backdrop

**Post Images**:
- Each post card includes featured image
- Mix of screenshots from TikTok/Instagram, creator photos, app interface mockups
- Aspect ratios: 16:9 for landscape, 4:3 for featured content
- All images use rounded-lg corners and object-cover fit

**Background Elements**:
- Subtle gradient mesh backgrounds in sections
- Floating geometric shapes with blur (very subtle, not distracting)
- Grid patterns overlaid at low opacity

## Interaction Patterns

**Animations** (Minimal and Purposeful):
- Page transitions: Smooth fade-in (300ms)
- Card hover: Subtle lift with shadow increase
- Button clicks: Quick scale bounce
- Like animation: Heart fill with scale pulse
- Modal open/close: Fade + scale from center
- Infinite scroll: Smooth loading state with skeleton cards

**Micro-interactions**:
- Toast notifications for actions (post created, liked, etc.)
- Progress indicators for image uploads
- Loading skeletons matching card structure
- Pull-to-refresh on mobile feed

## Responsive Behavior

**Desktop (lg and up)**:
- Three-column layout: Sidebar left (categories), Main feed center, Trending right
- Fixed navigation and sidebars with scrollable center
- 2-column post grid in feed

**Tablet (md)**:
- Two-column layout: Main feed + collapsible sidebar
- Single column post grid
- Bottom navigation bar option

**Mobile (base)**:
- Single column stacked layout
- Bottom tab navigation: Feed, Criar, Perfil
- Horizontal scroll category pills
- Swipe gestures for post navigation

## Accessibility Standards

- All interactive elements have focus states with ring
- Icon buttons include aria-labels
- Semantic HTML: <article>, <nav>, <main>, <aside>
- Keyboard navigation support throughout
- Alt text for all images
- Color contrast meets WCAG AA (light text on dark backgrounds)
- Form inputs have associated labels
- Screen reader announcements for dynamic content updates

## Special Features

**Infinite Scroll Feed**: Auto-load more posts with intersection observer
**Search with Filters**: Real-time search with platform, date, popularity filters
**Bookmark System**: Save posts for later reading
**Notification Center**: Bell icon with badge counter, dropdown list
**Dark Mode Native**: Built dark-first, no toggle needed per requirements

This design creates a visually striking, modern social blog that feels native to TikTok/Instagram culture while maintaining excellent readability and engagement patterns.