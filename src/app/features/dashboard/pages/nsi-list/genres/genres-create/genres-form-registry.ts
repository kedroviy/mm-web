import { Type } from '@angular/core';
import { KitInputComponent } from '@shared/kit/input/input';

export const FORM_COMPONENTS: Record<string, Type<unknown>> = {
  text: KitInputComponent,
  number: KitInputComponent,
  password: KitInputComponent,
};
