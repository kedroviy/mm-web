import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService<T> {
  private selectedItemSource = new BehaviorSubject<T | null>(null);

  selectedItem$ = this.selectedItemSource.asObservable();

  selectItem(item: T) {
    this.selectedItemSource.next(item);
  }
}
