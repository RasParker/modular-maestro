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
- July 13, 2025. Edge-to-edge layout and minimal navigation implementation
  - ✅ Implemented comprehensive edge-to-edge layout design system
  - ✅ Created minimal icon-and-text navigation for modern user experience
  - ✅ Added AppLayout component for consistent layout management
  - ✅ Built MinimalNavbar with role-based navigation items
  - ✅ Implemented BottomNavigation for mobile-first experience
  - ✅ Created EdgeToEdgeContainer component for flexible content layout
  - ✅ Updated Fan Dashboard with full-width hero section and edge-to-edge content
  - ✅ Enhanced Creator Dashboard with premium brand styling and improved space usage
  - ✅ Redesigned Admin Dashboard with modern edge-to-edge layout
  - ✅ Updated Feed Page for immersive content viewing experience
  - ✅ Enhanced Explore page with better creator discovery layout
  - ✅ Established responsive design patterns for desktop and mobile
  - ✅ Improved visual hierarchy and content focus across all pages
  - ✅ Implemented Instagram-style borderless post cards on Creator profiles
  - ✅ Mobile-optimized Instagram design with larger touch targets and spacing
  - ✅ Added full-width square aspect ratio media display
  - ✅ Enhanced action buttons with Instagram-style layout and sizing
  - ✅ Implemented mobile-first caption and like count display
  - ✅ Optimized comment section with mobile-friendly interaction patterns
- July 14, 2025. Database migration and stability improvements
  - ✅ Successfully migrated from PostgreSQL to SQLite for development environment
  - ✅ Created SQLite-compatible schema with proper data type handling
  - ✅ Fixed database initialization with programmatic table creation
  - ✅ Resolved session management using memory storage for development
  - ✅ Fixed user registration and authentication system
  - ✅ Resolved profile sync SQLite binding errors by converting Date objects to ISO strings
  - ✅ Completed migration from Replit Agent to Replit environment
  - ✅ Established stable development environment with proper error handling
  - ✅ Verified all core functionality works correctly with SQLite database
  - ✅ Fixed duplicate post rendering issue on Explore page by removing unnecessary MOCK_CREATOR_POSTS section
  - ✅ Enhanced creator profile display with proper null value handling for avatar, bio, and cover photos
  - ✅ Added proper URL path handling for uploaded media files in profile display
  - ✅ Improved fallback display logic for missing profile information
  - ✅ Fixed Admin Users page "Failed to load users" error by correcting SQL query syntax
  - ✅ Removed problematic COALESCE SQL functions that were causing database query failures
  - ✅ Verified all admin functionality working correctly with proper user data display
- July 15, 2025. Final migration from Replit Agent to Replit environment
  - ✅ Successfully migrated back to PostgreSQL database for production stability
  - ✅ Installed missing tsx dependency for TypeScript execution
  - ✅ Created and configured PostgreSQL database with environment variables
  - ✅ Pushed database schema changes to production database
  - ✅ Verified complete application functionality with comprehensive API testing
  - ✅ Tested user registration, authentication, and role-based access control
  - ✅ Verified creator management, post creation, and content system functionality
  - ✅ Confirmed subscription system, payment tracking, and admin features working
  - ✅ Established stable development environment with proper error handling
  - ✅ Completed full-stack migration with client/server separation and security best practices
  - ✅ Updated mobile bottom navigation to optimize UX by removing Content menu and keeping Messages accessible
  - ✅ Fixed subscription tier performance display issue in creator dashboard
  - ✅ Resolved API data type conversion for subscriber counts and revenue calculations
  - ✅ Fixed Fan Dashboard and Manage Subscriptions page to fetch real subscription data
  - ✅ Corrected API route method call from getFanSubscriptions to getSubscriptions
  - ✅ Enhanced getSubscriptions storage method with proper joins for creator and tier data
  - ✅ Updated ManageSubscriptions component to fetch and display real subscription data
  - ✅ Added proper loading states and error handling for subscription data fetching
  - ✅ Completed successful migration with all core features working properly
- July 16, 2025. Enhanced bio text truncation system and completed Phase 2: Real-time Notification System
  - ✅ Successfully completed migration from Replit Agent to Replit environment
  - ✅ Fixed navigation bar avatar display inconsistencies across all components  
  - ✅ Implemented proper avatar URL handling for external URLs and uploaded files
  - ✅ Added graceful fallback to user initials when no avatar is available
  - ✅ Verified all core functionality working properly with PostgreSQL database
  - ✅ Fixed avatar display issue in navigation components
  - ✅ Updated avatar image handling to support both external URLs and uploaded files
  - ✅ Resolved inconsistent avatar property references across navigation bars
  - ✅ Completed migration from Replit Agent to Replit environment successfully
  - ✅ Updated BioDisplay component with click-to-expand functionality on truncated text
  - ✅ Added click-outside-to-collapse functionality for expanded bio text
  - ✅ Replaced old bio truncation logic in CreatorCard and CreatorProfile components
  - ✅ Enhanced CSS class filtering to properly display full text when expanded
  - ✅ Improved desktop bio truncation to show "read more" at end of second line
  - ✅ Added proper positioning for "read more" button using absolute positioning
  - ✅ Fixed creator dashboard subscription data display issue
  - ✅ Enhanced getCreatorSubscribers method with proper error handling and fallback queries
  - ✅ Added missing creator analytics API endpoint with real-time subscriber counts
  - ✅ Added creator goals API endpoint for dashboard metrics
  - ✅ Enhanced subscriber API with limit and recent filtering capabilities
  - ✅ Updated subscription creation to automatically maintain creator subscriber counts
  - ✅ Verified all subscription data displays correctly across dashboard, subscribers page
  - ✅ Fixed critical post fetching bug where published and draft posts were not displaying
  - ✅ Resolved incorrect Drizzle ORM query syntax in `/api/posts` endpoint
  - ✅ Enhanced SubscriberCard component with null safety for usernames and display names
  - ✅ Fixed "Cannot convert undefined or null to object" error in subscriber management
  - ✅ Fixed draft posts incorrectly showing on creator profile page
  - ✅ Updated post tier display to show correct subscription tier names instead of "Free" 
  - ✅ Enhanced tier mapping to handle actual subscription tier names (Starter Pump, Power Gains, Elite Beast Mode)
  - ✅ Creator profile now only shows published posts for public viewing, and earnings
  - ✅ Fixed Earnings Dashboard to replace mock data with authentic API calls
  - ✅ Updated Total Active Subscribers card to show real subscriber count from analytics API
  - ✅ Fixed Revenue Breakdown by Tier to display accurate subscription counts from tier performance data
  - ✅ Confirmed Payment Information section correctly fetches real earnings and payout data from database
  - ✅ Completed Phase 2: Real-time Notification System Implementation
  - ✅ Added WebSocket server integration with Express backend for real-time communication
  - ✅ Implemented WebSocket client service with automatic reconnection and authentication
  - ✅ Enhanced NotificationBell component with real-time WebSocket connectivity
  - ✅ Added browser push notification support with permission management
  - ✅ Implemented real-time notification broadcasting via NotificationService
  - ✅ Added connection status indicator (green dot) on notification bell
  - ✅ Created animated bell ring icon for new notification visual feedback
  - ✅ Added toast notifications for active users and push notifications for background users
  - ✅ Built comprehensive NotificationTester component for admin testing
  - ✅ Enhanced notification system with cache invalidation and real-time updates
  - ✅ Added test endpoints for real-time notification broadcasting and bulk testing
  - ✅ Verified WebSocket connections work successfully with automatic authentication
- July 17, 2025. Complete migration from Replit Agent to Replit environment and UI improvements
  - ✅ Successfully migrated from Replit Agent to standard Replit environment
  - ✅ Fixed database configuration to use standard PostgreSQL instead of Neon serverless
  - ✅ Configured proper TypeScript execution with tsx dependency
  - ✅ Pushed complete database schema to PostgreSQL production database
  - ✅ Verified all core functionality working: authentication, content management, subscriptions
  - ✅ Updated Schedule Content section layout to match Recent Posts horizontal compact design
  - ✅ Added media preview thumbnails, proper content details, and status icons to scheduled posts
  - ✅ Established proper client/server separation and security best practices
  - ✅ Completed comprehensive migration with all checklist items verified
- July 18, 2025. Final migration from Replit Agent to Replit environment completed
  - ✅ Successfully migrated from Replit Agent to standard Replit environment
  - ✅ Fixed JSX syntax errors in Messages.tsx component
  - ✅ Created and configured PostgreSQL database with proper environment variables
  - ✅ Pushed complete database schema to PostgreSQL production database using Drizzle migrations
  - ✅ Verified all database tables created successfully (users, posts, comments, subscriptions, etc.)
  - ✅ Fixed database initialization and resolved "relation does not exist" errors
  - ✅ Verified all core functionality working: authentication, content management, subscriptions
  - ✅ Established proper client/server separation and security best practices
  - ✅ Completed comprehensive migration with all checklist items verified
  - ✅ Application now running successfully on port 5000 with full database functionality
- July 19, 2025. Enhanced online status indicator implementation and final Replit Agent migration
  - ✅ Implemented green dot status indicator on profile avatars similar to social media platforms
  - ✅ Added dotOnly prop to OnlineStatusIndicator component for avatar-based status display
  - ✅ Positioned status dots at bottom-right edge of avatars with border and shadow styling
  - ✅ Applied status indicators to both large profile header avatar and smaller post avatars
  - ✅ Enhanced status indicator sizing system with appropriate dot sizes for different avatar sizes
  - ✅ Status indicators only show when user is online and has activity status visible in privacy settings
  - ✅ Successfully completed final migration from Replit Agent to standard Replit environment
  - ✅ Created and configured PostgreSQL database with proper environment variables
  - ✅ Fixed missing tsx dependency and package configuration issues
  - ✅ Pushed complete database schema using Drizzle migrations (db:push)
  - ✅ Verified all database tables created successfully and application fully functional
  - ✅ Established robust client/server separation with security best practices
  - ✅ Application running successfully on port 5000 with all features operational