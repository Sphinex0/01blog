import { Routes } from '@angular/router';

export const notificationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/notification-list/notification-list.component').then(c => c.NotificationListComponent),
    title: '01Blog - Notifications'
  }
];