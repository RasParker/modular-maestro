# Xclusive - Premium Creator Platform

## Overview
Xclusive is a comprehensive creator monetization platform designed to enable content creators to build subscription-based businesses. It provides a full-stack solution for managing subscriptions, content, and fan interactions, targeting a broad market for creators looking to monetize their content directly. The platform supports multiple user roles (fans, creators, admins) with robust role-based access control and comprehensive subscription management capabilities.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system, featuring custom design tokens for premium branding.
- **Styling**: Tailwind CSS for utility-first styling.
- **State Management**: React Query for server state and React Context for authentication.
- **Routing**: React Router with protected routes based on user roles.
- **Build Tool**: Vite for fast development and optimized builds.
- **UI/UX Decisions**: Mobile-first responsive design with edge-to-edge layouts, minimal icon-and-text navigation, Instagram-style borderless post cards, and consistent typography standards across components.
- **Feature Specifications**: Includes fan, creator, and admin dashboards; multi-role authentication; subscription management with tiered access; rich content creation and moderation tools; and a real-time notification system with WebSocket integration.

### Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations.
- **Session Management**: Connect-pg-simple for PostgreSQL session storage.
- **API Design**: RESTful endpoints.
- **Core Features**: Multi-role authentication, secure session handling, robust subscription system with multiple tiers, comprehensive content management (creation, scheduling, moderation, tier-based access), and a real-time notification system via WebSockets.
- **System Design Choices**: Emphasis on secure password hashing, proper database relations, and a clear client-server architecture with role-based access control. Implemented data retention policies for activity feeds to optimize performance.

## Recent Changes

### Performance Optimization Updates
- **Date**: August 2, 2025
- **Startup Performance**: Optimized server startup time by implementing non-blocking database initialization and cron service startup
- **Database Optimization**: 
  - Reduced database connection pool size for faster startup
  - Implemented schema existence checking to skip unnecessary table creation
  - Created optimized SQL schema file without duplicates (reduced from 269 to ~140 lines)
  - Reduced connection timeouts for faster feedback
- **Background Processing**: Moved database initialization and cron service to background processes to allow immediate server startup
- **Schema Management**: Consolidated duplicate table definitions and added performance indexes

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **React Hook Form**: Form validation and management.

### Backend & Database
- **Neon Database**: (Used for serverless PostgreSQL hosting during development, though shifted to standard PostgreSQL for production stability).
- **Drizzle ORM**: Type-safe database operations.
- **Express Session**: Session management middleware.
- **Zod**: Runtime schema validation.

### Development Tools
- **Vite**: Fast build tool.
- **TypeScript**: Static type checking.
- **ESBuild**: Fast JavaScript bundler.
- **tsx**: TypeScript execution.