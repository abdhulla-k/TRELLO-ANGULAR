import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { BoardComponent } from "./components/board/board.component";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { BoardService } from "./services/board.service";
import { SocketService } from "../shared/services/socket.service";
import { ColumnsService } from "../shared/services/columns.service";
import { TopbarModule } from "../shared/modules/topbar/topbar.module";
import { InlineFormModule } from "../shared/modules/inline-form/inline-form.module";
import { TasksService } from "../shared/services/tasks.service";
import { TaskModalComponent } from "./components/task-modal/task-modal.component";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      }
    ]
  }
]

@NgModule({
  declarations: [
    BoardComponent,
    TaskModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TopbarModule,
    InlineFormModule,
    ReactiveFormsModule,
  ],
  exports: [],
  providers: [
    BoardService,
    SocketService,
    ColumnsService,
    TasksService
  ],
})
export class BoardModule {

}