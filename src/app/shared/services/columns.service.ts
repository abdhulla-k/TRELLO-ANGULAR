import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ColumnInterface } from "../types/column.interface";
import { ColumnInputInterface } from "../types/column-input.interface";
import { SocketService } from "./socket.service";
import { SocketEventsEnum } from "../types/socket-events.enum";

@Injectable()
export class ColumnsService {
  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  // Function to get columns
  getColumns(boardId: string): Observable<ColumnInterface[]> {
    // Create url
    const url = `${environment.url}/boards/${boardId}/columns`;

    // Fetch columns from back end and return observable back
    return this.http.get<ColumnInterface[]>(url);
  }

  // Function to create column
  createColumn(columnInput: ColumnInputInterface): void {
    // Emint data to bacck end
    this.socketService.emit(
      SocketEventsEnum.columnsCreate,
      columnInput
    )
  }

  // Function to delete column
  deleteColumn(columnId: string, boardId: string): void {
    this.socketService.emit(
      SocketEventsEnum.columnsDelete,
      {
        columnId,
        boardId
      },
    )
  }
}