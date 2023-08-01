import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BoardsInterface } from "src/app/shared/types/board.interface";

@Injectable()
export class BoardService {
  // Create a behavior subject to share the board details
  board$ = new BehaviorSubject<BoardsInterface | null>(null);

  // Function to share board details to every subscribed components
  setBoard(board: BoardsInterface): void {
    this.board$.next(board);
  }
}