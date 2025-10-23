import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="admin-layout-container">
      <mat-sidenav mode="side" opened class="admin-sidenav">
        <div class="sidenav-header">
          <h2>👑 ADMIN</h2>
        </div>
        <mat-nav-list class="admin-nav">
          <a mat-list-item routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Users</span>
          </a>
          <a mat-list-item routerLink="/admin/posts" routerLinkActive="active">
            <mat-icon>article</mat-icon>
            <span>Posts</span>
          </a>
          <a mat-list-item routerLink="/admin/reports" routerLinkActive="active">
            <mat-icon>flag</mat-icon>
            <span>Reports</span>
          </a>
          <a mat-list-item routerLink="/admin/analytics" routerLinkActive="active">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </a>
          <mat-divider></mat-divider>
          <a mat-list-item routerLink="/" class="back-to-site">
            <mat-icon>home</mat-icon>
            <span>Back to Site</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="admin-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-layout-container {
      height: 100vh;
      background: var(--pixel-bg-primary);
    }

    .admin-sidenav {
      width: 280px;
      background: var(--pixel-bg-secondary);
      border-right: 4px solid var(--pixel-border);
      box-shadow: 4px 0 0 var(--pixel-shadow);
    }

    .sidenav-header {
      padding: 2rem 1rem;
      text-align: center;
      background: var(--pixel-primary);
      border-bottom: 3px solid var(--pixel-border);

      h2 {
        margin: 0;
        font-family: 'Press Start 2P', cursive;
        font-size: 16px;
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
    }

    .admin-nav {
      padding: 1rem 0;

      a {
        font-family: 'Press Start 2P', cursive;
        font-size: 10px;
        text-transform: uppercase;
        margin: 0.5rem 1rem;
        padding: 12px 16px;
        border: 2px solid transparent;
        transition: all 0.1s ease;

        mat-icon {
          margin-right: 12px;
        }

        &:hover {
          background: var(--pixel-bg-tertiary);
          border-color: var(--pixel-border);
        }

        &.active {
          background: var(--pixel-primary);
          color: white;
          border-color: var(--pixel-primary-dark);
          box-shadow: 3px 3px 0 var(--pixel-shadow);
        }

        &.back-to-site {
          color: var(--pixel-secondary);

          &:hover {
            background: var(--pixel-secondary);
            color: var(--pixel-text-primary);
          }
        }
      }
    }

    .admin-content {
      overflow-y: auto;
    }

    mat-divider {
      margin: 1rem 0;
      border-color: var(--pixel-border);
      border-width: 2px;
    }

    @media (max-width: 768px) {
      .admin-sidenav {
        width: 100%;
      }
    }
  `]
})
export class AdminLayoutComponent {}