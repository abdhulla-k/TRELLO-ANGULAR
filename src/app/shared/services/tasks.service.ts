import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { TaskInterface } from "../types/task.interface";
import { Observable } from "rxjs";
import { TaskInputInterface } from "../types/task-input.interface";
import { SocketService } from "./socket.service";
import { SocketEventsEnum } from "../types/socket-events.enum";

@Injectable()
export class TasksService {
  constructor(
    private http: HttpClient,
    private socketSercie: SocketService
  ) { }

  // Function to get tasks
  getTasks(boardId: String): Observable<TaskInterface[]> {
    // Create url to send request
    const url = `${environment.url}/boards/${boardId}/tasks`;

    // Send request and return Observable
    return this.http.get<TaskInterface[]>(url);
  }

  // Function to create task
  createTask(taskInput: TaskInputInterface): void {
    this.socketSercie.emit(
      SocketEventsEnum.tasksCreate,
      taskInput,
    )
  }
}
