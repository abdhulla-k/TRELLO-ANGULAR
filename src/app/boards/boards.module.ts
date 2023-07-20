import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BoardsComponent } from "./components/boards/boards.component";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { BoardsService } from "../shared/services/boards.service";
import { CommonModule } from "@angular/common";
import { InlineFormModule } from "../shared/modules/inline-form/inline-form.module";
import { TopbarModule } from "../shared/modules/topbar/topbar.module";

const router: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuardService]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    InlineFormModule,
    TopbarModule,
  ],
  declarations: [
    BoardsComponent,
  ],
  providers: [
    BoardsService,
  ],
})
export class BoardsModule {

}