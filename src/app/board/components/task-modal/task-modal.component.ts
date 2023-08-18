import { Component, HostBinding } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'task-modal',
  templateUrl: './task-modal.component.html',
})
export class TaskModalComponent {
  @HostBinding('class') classes = 'task-modal';
  taskId: string;
  boardId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // Access and check is board id and task id exists
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');
    console.log(boardId, taskId)

    if (!boardId) throw new Error("can't get boardId from url");
    if (!taskId) throw new Error("can't get taskId from url");

    // Assign boardId and taskId to global variable if it exists in url
    this.taskId = taskId;
    this.boardId = boardId;
  }

  // Function to exit from task details
  goToBoard() {
    // Navigate to board page
    this.router.navigate(['boards', this.boardId]);
  }
}