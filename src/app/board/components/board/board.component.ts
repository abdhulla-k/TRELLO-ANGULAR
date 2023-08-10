import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";

import { BoardsService } from "src/app/shared/services/boards.service";
import { BoardService } from "../../services/board.service";
import { SocketService } from "src/app/shared/services/socket.service";
import { Observable, combineLatest, filter, map } from "rxjs";
import { BoardsInterface } from "src/app/shared/types/board.interface";
import { SocketEventsEnum } from "src/app/shared/types/socket-events.enum";
import { ColumnsService } from "src/app/shared/services/columns.service";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { ColumnInputInterface } from "src/app/shared/types/column-input.interface";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: BoardsInterface,
    columns: ColumnInterface[],
  }>;

  constructor(
    private boardsService: BoardsService,
    private activatedRoute: ActivatedRoute,
    private boardService: BoardService,
    private socketService: SocketService,
    private router: Router,
    private columnsService: ColumnsService,
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
    ]).pipe(
      map(([board, columns]) => ({
        board,
        columns,
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
}
