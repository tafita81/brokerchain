# Design Guidelines: BrokerChain - Global Compliance Broker Platform

## Design Approach

**Selected Approach:** Design System (Fluent Design) + B2B Enterprise References

**Justification:** This is a professional B2B compliance platform serving procurement officers, compliance directors, and federal buyers. The design must convey institutional trust, technical sophistication, and data-driven decision-making. Drawing inspiration from enterprise platforms like SAM.gov, LinkedIn Sales Navigator, and Salesforce while maintaining modern web app polish.

**Core Principle:** Credibility through clarity - every element serves a functional purpose. Avoid consumer marketing aesthetics in favor of professional, data-rich interfaces.

---

## Typography

**Font Families:**
- **Primary:** Inter (via Google Fonts CDN) - exceptional readability for data-dense interfaces
- **Accent:** JetBrains Mono - for codes, metrics, and technical identifiers (UEI, CNPJ, etc.)

**Hierarchy:**
- **H1:** 32px/40px, font-semibold - Page titles, regulatory framework names
- **H2:** 24px/32px, font-semibold - Section headers, compliance categories
- **H3:** 20px/28px, font-medium - Subsection headers, supplier names
- **Body:** 16px/24px, font-normal - Primary content, descriptions
- **Small:** 14px/20px, font-normal - Metadata, secondary info
- **Caption:** 12px/16px, font-medium - Labels, tags, status indicators

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card spacing: p-6
- Grid gaps: gap-6 to gap-8

**Container Strategy:**
- **Full-width sections:** w-full with inner max-w-7xl mx-auto
- **Dashboard content:** max-w-screen-2xl (wider for data tables)
- **Form content:** max-w-2xl

**Grid Patterns:**
- **Regulatory frameworks:** 3-column grid (lg:grid-cols-3)
- **Supplier cards:** 2-column grid (lg:grid-cols-2)
- **Metrics dashboard:** 4-column grid (lg:grid-cols-4)
- **Mobile:** All stack to single column (grid-cols-1)

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with logo (BrokerChain wordmark)
- Main navigation: Dashboard, PFAS/EPR, Buy America, EUDR, Suppliers, Metrics
- Right-aligned: Language selector (14 countries), user profile icon
- Clean horizontal divider below

### Hero Section (Homepage)
**Layout:** Full-width container with split design
- **Left (60%):** Headline + value proposition + CTA
  - H1: "Global Compliance Authority for Regulated Supply Chains"
  - Subheading: Clear explanation of three regulatory frameworks
  - Primary CTA: "Access Dashboard" (prominent button)
  - Secondary CTA: "View Supplier Network" (outline button)
- **Right (40%):** Large hero image showing compliance workflow visualization or global supply chain map
- **Background:** Subtle gradient or clean solid treatment

### Regulatory Framework Cards
**3-Column Grid Layout:**
Each card includes:
- **Icon:** Large regulatory symbol (PFAS molecule, American flag shield, EU leaf)
- **Title:** Framework name (h3)
- **Description:** 2-3 sentence explanation
- **Metrics:** Key stats (e.g., "600+ suppliers", "14 countries")
- **CTA:** "Explore" link with arrow

**Visual Treatment:** Clean cards with subtle borders, hover state with slight elevation

### Data Dashboard Components
**Metrics Cards (4-column grid):**
- Large number display (48px, font-bold)
- Label below (14px)
- Trend indicator (arrow + percentage)
- Sparkline chart (optional)

**Tables:**
- Clean headers with sort indicators
- Alternating row backgrounds for readability
- Status badges (color-coded: Active, Pending, Verified)
- Action buttons in last column

### Supplier Directory
**Card Layout:**
- Supplier logo/icon
- Company name (h3)
- Regulatory certifications (badges)
- Product categories (tags)
- Location + contact CTA

### Forms
**Professional Form Design:**
- Clear labels above inputs
- Consistent input heights (h-12)
- Validation states with inline messages
- Multi-step forms with progress indicator
- File upload zones for compliance documents

### RFQ Generator Interface
**Multi-stage workflow:**
- Step indicator at top
- Form sections with clear headings
- Dynamic field generation based on regulatory type
- Preview panel showing generated content
- Submit and track buttons

### Digital Product Passport (DPP) Viewer
**Document-style layout:**
- PDF-like interface with metadata sidebar
- Geospatial map integration for EUDR
- Certificate badges display
- Download and share options

---

## Images

**Hero Section:**
- Large professional image showing global supply chain visualization, logistics hub, or compliance workflow diagram
- Modern, clean aesthetic with subtle blue/green tones
- Placement: Right side of hero, 40% width, contained within max-w-7xl

**Regulatory Framework Sections:**
- Icon-based rather than photographic
- Use illustrated icons for PFAS molecule, industrial components, agricultural commodities
- No generic stock photos

**Supplier Cards:**
- Company logos (actual supplier logos where available)
- Placeholder: Simple geometric pattern with company initial

**Dashboard:**
- Data visualizations (charts, graphs) generated programmatically
- No decorative images - focus on functional data display

---

## Accessibility

- WCAG 2.1 AA compliance minimum
- Form inputs with associated labels
- Keyboard navigation throughout
- Focus states clearly visible
- Color contrast ratios maintained
- Screen reader friendly table structures
- ARIA labels for interactive elements

---

## Animation Strategy

**Minimal and Purposeful:**
- Smooth transitions on hover states (150ms ease)
- Fade-in on scroll for section reveals
- Loading states for data fetching
- NO decorative animations, parallax, or motion graphics
- Focus on performance and clarity

---

## B2B Professional Aesthetic

**Key Differentiators:**
- Clean, data-rich interfaces over marketing fluff
- Real metrics prominently displayed
- Technical terminology presented clearly
- Certification badges and compliance indicators visible
- Professional photography/illustrations, not consumer lifestyle imagery
- Emphasis on functionality, traceability, and verification
- Trust signals: SAM.gov integration, NMSDC certification, GS1 registration

**Tone:** Authoritative, precise, technically competent - this is a platform for procurement professionals, not consumers.