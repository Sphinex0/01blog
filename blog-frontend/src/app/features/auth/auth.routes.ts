import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  // The default path for '/auth' now directly redirects to '/auth/login'.
  // There is no guard on this redirect path.
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'login',
    // The guard is now directly on the component route.
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    title: '01Blog - Login'
  },
  {
    path: 'register',
    // The guard is also here.
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
    title: '01Blog - Register'
  },
  {
    path: 'forgot-password',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/forgot-password/forgot-password').then(c => c.ForgotPassword),
    title: '01Blog - Forgot Password'
  }
];