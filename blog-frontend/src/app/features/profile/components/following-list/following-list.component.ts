import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../services/profile.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { ProfileUsersComponent } from "../profile-users/profile-users.component";

@Component({
  selector: 'app-following-list',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    ProfileUsersComponent
],
  templateUrl: './following-list.component.html',
  styleUrl: './following-list.component.scss'
})
export class FollowingListComponent  {

}