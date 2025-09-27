import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    title: '01Blog - My Profile'
  },
  {
    path: 'edit',
    loadComponent: () => import('./components/profile-edit/profile-edit.component').then(c => c.ProfileEditComponent),
    title: '01Blog - Edit Profile'
  },
  {
    path: ':username',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    title: '01Blog - User Profile'
  }
];
