import { Component, OnInit } from "@angular/core";

import { BoardsService } from "src/app/shared/services/boards.service";
import { BoardsInterface } from "src/app/shared/types/board.interface";

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html'
})
export class BoardsComponent implements OnInit {
  boards: BoardsInterface[] = []

  constructor(private boardsService: BoardsService) { }

  ngOnInit(): void {
    // Get all Boars from backend
    this.boardsService.getBoards().subscribe({
      next: (res) => {
        // Assign boads array to global 'boards' varialbe
        this.boards = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Function to create new board
  createBoard(title: string) {
    this.boardsService.createBoard(title).subscribe({
      next: (createdBoard: BoardsInterface) => {
        // Push new board to existing boards list
        this.boards = [...this.boards, createdBoard]
      },
      error: (err) => {
        // Handle error
        console.log(err);
      }
    })
  }
}