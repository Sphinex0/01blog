import { Routes } from '@angular/router';
// import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const homeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => {
          return import('./components/home/home.component').then((c) => c.HomeComponent);
        },
        title: '01Blog - feed',
      },
    ],
  },
];
