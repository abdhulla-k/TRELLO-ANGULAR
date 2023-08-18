import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'inline-form',
  templateUrl: './inline-form.component.html',
})
export class InlilineFormComponent {
  // Declare all variables
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing: boolean = false;

  form = this.fb.group({
    title: [''],
  })

  constructor(private fb: FormBuilder) { }

  // Function to activated editing mode
  activateEditing() {
    // Set title value. patch form's title field
    if (!this.form.value.title) {
      this.form.patchValue({ title: this.title });
    }

    // Set component to editing mode
    this.isEditing = true;
  }

  // Function to submit form
  onSubmit(): void {
    // Emit the handle submit event emitter if there is value in form
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }

    // Set editing mode false
    this.isEditing = false;
    // Reset form. remove all values from form
    this.form.reset();
  }
}
