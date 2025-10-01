import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from '../feed/feed.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SidebarComponent, FeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}