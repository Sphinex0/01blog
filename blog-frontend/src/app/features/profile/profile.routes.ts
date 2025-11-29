import { Routes } from '@angular/router';

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
