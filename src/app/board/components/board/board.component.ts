import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { Observable, Subject, combineLatest, filter, map, takeUntil } from "rxjs";

import { BoardsService } from "src/app/shared/services/boards.service";
import { BoardService } from "../../services/board.service";
import { SocketService } from "src/app/shared/services/socket.service";
import { BoardsInterface } from "src/app/shared/types/board.interface";
import { SocketEventsEnum } from "src/app/shared/types/socket-events.enum";
import { ColumnsService } from "src/app/shared/services/columns.service";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { ColumnInputInterface } from "src/app/shared/types/column-input.interface";
import { TasksService } from "src/app/shared/services/tasks.service";
import { TaskInterface } from "src/app/shared/types/task.interface";
import { TaskInputInterface } from "src/app/shared/types/task-input.interface";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  data$: Observable<{
    board: BoardsInterface,
    columns: ColumnInterface[],
    tasks: TaskInterface[],
  }>;

  unsubscritbe$ = new Subject<void>()

  constructor(
    private boardsService: BoardsService,
    private activatedRoute: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private router: Router,
    private columnsService: ColumnsService,
    private tasksService: TasksService
  ) {
    // Get board id from url
    const boardId = this.activatedRoute.snapshot.paramMap.get('boardId');

    // Throw an error if id not recieved
    if (!boardId) throw new Error("Can't get boardID from url");

    // Assign board id
    this.boardId = boardId;

    // Set a streem to handle multple observables data
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks,
      }))
    )
  }

  ngOnInit(): void {
    // Emit a connection event in socket.io
    this.socketService.emit(
      SocketEventsEnum.boardsJoin,
      {
        boardId: this.boardId,
      }
    )

    // Get board details
    this.fetchData();

    // call initializer function for listening to route changes to leave board
    this.initializeListeners();
  }

  // Functon to lisen is navigating out from this route to leave board
  initializeListeners(): void {
    this.router.events.subscribe({
      next: (event) => {
        // If navigation out from current route. (that means leaving the board)
        if (event instanceof NavigationStart) {
          // set board as null in behavior subject in board service
          this.boardService.leaveBoard(this.boardId);
        }
      }
    })

    // Call listener function to listen column creation event
    this.socketService.listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      })

    // Call listener function to listen task creation event
    this.socketService.listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe({
        next: (task) => {
          this.boardService.addTask(task);
        }
      })

    // Call listener function to listen update board event
    this.socketService.listen<BoardsInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe({
        next: (updatedBoard) => {
          this.boardService.updateBoard(updatedBoard);
        }
      })

    // Listen for delte board event
    this.socketService.listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/boards');
        }
      })

    // Listen for delete column
    this.socketService.listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe({
        next: (columnId: string) => {
          this.boardService.deleteColumn(columnId);
        }
      })

    // Listen for update column event
    this.socketService.listen<ColumnInterface>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscritbe$))
      .subscribe({
        next: (updatedColumn) => {
          this.boardService.updateColumn(updatedColumn);
        }
      })
  }

  // Function to get board details by id
  fetchData(): void {
    // call get board function to get board details from backend
    this.boardsService.geBoard(this.boardId).subscribe({
      next: (board) => {
        // Set the board details to board service. (to behavioral subject)
        this.boardService.setBoard(board);
      }
    })

    // Fetch collumns
    this.columnsService.getColumns(this.boardId).subscribe({
      next: (columns: ColumnInterface[]) => {
        this.boardService.setColumns(columns);
      }
    })

    // Fetch tasks
    this.tasksService.getTasks(this.boardId).subscribe({
      next: (tasks: TaskInterface[]) => {
        this.boardService.setTasks(tasks);
      }
    })
  }

  // Function to create column
  createColumn(title: string): void {
    // Get column data to create column
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    }

    // Send the data through socket io
    this.columnsService.createColumn(columnInput);
  }

  // Function to create Task
  createTask(title: string, columnId: string): void {
    // Set a variable with all required data
    const taskInput: TaskInputInterface = {
      title,
      columnId,
      boardId: this.boardId,
    }

    // Send the data to create function in service
    this.tasksService.createTask(taskInput);
  }

  // Function to filter task by board id
  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    // Returned filtered update
    return tasks.filter((task) => columnId === task.columnId)
  }

  // Function to update board name
  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(
      this.boardId,
      { title: boardName },
    )
  }

  // Function to delte board
  deleteBoard(): void {
    if (confirm('Are you sure you want to delete the board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }

  // Function to update column
  updateColumn(columnTitle: string, columnId: string): void {
    this.columnsService.updateColumn(
      this.boardId,
      columnId,
      {
        title: columnTitle,
      }
    )
  }

  // Function to delete column
  deleteColumn(columnId: string) {
    if (confirm('Are you sure you want to delete the column?')) {
      this.columnsService.deleteColumn(
        columnId,
        this.boardId,
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscritbe$.next()
    this.unsubscritbe$.complete();
  }
}
