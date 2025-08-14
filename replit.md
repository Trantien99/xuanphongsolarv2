# Xuân Phong Solar - Visual Product Discovery Platform

## Overview

Xuân Phong Solar is a B2B e-commerce platform designed for industry professionals to discover and purchase industrial products. The application features advanced visual search capabilities, allowing users to upload photos or sketches to find matching products using AI-powered image recognition. The platform serves various industrial categories including power tools, safety equipment, machinery, electronics, materials, and hand tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Development**: Hot reloading with custom Vite integration

### Database Design
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**:
  - `users`: User authentication and profile data
  - `categories`: Hierarchical product categorization with slugs and icons
  - `products`: Comprehensive product catalog with images, specifications, and inventory
  - `news`: Content management for industry news and updates
  - `cart_items`: Shopping cart functionality with session-based storage

### Component Architecture
- **Design System**: Consistent component library with variant-based styling using class-variance-authority
- **Layout Components**: Header with search, navigation, and cart; Footer with links and company info
- **Feature Components**: 
  - Visual search modal with camera integration
  - Product grid with filtering and pagination
  - Shopping cart with sidebar and context management
  - Responsive design with mobile-first approach

### State Management Strategy
- **Server State**: TanStack Query for API calls, caching, and synchronization
- **Client State**: React Context for cart management and user preferences
- **Form State**: React Hook Form for complex form handling with validation
- **URL State**: Query parameters for search filters and pagination

### Authentication & Authorization
- **Session-based Authentication**: Server-side session management with secure cookies
- **User Registration**: Username/email with encrypted password storage
- **Cart Persistence**: Session-based cart storage that persists across browser sessions

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **Development**: TSX for TypeScript execution, Replit-specific Vite plugins

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

### Database and Backend
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for schema validation across client and server
- **Session Store**: connect-pg-simple for PostgreSQL session storage

### Additional Features
- **Date Handling**: date-fns for date manipulation and formatting
- **Visual Search**: Native browser APIs for camera access and canvas manipulation
- **Carousel**: Embla Carousel for image galleries and product showcases
- **Command Interface**: cmdk for search and command palette functionality

### Development and Deployment
- **Environment**: Designed for Replit deployment with specific configurations
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript strict mode, ESLint configuration ready
- **Performance**: Code splitting, lazy loading, and optimized asset bundling