import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[kitCellDef]',
})
export class KitCellDef {
  readonly columnKey = input.required<string>({ alias: 'kitCellDef' });

  constructor(readonly templateRef: TemplateRef<unknown>) {}
}
