import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        title: '01Blog - Admin Dashboard'
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/user-management/user-management').then((c) => c.UserManagement),
        title: '01Blog - User Management'
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./components/post-management/post-management').then((c) => c.PostManagement),
        title: '01Blog - Post Management'
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./components/report-management/report-management').then((c) => c.ReportManagement),
        title: '01Blog - Report Management'
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./components/analytics/analytics').then((c) => c.Analytics),
        title: '01Blog - Analytics'
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];