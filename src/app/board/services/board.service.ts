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

  // Function to update board details when emitting updation event
  updateBoard(updatedBoard: BoardsInterface): void {
    // Make sure already exist a board data
    const board = this.board$.getValue();

    if (!board) throw new Error('Board is not initialized');

    // Send new data to subscribers
    this.board$.next({ ...board, title: updatedBoard.title });
  }

  // Function to update column
  updateColumn(updatedColumn: ColumnInterface): void {
    // Change the title of update column
    const arrUpdatedColumns = this.columns$.getValue()
      .map((column) => {
        // Return updated colum if id match
        if (column._id === updatedColumn._id) {
          return { ...column, title: updatedColumn.title }
        }
        return column;
      })

    // Change existing array with updated array
    this.columns$.next(arrUpdatedColumns);
  }

  // Function to remove deleted comums from existing array
  deleteColumn(columnId: string): void {
    // Filter existing comumns
    const updatedColumn = this.columns$
      .getValue()
      .filter((column) => column._id !== columnId);

    // Update filtered columns
    this.columns$.next(updatedColumn);
  }

  // Function to update task
  updateTasks(updatedTask: TaskInterface): void {
    // Change the title of update task
    const arrUpdatedTasks = this.tasks$.getValue()
      .map((task) => {
        // Return updated colum if id match
        if (task._id === updatedTask._id) {
          return { ...task, ...updatedTask }
        }
        return task;
      })

    // Change existing array with updated array
    this.tasks$.next(arrUpdatedTasks);
  }
}