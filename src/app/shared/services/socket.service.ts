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
}
