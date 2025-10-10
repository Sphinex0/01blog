import { Routes } from '@angular/router';
import { PostCreateComponent } from './components/post-create/post-create.component';
// import { noAuthGuard } from '../../core/guards/no-auth.guard';

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
      //   {
      //     path: 'forgot-password',
      //     loadComponent: () => import('./components/forgot-password/forgot-password').then(c => c.ForgotPassword),
      //     title: '01Blog - Forgot Password'
      //   },
      //   {
      //     path: '',
      //     redirectTo: 'login',
      //     pathMatch: 'full'
      //   }
    ],
  },
];
