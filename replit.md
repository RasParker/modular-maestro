# Xclusive - Premium Creator Platform

## Overview

Xclusive is a comprehensive creator monetization platform that enables content creators to build subscription-based businesses. The platform follows a full-stack architecture with React frontend, Express backend, and PostgreSQL database. It supports multiple user roles (fans, creators, admins) with role-based access control and comprehensive subscription management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for premium branding
- **State Management**: React Query for server state, React Context for auth
- **Routing**: React Router with protected routes based on user roles
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful endpoints with /api prefix
- **Development**: Hot reloading with custom middleware logging

### Database Schema
- **Users Table**: Core user data with role-based access (fan, creator, admin)
- **Subscription System**: Support for multiple tiers per creator
- **Content Management**: Structured content with tier-based access control
- **Database Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication & Authorization
- **Multi-role System**: Fans, creators, and administrators
- **Protected Routes**: Role-based access control for different dashboard areas
- **Session Management**: Secure session handling with PostgreSQL storage
- **Mock Authentication**: Development-friendly auth system for testing

### User Interfaces
- **Fan Dashboard**: Content feed, subscription management, messaging
- **Creator Dashboard**: Content creation, analytics, subscriber management
- **Admin Dashboard**: User management, content moderation, platform analytics
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Subscription Management
- **Tier System**: Multiple subscription tiers per creator
- **Payment Integration**: Ready for payment processor integration
- **Subscription Lifecycle**: Active, paused, and cancelled states
- **Auto-renewal**: Configurable subscription renewal settings

### Content Management
- **Rich Content Creation**: Support for various content types
- **Tier-based Access**: Content restricted by subscription tier
- **Scheduling**: Content publishing scheduler
- **Moderation**: Admin content review system

## Data Flow

1. **User Registration**: Multi-step registration with role selection
2. **Authentication**: Session-based auth with role-based redirects
3. **Content Creation**: Creators publish content with tier restrictions
4. **Subscription Flow**: Fans subscribe to creators and access content
5. **Payment Processing**: Subscription billing and creator payouts
6. **Analytics**: Real-time dashboard metrics and reporting

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form validation and management

### Backend & Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express Session**: Session management middleware
- **Zod**: Runtime schema validation

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Secure configuration management

### Production Build
- **Frontend**: Vite build with static asset optimization
- **Backend**: ESBuild bundling for Node.js deployment
- **Database Migrations**: Automated schema deployment
- **Asset Serving**: Static file serving with Express

### Database Management
- **Schema Evolution**: Drizzle migrations for database changes
- **Connection Pooling**: Neon serverless connection management
- **Backup Strategy**: Automated database backups
- **Performance Monitoring**: Query optimization and monitoring

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 08, 2025. Successfully migrated from Lovable to Replit
  - Fixed React Router dependencies and routing compatibility
  - Implemented complete comment ecosystem with backend support
  - Added comprehensive database schema for posts, comments, and likes
  - Created full-stack API endpoints for authentication, posts, comments, and likes
  - Enhanced storage layer with seeded mock data for testing
  - Established proper client-server architecture with role-based access control