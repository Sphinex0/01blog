# 01Blog - Social Learning Platform

A modern social blogging platform built with **Angular 20** and **Spring Boot**, designed for students to share their learning journey, discoveries, and progress.

## 🚀 Features

### User Features
- **Authentication**: Secure registration, login with JWT tokens
- **Personal Block Page**: User profiles with post management and subscription system
- **Posts**: Create, edit, delete posts with media support (images/videos)  
- **Social Interaction**: Like, comment, and subscribe to other users
- **Feed**: Personalized home feed with posts from subscribed users
- **Notifications**: Real-time updates for new posts, likes, and comments
- **Reporting**: Report inappropriate content or users

### Admin Features
- **User Management**: View, ban, and manage all users
- **Content Moderation**: Remove inappropriate posts and content
- **Report Management**: Handle user reports and take appropriate actions
- **Analytics**: Platform statistics and insights

## 🛠️ Tech Stack

### Frontend (Angular 20)
- **Angular 20** with standalone components
- **TypeScript** with strict typing
- **Angular Material** for UI components
- **SCSS** for styling with custom theme system
- **Angular Signals** for reactive state management
- **Zoneless Change Detection** for better performance
- **PWA** support for mobile experience
- **Modern Angular patterns**: `inject()`, control flow, component input binding

## 📁 Project Architecture

```
src/app/
├── core/                 # Singleton services, guards, interceptors
│   ├── guards/          # Auth, admin, no-auth guards
│   ├── interceptors/    # Auth, error, loading interceptors
│   ├── services/        # Auth, storage, notification services
│   ├── models/          # TypeScript interfaces
│   └── constants/       # API endpoints, app constants
├── shared/              # Reusable components, pipes, directives
│   ├── components/      # Header, footer, loading spinner, etc.
│   ├── pipes/           # Time ago, safe HTML, truncate
│   ├── directives/      # Auto-resize, infinite scroll
│   └── validators/      # Custom form validators
├── features/            # Feature modules
│   ├── auth/           # Login, register
│   ├── home/           # Dashboard, feed, sidebar
│   ├── posts/          # CRUD operations, comments, media
│   ├── profile/        # User profiles, followers, following
│   ├── notifications/  # Notification management
│   ├── reporting/      # Report content and users
│   ├── admin/          # Admin panel and management
│   └── settings/       # App settings, theme toggle
├── layout/             # Layout components
│   ├── main-layout/    # Authenticated user layout
│   ├── admin-layout/   # Admin panel layout
│   └── auth-layout/    # Authentication pages layout
└── assets/             # Static assets, styles, images
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Angular CLI** (`npm install -g @angular/cli@latest`)

### Installation

1. **Generate the project structure**
   ```bash
   chmod +x generate-01blog-structure.sh
   ./generate-01blog-structure.sh
   ```

2. **Navigate to project**
   ```bash
   cd blog-frontend
   ```

3. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

4. **Environment Configuration**
   
   Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     // ... other config
   };
   ```

5. **Start development server**
   ```bash
   ng serve
   ```

6. **Open browser**
   ```
   http://localhost:4200
   ```

## 🔧 Available Scripts

```bash
# Development
npm start                 # Start development server
ng serve --open          # Start with auto-open browser

# Building  
npm run build            # Build for production
npm run build:prod       # Build with production config
npm run build:staging    # Build with staging config

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI/CD

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Analysis
npm run analyze          # Analyze bundle size
npm run serve:pwa        # Test PWA build locally

# Dependencies
npm run update:deps      # Update Angular dependencies
```

## 🎨 Styling & Theming

### SCSS Architecture
```scss
src/assets/styles/
├── _variables.scss      # Colors, typography, spacing
├── _mixins.scss         # Reusable mixins  
├── _themes.scss         # Light/dark themes
├── _components.scss     # Component-specific styles
└── _utilities.scss      # Utility classes
```

### Theme Support
- **Light/Dark themes** with CSS custom properties
- **Angular Material theming** integration
- **Responsive design** with mobile-first approach
- **Custom color palette** and typography

## 🛡️ Security Features

- **Route Guards** for access control (auth, admin, no-auth)
- **HTTP Interceptors** for automatic token attachment
- **Input Validation** with custom validators
- **Role-based Access Control** (User/Admin)
- **CSRF Protection** ready
- **Secure Storage** for sensitive data

## 🚀 Angular 20 Features

### Modern Architecture
- **Zoneless Change Detection** for better performance
- **Standalone Components** (no NgModules)
- **Signals** for reactive state management
- **Control Flow** syntax (`@if`, `@for`, `@switch`)
- **Component Input Binding** for route parameters

### Performance Optimizations
- **Lazy Loading** for all feature modules
- **OnPush Change Detection** strategy
- **Tree-shaking** with standalone components  
- **Bundle Splitting** for optimal loading
- **Service Worker** for caching and offline support

### Developer Experience
- **inject()** function for dependency injection
- **Functional Guards and Interceptors**
- **Type-safe Routing** with route parameters
- **Built-in Control Flow** syntax
- **Improved DevTools** support

## 📱 Progressive Web App

### PWA Features
- **Service Worker** for offline functionality
- **App Manifest** for installability
- **Caching Strategies** for better performance
- **Push Notifications** (configurable)
- **Responsive Design** for all screen sizes

## 🧪 Testing Strategy

### Unit Testing
- **Jasmine** and **Karma** for unit tests
- **Angular Testing Utilities** for component testing
- **Signal Testing** with Angular 20 patterns
- **HTTP Testing** for service mocking

### E2E Testing
- **Cypress** or **Playwright** setup ready
- **Page Object Pattern** for maintainable tests
- **CI/CD Integration** ready

## 🚀 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy Options
- **Netlify**: Drag and drop `dist/blog-frontend/`
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: Static hosting
- **Docker**: Container-ready

### Docker Support
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/blog-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔄 API Integration

### Backend Configuration
```typescript
// API Base URL
const API_BASE_URL = 'http://localhost:8080/'
```
