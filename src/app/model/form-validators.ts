import {FormControl, ValidationErrors} from "@angular/forms";


export class FormValidators {

  static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null{
    if (control.valid != null) {
      if (control.value != null){
        if (control.value.trim().length === 0){
          return {'notOnlyWhiteSpace': true};
        }
      }
    }
      return null;
  }
}
