import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TopbarComponent } from "./components/topbar/topbar.component";

@NgModule({
  declarations: [
    TopbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    TopbarComponent,
  ],
  providers: [],
})
export class TopbarModule {

}
