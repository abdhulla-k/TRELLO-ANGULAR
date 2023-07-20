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
}