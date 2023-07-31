import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { BoardsService } from "src/app/shared/services/boards.service";
import { BoardsInterface } from "src/app/shared/types/board.interface";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardDetails!: BoardsInterface;
  boardId: string;

  constructor(
    private boardsService: BoardsService,
    private activatedRoute: ActivatedRoute,
  ) {
    // Get board id from url
    const boardId = this.activatedRoute.snapshot.paramMap.get('boardId');

    // Throw an error if id not recieved
    if(!boardId) throw new Error("Can't get boardID from url");

    // Assign board id
    this.boardId = boardId;
  }

  ngOnInit(): void {
    // Get board details
    this.fetchData();
  }

  // Function to get board details by id
  fetchData(): void {
    // call get board function to get board details from backend
    this.boardsService.geBoard(this.boardId).subscribe({
      next: (res) => {
        this.boardDetails = res;
      }
    })
  }
}
