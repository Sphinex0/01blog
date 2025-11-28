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
        path: '**',
        redirectTo: ''
      }
    ]
  }
];