import { Routes } from '@angular/router';

export const postRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        loadComponent: () => {
          console.log('loading feed');
          return import('./components/post-create/post-create.component').then(
            (c) => c.PostCreateComponent
          );
        },
        title: '01Blog - feed',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../posts/components/post-detail/post-detail.component').then(
            (c) => c.PostDetailComponent
          ),
        title: '01Blog - Post',
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/post-create/post-create.component').then(
            (c) => c.PostCreateComponent
          ),
        title: '01Blog - Post',
      },
    ],
  },
];
