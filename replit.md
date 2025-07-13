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
- July 09, 2025. Major security and subscription system implementation
  - ✅ Added comprehensive subscription system database schema
  - ✅ Implemented secure password hashing with bcrypt
  - ✅ Enhanced user schema with creator profiles and monetization fields
  - ✅ Created subscription tiers, subscriptions, and payment tracking tables
  - ✅ Added complete API endpoints for subscription management
  - ✅ Updated authentication to use real database with proper security
  - ✅ Established proper database relations and constraints
  - ✅ Added creator payout tracking and analytics foundation
  - ✅ Enhanced Fan feed modal with square aspect ratio container and blurred background
  - ✅ Implemented thumbnail click modal replication from Creator platform to Fan feed
- July 11, 2025. Creator profile enhancement and subscription access control
  - ✅ Successfully migrated from Replit Agent to Replit environment
  - ✅ Replaced creator profile post feed with Fan feed card design
  - ✅ Added functional like/heart button with visual feedback
  - ✅ Implemented comments section with CommentSection component
  - ✅ Added working share functionality with toast notifications
  - ✅ Enhanced edit and delete buttons with proper functionality
  - ✅ Maintained creator-specific actions (Edit, Delete) for own posts
  - ✅ Integrated real database posts with proper data mapping
  - ✅ Fixed comment section to fetch and store comments in database
  - ✅ Added comprehensive edit modal with title and content fields
  - ✅ Implemented real-time comment posting with API integration
  - ✅ Fixed edit API call method from PATCH to PUT to match server endpoints
  - ✅ Added proper error handling with toast notifications for all actions
  - ✅ Fixed comment posting by converting user_id from string to number for validation
  - ✅ Updated edit modal to use single "Caption" field matching create post template
  - ✅ Fixed cursor focus issue in reply inputs by using individual state per comment
  - ✅ Completed migration from Replit Agent to Replit environment
  - ✅ Fixed modal image display with proper object-fit: contain in 1:1 square container
  - ✅ Enhanced blurred background implementation matching content manager modal
  - ✅ Added inline style enforcement for object-contain to prevent CSS conflicts
  - ✅ Fixed JavaScript errors in CreatorProfile component (missing state variables)
  - ✅ Established proper PostgreSQL database connection with environment variables
  - ✅ Verified full-stack application runs without errors in Replit environment
  - ✅ Implemented comprehensive subscription-based access control system
  - ✅ Added API endpoint for checking user subscription status to specific creators
  - ✅ Created tier-based content access with proper hierarchy (public, supporter, fan, premium, superfan)
  - ✅ Added visual lock overlays and subscription prompts for premium content
  - ✅ Implemented scroll-to-tiers functionality from subscription prompts
  - ✅ Fixed button styling with black text for subscription prompts
  - ✅ Resolved mock data issues by removing fallback values for profile photos, cover photos, and bio
  - ✅ Added proper null value handling for creator profile information
  - ✅ Enhanced mobile responsiveness by replacing media badges with media logos overlay icons
  - ✅ Added media type icons (Image, Video, FileText) with backdrop blur overlay for better visual clarity
  - ✅ Improved postcard design consistency with content manager styling
- July 12, 2025. Complete migration from Replit Agent to Replit environment
  - ✅ Successfully created PostgreSQL database and established connection
  - ✅ Fixed JavaScript errors in CreatorProfile component (undefined toLocaleString calls)
  - ✅ Removed mock subscription tiers from new creator accounts
  - ✅ Added localStorage cleanup to prevent mock data persistence across sessions
  - ✅ Enhanced null safety for creator profile data rendering
  - ✅ Verified full-stack application runs without errors in Replit environment
  - ✅ Completed all migration checklist items successfully
  - ✅ Updated currency display across entire application to use Ghanaian Cedi (GHS)
  - ✅ Modified database schema to default currency to GHS instead of USD
  - ✅ Fixed comment reply input cursor jumping issue with isolated ReplyInput component
  - ✅ Updated all pricing displays in UI components and admin/creator dashboards
  - ✅ Successfully pushed database schema changes to production
  - ✅ Completed comprehensive currency conversion from USD to GHS across all remaining UI components
  - ✅ Updated Fan Dashboard monthly spending display to show GHS amounts
  - ✅ Fixed subscription pricing in Your Subscriptions section to display GHS currency
  - ✅ Updated Payment Methods page billing amount from $25 to GHS 25
  - ✅ Converted Admin Dashboard Platform Revenue from dollars to GHS display
  - ✅ Updated Top Performing Creators section to show GHS earnings instead of USD
  - ✅ Fixed Admin Analytics Revenue Analytics section to display all amounts in GHS
  - ✅ Updated Manage Subscriptions page monthly spending summary to show GHS totals
  - ✅ Verified SubscriptionCard component correctly displays GHS pricing
  - ✅ Successfully completed full localization for Ghanaian market with GHS currency
- July 13, 2025. Implemented comprehensive edge-to-edge layout design system
  - ✅ Created modern edge-to-edge layout utilities and CSS design system
  - ✅ Implemented full-width content cards with proper safe areas for mobile
  - ✅ Updated global CSS with edge-to-edge utilities and minimal button styles
  - ✅ Redesigned FeedPage with Instagram-style edge-to-edge content layout
  - ✅ Updated Navbar with minimal icon-and-text navigation buttons
  - ✅ Applied edge-to-edge design system to all dashboard pages (Fan, Creator, Admin)
  - ✅ Enhanced modal design with improved edge-to-edge styling
  - ✅ Added responsive utilities for mobile-first approach
  - ✅ Implemented proper content containers with safe areas for accessibility
  - ✅ Created minimal interaction design with subtle hover/tap feedback