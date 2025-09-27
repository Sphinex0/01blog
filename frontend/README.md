# 01Blog - Social Learning Platform

A modern social blogging platform built with Angular and Spring Boot, designed for students to share their learning journey, discoveries, and progress.

## 🚀 Features

### User Features
- **Authentication**: Secure user registration, login, and profile management
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
- **Analytics**: Basic platform statistics and insights

## 🛠️ Tech Stack

### Frontend
- **Angular 17+** with standalone components
- **TypeScript** with strict typing
- **SCSS** for styling
- **Angular Signals** for state management
- **Angular Material** or **Bootstrap** for UI components
- **PWA** support for mobile experience

### Architecture
- **Feature-based structure** for scalability
- **Lazy loading** for optimal performance
- **Signal-based state management**
- **Reactive forms** for user input
- **OnPush change detection** strategy
- **Modern Angular patterns** (inject(), control flow, etc.)

## 📁 Project Structure

```
src/app/
├── core/                 # Singleton services, guards, interceptors
├── shared/               # Reusable components, pipes, directives
├── features/             # Feature modules (auth, home, posts, etc.)
├── layout/              # Layout components (main, admin, auth)
└── assets/              # Static assets and styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Update `src/environments/environment.ts` with your backend API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     // ... other config
   };
   ```

4. **Run the development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production configuration
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run linting
- `npm run lint:fix` - Fix linting issues
- `npm run analyze` - Analyze bundle size

## 🎨 Styling

The project uses a custom SCSS architecture with:
- **CSS Custom Properties** for theming
- **SCSS mixins** for reusable styles
- **Responsive breakpoints** for mobile-first design
- **Dark/Light theme** support
- **Utility classes** for common styling patterns

## 🛡️ Security

- **JWT-based authentication**
- **Route guards** for access control
- **Input validation** and sanitization
- **CSRF protection**
- **Role-based access control** (User/Admin)

## 📱 Progressive Web App

The app includes PWA features:
- **Service Worker** for offline functionality
- **App manifest** for installability
- **Caching strategies** for better performance
- **Push notifications** (optional)

## 🧪 Testing

The project includes:
- **Unit tests** with Jasmine and Karma
- **Component testing** with Angular Testing Utilities
- **Service testing** with HTTP testing
- **E2E testing** setup (Cypress/Protractor)

## 🚀 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy to Static Hosting
The built files in `dist/blog-frontend/` can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

### Docker Support
```dockerfile
FROM nginx:alpine
COPY dist/blog-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Angular Material/Bootstrap for UI components
- Community contributors and testers

---

**Happy Coding! 🚀**
