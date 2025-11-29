import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then((c) => c.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((r) => r.homeRoutes),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((r) => r.profileRoutes),
      },
      {
        path: 'posts',
        loadChildren: () => import('./features/posts/posts.routes').then((r) => r.postRoutes),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then((r) => r.notificationRoutes),
      },
    ],
  },
  {
    path: 'admin',
   
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then((r) => r.adminRoutes),
      },
    ],
  },
  {
    path: '**',

    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((c) => c.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/not-found/not-found.component').then(
            (c) => c.NotFoundComponent
          ),
        title: '404 - Page Not Found',
      },
    ],
  },
];
