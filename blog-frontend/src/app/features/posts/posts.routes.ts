import { Routes } from '@angular/router';
// import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const postRoutes: Routes = [
    {
        path: '',
        children: [
              {
                path: 'create',
                loadComponent: () => {
                    console.log("loading feed");
                    return import('./components/post-create/post-create.component').then(c => c.PostCreateComponent);
                },
                title: '01Blog - feed'
              },
            //   {
            //     path: 'register',
            //     loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
            //     title: '01Blog - Register'
            //   },
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
        ]
    }
];
