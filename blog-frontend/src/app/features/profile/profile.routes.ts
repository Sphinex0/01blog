import { Routes } from '@angular/router';
// import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => {
          console.log('loading users feed');
          return import('./components/discover-users/discover-users.component').then(
            (c) => c.DiscoverUsersComponent
          );
        },
        title: '01Blog - feed',
      },
    ],
  },
];
