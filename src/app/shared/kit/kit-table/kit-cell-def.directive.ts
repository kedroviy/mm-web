import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'app-ng-template[appKitCellDef]',
  standalone: true,
})
export class KitCellDef {
  readonly templateRef = inject(TemplateRef<unknown>);

  readonly columnKey = input.required<string>({ alias: 'appKitCellDef' });
}
