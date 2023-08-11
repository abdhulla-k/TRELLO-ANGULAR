import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { SocketService } from "src/app/shared/services/socket.service";
import { BoardsInterface } from "src/app/shared/types/board.interface";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { SocketEventsEnum } from "src/app/shared/types/socket-events.enum";
import { TaskInterface } from "src/app/shared/types/task.interface";

@Injectable()
export class BoardService {
  // Create a behavior subject to share the board details
  board$ = new BehaviorSubject<BoardsInterface | null>(null);

  // Create a behavior subject to share columns
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);

  // Create a behavior subject to share tasks
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  constructor(private socketService: SocketService) { }

  // Function to share board details to every subscribed components
  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }

  // Functon to set columns
  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  // Function to set tasks in streem
  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks);
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

  // Function to add newlly created column's details to existing array
  addColumn(column: ColumnInterface): void {
    // Get existing columns array from streem
    const updateColumns = [...this.columns$.getValue(), column];

    // Update the columns with create array
    this.columns$.next(updateColumns);
  }

  // Function to add newlly created task's details to existing array
  addTask(task: TaskInterface): void {
    // Get existing tasks array from streem
    const updatedTasks = [...this.tasks$.getValue(), task];

    // Update the task with create array
    this.tasks$.next(updatedTasks);
  }
}