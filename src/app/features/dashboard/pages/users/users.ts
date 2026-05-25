import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users',
  imports: [KitTable, DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Users implements OnInit {
  readonly store = inject(UsersStore);

  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'username', label: 'Имя пользователя' },
    { key: 'email', label: 'Email' },
    { key: 'client', label: 'Клиент' },
    { key: 'lastLoginAt', label: 'Последний вход' },
  ];

  ngOnInit(): void {
    this.store.load();
  }

  onPageChange(event: PaginationState): void {
    this.store.setPage(event.page, event.limit);
  }
}
