import { Directive } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class HideEmptyErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && control.value && (control.touched || isSubmitted));
  }
}

@Directive({
  selector: '[appHideEmptyError]',
  standalone: true,
  providers: [{ provide: ErrorStateMatcher, useClass: HideEmptyErrorMatcher }],
})
export class HideEmptyErrorDirective {}
