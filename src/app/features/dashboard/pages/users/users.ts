import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppDatePipe } from '@shared/date/app-date.pipe';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn, TableSortChange } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import type { UsersLifecycleFilter } from '@core/api/model/admin-analytics.types';
import { UsersSortField, UsersStore } from './users.store';

@Component({
  selector: 'app-users',
  imports: [KitTable, AppDatePipe, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Users implements OnInit {
  readonly store = inject(UsersStore);

  readonly columns: TableColumn[] = [
    { key: 'rowNumber', label: '#', sortable: true, sortKey: 'id' },
    { key: 'username', label: 'Имя пользователя' },
    { key: 'email', label: 'Email' },
    { key: 'client', label: 'Клиент' },
    { key: 'platform', label: 'Платформа' },
    { key: 'createdAt', label: 'Регистрация', sortable: true },
    { key: 'lastLoginAt', label: 'Последний вход' },
  ];

  readonly sortCaption = computed(() => {
    const field = this.store.sortField();
    const newestFirst = this.store.sortDirection() === 'desc';
    if (field === 'id') {
      return newestFirst ? 'Сначала последний добавленный' : 'Сначала первый добавленный';
    }
    return newestFirst ? 'Сначала недавно зарегистрированные' : 'Сначала давно зарегистрированные';
  });

  /** Порядковый номер в выдаче (с учётом страницы), не DB id. */
  readonly rows = computed(() => {
    const offset = (this.store.page() - 1) * this.store.limit();
    return this.store.users().map((user, index) => ({
      ...user,
      rowNumber: offset + index + 1,
    }));
  });

  readonly lifecycleOptions: Array<{ value: UsersLifecycleFilter; label: string }> = [
    { value: 'all', label: 'Все' },
    { value: 'new', label: 'Новые' },
    { value: 'returning', label: 'Returning (не первый раз)' },
  ];

  ngOnInit(): void {
    this.store.loadOverview();
    this.store.load();
  }

  onPageChange(event: PaginationState): void {
    this.store.setPage(event.page, event.limit);
  }

  onLifecycleChange(value: UsersLifecycleFilter): void {
    this.store.setLifecycle(value);
  }

  onSortChange(event: TableSortChange): void {
    if (!isUsersSortField(event.key)) {
      return;
    }
    this.store.setSort(event.key, event.direction);
  }
}

function isUsersSortField(value: string): value is UsersSortField {
  return value === 'id' || value === 'createdAt' || value === 'lastLoginAt';
}
