import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './features/settings/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);
  
  title = 'Pixel Blog';

  ngOnInit(): void {
    // Theme service will auto-initialize
  }
}

// // src/app/app.component.ts
// import { Component, OnInit } from '@angular/core';
// import { WebSocketService } from './core/services/websocket.service';
// // import { WebSocketService } from './websocket.service';

// @Component({
//   selector: 'app-root',
//   template: `
//     <div>
//       <button (click)="connect()">Connect</button>
//       <button (click)="disconnect()">Disconnect</button>
//     </div>
//     <div>
//       <label for="name">Name:</label>
//       <input id="name" [value]="name" (input)="name = $any($event.target).value" placeholder="Enter your name">
//       <button (click)="send()">Send Message</button>
//     </div>
//     <div>
//       <h3>Messages Received:</h3>
//       <p>{{ receivedMessage }}</p>
//     </div>
//   `
// })
// export class App implements OnInit {
//   name: string = '';
//   receivedMessage: string = '';

//   constructor(private wsService: WebSocketService) {}

//   ngOnInit() {
//     // Subscribe to the messages BehaviorSubject from the service
//     this.wsService.messages.subscribe((message) => {
//       this.receivedMessage = message;
//     });
//   }

//   connect() {
//     this.wsService.connect();
//   }

//   disconnect() {
//     this.wsService.disconnect();
//   }

//   send() {
//     if (this.name) {
//       this.wsService.sendMessage(this.name);
//     }
//   }
// }