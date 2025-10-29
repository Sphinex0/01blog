// import { Injectable, inject } from '@angular/core';
// import { Client, IMessage } from '@stomp/stompjs';
// import { Subject } from 'rxjs';
// import { AuthService } from './auth.service';
// import { WS_BASE_URL } from '../constants/api.constants';
// import { Notification } from '../models/notification.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private readonly authService = inject(AuthService);
//   private stompClient: Client;
  
//   private newPostSubject = new Subject<Notification>();
//   public newPost$ = this.newPostSubject.asObservable();

//   // UPDATED: Subscribe to the user-specific queue instead of a public topic
//   private readonly newPostTopic = '/user/queue/new-posts'; 

//   constructor() {
//     this.stompClient = new Client({
//       brokerURL: WS_BASE_URL,
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       connectHeaders : {
//             Authorization: `Bearer ${this.authService.getToken()}`
//           },
//     });

//     this.stompClient.onConnect = (frame) => {
//       console.log('STOMP Connected: ' + frame);

//       // The subscription URL is now correctly pointed at the user's private queue
//       this.stompClient.subscribe(this.newPostTopic, (message: IMessage) => {
//         try {
//           const notification: Notification = JSON.parse(message.body);
//           this.newPostSubject.next(notification);
//         } catch (e) {
//           console.error('Error parsing WebSocket message:', e);
//         }
//       });
//     };

//     this.stompClient.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };
//   }

//   connect(): void {
//     if (!this.stompClient.active) {
//       this.stompClient.activate();
//     }
//   }

//   disconnect(): void {
//     if (this.stompClient.active) {
//       this.stompClient.deactivate();
//     }
//   }
// }