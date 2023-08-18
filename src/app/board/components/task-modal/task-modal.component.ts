import { Component, HostBinding, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BoardService } from "../../services/board.service";
import { Observable, Subject, combineLatest, filter, map, skipUntil } from "rxjs";
import { TaskInterface } from "src/app/shared/types/task.interface";
import { ColumnInterface } from "src/app/shared/types/column.interface";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'task-modal',
  templateUrl: './task-modal.component.html',
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';
  taskId: string;
  boardId: string;
  task$: Observable<TaskInterface>;

  data$: Observable<{
    task: TaskInterface,
    columns: ColumnInterface[],
  }>;

  columnForm = this.fb.group({
    columnId: ['']
  })

  unsubscribe$ = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private fb: FormBuilder,
  ) {
    // Access and check is board id and task id exists
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!boardId) throw new Error("can't get boardId from url");
    if (!taskId) throw new Error("can't get taskId from url");

    // Assign boardId and taskId to global variable if it exists in url
    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(map((tasks) => {
      return tasks.find(task => task._id === this.taskId);
    }),
      filter(Boolean),
    )

    this.data$ = combineLatest([
      this.task$,
      this.boardService.columns$,
    ]).pipe(map(([task, columns]) => ({
      task,
      columns,
    })))

    this.task$.pipe(skipUntil(this.unsubscribe$)).subscribe({
      next: (task) => {
        this.columnForm.patchValue({ columnId: task.columnId })
      }
    })
  }

  // Function to exit from task details
  goToBoard() {
    // Navigate to board page
    this.router.navigate(['boards', this.boardId]);
  }

  // Functon to update task name
  updateTaskName(taskName: string): void {

  }

  // Function to update task description
  updateTaskDescription(taskDescription: string): void {

  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete();
  }
}