import { Injectable, inject } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { WS_BASE_URL } from '../constants/api.constants';
import { Notification } from '../models/notification.interface';




@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly authService = inject(AuthService);
  private stompClient: Client;
  
  // This subject will emit the full Notification object
  private newPostSubject = new Subject<Notification>();
  public newPost$ = this.newPostSubject.asObservable();

  private readonly newPostTopic = '/topic/new-posts'; 

  constructor() {
    this.stompClient = new Client({
      brokerURL: WS_BASE_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // --- CORRECTED IMPLEMENTATION ---
      // Use the 'beforeConnect' hook to dynamically set headers just before connecting.
      beforeConnect: () => {
        const token = this.authService.getToken();
        if (token) {
          // The backend (Spring Security) typically checks the Authorization header
          this.stompClient.connectHeaders = {
            Authorization: `Bearer ${token}`
          };
        }
      },
    });

    // --- Connection Handler ---
    this.stompClient.onConnect = (frame) => {
      console.log('STOMP Connected: ' + frame);

      // Subscribe to the new posts topic
      this.stompClient.subscribe(this.newPostTopic, (message: IMessage) => {
        try {
          // Parse the message body directly into the Notification model
          const notification: Notification = JSON.parse(message.body);
          this.newPostSubject.next(notification);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      });
    };

    // --- Error Handler ---
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
  }

  /**
   * Activates the STOMP connection.
   */
  connect(): void {
    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  /**
   * Deactivates the STOMP connection.
   */
  disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}