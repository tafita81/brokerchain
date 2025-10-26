# BrokerChain - Global Compliance Broker Platform

## Overview

BrokerChain is a B2B compliance broker platform designed to connect buyers with verified suppliers across three major regulatory frameworks: PFAS/EPR packaging compliance, Buy America Act components, and EU Deforestation Regulation (EUDR) agricultural commodities. The platform automates RFQ (Request for Quote) generation, provides AI-powered SEO content creation for global markets, and maintains digital product passports for supply chain transparency.

The application serves procurement officers, compliance directors, and federal buyers who require institutional-grade compliance verification and supplier discovery capabilities.

**Official Registration:**
- Email: contact@brokerchain.business
- SAM.gov ID: N394AKZSR349
- Location: Florida-Based
- SPC Member (Sustainable Packaging Coalition)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: The application uses shadcn/ui components built on top of Radix UI primitives, configured with the "new-york" style variant. This provides a comprehensive set of accessible, pre-styled components including forms, dialogs, cards, navigation menus, and data display elements.

**Styling Approach**: Tailwind CSS with a custom design system inspired by Fluent Design principles and B2B enterprise references. The design emphasizes credibility through clarity, using data-rich interfaces appropriate for professional compliance workflows. Typography uses Inter for general content and JetBrains Mono for technical identifiers (codes, metrics, UEIs, etc.).

**State Management**: TanStack Query (React Query) for server state management and data fetching, providing automatic caching, background updates, and optimistic updates. No global client-side state management library is used - component state is managed locally with React hooks.

**Routing**: Wouter for lightweight client-side routing with the following main routes:
- Home/landing page
- Dashboard (RFQ and content management)
- PFAS compliance page
- Buy America compliance page  
- EUDR compliance page
- Suppliers directory
- Metrics/analytics dashboard

**Design System Configuration**: Custom color palette with semantic tokens for backgrounds, borders, and state indicators. The theme supports both light and dark modes with CSS custom properties, though the primary focus is on light mode for professional B2B contexts.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**API Pattern**: RESTful API design with route handlers organized by resource type (suppliers, buyers, RFQs, content, DPPs, leads, metrics)

**Development Setup**: Vite middleware integration for HMR (Hot Module Replacement) during development, with custom error overlays and runtime error handling. Production builds bundle the server code using esbuild.

**Request Processing**: 
- JSON body parsing with raw body preservation for webhook verification
- Request logging middleware that captures method, path, status, duration, and truncated response payloads for API routes
- CORS and security headers handled at the Express level

### Data Storage Solutions

**Database**: PostgreSQL accessed via Neon's serverless driver (@neondatabase/serverless)

**ORM**: Drizzle ORM for type-safe database queries and schema management. The schema is defined in TypeScript with automatic type inference.

**Schema Design**:
- **Suppliers**: Core entity with supplier type (new/surplus), discounts for surplus (30-50%), certifications, products
- **Buyers**: Organizations seeking compliant suppliers
- **RFQs**: Expanded status workflow (15 states: draft → sent → responded → negotiating → contract_signed → payment_received → delivered → completed)
- **Supplier Quotes**: Quotes from suppliers with pricing, MOQ, lead time, margin calculations (5-15%)
- **Negotiations**: AI-powered negotiation rounds with target margins and conversation logs
- **Contracts**: DocuSign integration with 3-party signing (buyer + supplier + broker)
- **Payments**: Escrow payments via Stripe with tracking and automated releases
- **Commissions**: BrokerChain commission tracking (5-15%) with Payoneer integration
- **Email Logs**: Full tracking of automated emails (sent, delivered, opened, clicked)
- **Generated Content**: AI-generated SEO content for lead generation
- **Digital Product Passports (DPPs)**: Geospatial compliance data and supply chain tracking
- **Leads**: Marketing funnel data from content engagement
- **Metrics**: Operational analytics and KPIs
- **Conversation Threads**: Multi-turn AI negotiations with buyers and suppliers
- **Company Context**: Real-time data for AI conversations (inventory, pricing, capabilities)

**Session Management**: PostgreSQL-backed sessions using connect-pg-simple for production-grade session persistence

**Migrations**: Drizzle Kit handles schema migrations with configuration pointing to the migrations directory

### Authentication and Authorization

The codebase does not currently implement authentication/authorization mechanisms. The storage interface and routes are open, suggesting this is either intended for internal use or authentication is planned as a future addition.

**Rationale**: The absence of auth suggests this may be an MVP or internal tool where access control is handled at the network/infrastructure level rather than application level.

### External Service Integrations

**OpenAI Integration**: 
- Used for AI-powered RFQ generation based on regulatory framework requirements (PFAS, Buy America, EUDR)
- Generates SEO-optimized content for different countries and languages
- AI-powered negotiation agents for automated counter-offers
- Email parsing for supplier quote extraction
- API key required via `OPENAI_API_KEY` environment variable

**Email Automation (Hostinger SMTP/IMAP)**:
- SMTP for sending RFQs to suppliers automatically (smtp.hostinger.com:465)
- IMAP for receiving supplier quotes 24/7 (imap.hostinger.com:993)
- Automated email tracking (sent, delivered, opened, clicked)
- Intelligent quote parsing from supplier emails
- Environment variables: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`

**Database Service**: Neon PostgreSQL serverless database requiring `DATABASE_URL` environment variable

**Google Fonts**: Inter and JetBrains Mono fonts loaded via Google Fonts CDN for consistent typography

**Planned Integrations**:
- DocuSign API for 3-party contract signing (buyer + supplier + broker)
- Stripe for escrow payments and automated releases
- Payoneer for commission payouts (5-15%)
- Twilio for SMS/WhatsApp supplier notifications

### AI-Powered Features

**RFQ Generation**: The OpenAI integration generates customized request-for-quote content based on:
- Regulatory framework context (PFAS/EPR, Buy America Act, EUDR)
- Buyer industry and product requirements
- Compliance criteria specific to each framework
- Certification requirements and technical specifications

**SEO Content Generation**: Creates localized content for international markets across 14 countries with appropriate language targeting and keyword optimization for supplier discovery and lead generation.

### Regulatory Framework Expertise

The platform embeds deep domain knowledge for three compliance areas:

1. **PFAS/EPR**: Focus on PFAS-free packaging for US food service with state-level compliance tracking (20+ states), SPC alignment, and certifications like BPI, ASTM D6868, TÜV OK Compost

2. **Buy America Act**: 100% domestic manufacturing requirements with metallurgical traceability, IATF 16949 certification, and SAM.gov verification

3. **EUDR**: Zero deforestation verification with polygon-level GPS coordinates, satellite imagery verification using Sentinel-2, and Digital Product Passport integration with EU TRACES NT system