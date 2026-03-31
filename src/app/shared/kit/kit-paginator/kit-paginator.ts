import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PaginationState {
  page: number;
  limit: number;
  totalItems: number;
}

@Component({
  selector: 'app-kit-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './kit-paginator.html',
  styleUrl: './kit-paginator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitPaginator {
  readonly totalItems = input(0);
  page = input(1);
  limit = input(10);
  pageSizeOptions = input([5, 10, 25, 50]);

  pageChange = output<PaginationState>();

  readonly pageIndex = computed(() => this.page() - 1);

  onPage(event: PageEvent) {
    this.pageChange.emit({
      page: event.pageIndex + 1,
      limit: event.pageSize,
      totalItems: this.totalItems(),
    });
  }
}
