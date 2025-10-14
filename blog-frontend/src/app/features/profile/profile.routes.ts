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
        title: '01Blog - users feed',
      },
    ],
  },

  {
    path: 'profile',
    children: [
      // {
      //   path: 'me',
      //   loadComponent: () =>
      //     import('./components/profile/profile.component').then((c) => c.ProfileComponent),
      //   title: '01Blog - My Profile',
      // },
      {
        path: 'edit',
        loadComponent: () =>
          import('./components/profile-edit/profile-edit.component').then(
            (c) => c.ProfileEditComponent
          ),
        title: '01Blog - Edit Profile',
      },
      {
        path: ':username',
        loadComponent: () =>
          import('./components/profile/profile.component').then((c) => c.ProfileComponent),
        title: '01Blog - Profile',
      },
      {
        path: ':username/followers',
        loadComponent: () =>
          import('./components/followers-list/followers-list.component').then(
            (c) => c.FollowersListComponent
          ),
        title: '01Blog - Followers',
      },
      {
        path: ':username/following',
        loadComponent: () =>
          import('./components/following-list/following-list.component').then(
            (c) => c.FollowingListComponent
          ),
        title: '01Blog - Following',
      },
    ],
  },
];
