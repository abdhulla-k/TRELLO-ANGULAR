import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ColumnInterface } from "../types/column.interface";

@Injectable()
export class ColumnsService {
  constructor(private http: HttpClient) { }

  // Function to get columns
  getColumns(boardId: string): Observable<ColumnInterface[]> {
    // Create url
    const url = `${environment.url}/boards/${boardId}/columns`;

    // Fetch columns from back end and return observable back
    return this.http.get<ColumnInterface[]>(url);
  }
}