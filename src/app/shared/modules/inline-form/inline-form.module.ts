import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { InlilineFormComponent } from "./components/inline-form/inline-form.component";

@NgModule({
  declarations: [
    InlilineFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    InlilineFormComponent,
  ],
  providers: [],
})
export class InlineModule {

}
