import { Injectable } from "@angular/core";
import { Socket, io } from "socket.io-client";

import { CurrentUserInterface } from "src/app/auth/types/current-user.interface";
import { environment } from "src/environments/environment";

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
}
