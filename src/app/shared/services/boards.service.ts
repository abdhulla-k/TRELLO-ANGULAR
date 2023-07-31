import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BoardsInterface } from "../types/board.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class BoardsService {
  constructor(private http: HttpClient) { }

  // Function to get boards list
  getBoards(): Observable<BoardsInterface[]> {
    return this.http.get<BoardsInterface[]>(`${environment.url}/boards`)
  }

  // Function to get board details by id
  geBoard(boardId: string): Observable<BoardsInterface> {
    const url = `${environment.url}/boards/${boardId}`;
    return this.http.get<BoardsInterface>(url);
  }

  // Function to create a board
  createBoard(title: string): Observable<BoardsInterface> {
    return this.http.post<BoardsInterface>(
      `${environment.url}/boards`,
      { title }
    )
  }
}