import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(c => c.Login),
        title: '01Blog - Login'
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
        title: '01Blog - Register'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password').then(c => c.ForgotPassword),
        title: '01Blog - Forgot Password'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
