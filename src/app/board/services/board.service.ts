import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { SocketService } from "src/app/shared/services/socket.service";
import { BoardsInterface } from "src/app/shared/types/board.interface";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { SocketEventsEnum } from "src/app/shared/types/socket-events.enum";

@Injectable()
export class BoardService {
  // Create a behavior subject to share the board details
  board$ = new BehaviorSubject<BoardsInterface | null>(null);

  // Create a behavior subject to share columns
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);

  constructor(private socketService: SocketService) { }

  // Function to share board details to every subscribed components
  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }

  // Functon to set columns
  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  // Function to leave group.
  // streem null to every subscribers. (because user leave the board)
  leaveBoard(boardId: string): void {
    // Emit null (reset selected board)
    this.board$.next(null);

    // Inform backend that user leave the room
    this.socketService.emit(
      SocketEventsEnum.boardsLeave,
      {
        boardId
      }
    )
  }
}