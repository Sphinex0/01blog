import { Component } from '@angular/core';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-home',
  imports: [FeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
