import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { TaskInterface } from "../types/task.interface";
import { Observable } from "rxjs";

@Injectable()
export class TasksService {
  constructor(
    private http: HttpClient
  ) { }

  // Function to get tasks
  getTasks(boardId: String): Observable<TaskInterface[]> {
    // Create url to send request
    const url = `${environment.url}/boards/${boardId}/tasks`;

    // Send request and return Observable
    return this.http.get<TaskInterface[]>(url);
  }
}
