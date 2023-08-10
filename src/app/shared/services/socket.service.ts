import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Socket, io } from "socket.io-client";
import { environment } from "src/environments/environment";

import { CurrentUserInterface } from "src/app/auth/types/current-user.interface";

@Injectable()
export class SocketService {
  socket: Socket | undefined;

  // Function to connect with servier => socket connection
  setUpsocketConnection(currentUser: CurrentUserInterface): void {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: currentUser.token,
      },
    })
  }

  // Function to disconnect socket
  disconnect() {
    // Make sure a connection exists
    if (!this.socket) {
      throw new Error('Socket connection  is not established');
    }

    // Dis connect from socket
    this.socket.disconnect();
  }

  // Function to emit socket events
  emit(eventName: string, message: any): void {
    // Make sure connection exists
    if (!this.socket) {
      throw new Error('Socket connection not established');
    }

    // Emit event
    this.socket.emit(eventName, message);
  }

  // Function to listen events
  listen<T>(eventName: string): Observable<T> {
    const socket = this.socket;

    // Make sure connection exists
    if (!socket) throw new Error('Socket connection is not established');

    // Return data as an observable
    return new Observable((subscriber) => {
      socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }
}
