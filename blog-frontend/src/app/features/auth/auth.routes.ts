import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [

  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    title: '01Blog - Login'
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
    title: '01Blog - Register'
  }
];