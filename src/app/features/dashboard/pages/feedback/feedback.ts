import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { FeedbackAdminStore } from './feedback-admin.store';

@Component({
  selector: 'app-feedback-admin-list',
  imports: [KitTable, DatePipe],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FeedbackAdminList implements OnInit {
  readonly store = inject(FeedbackAdminStore);

  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Статус' },
    { key: 'createdAt', label: 'Создано' },
  ];

  ngOnInit(): void {
    this.store.load();
  }

  onPageChange(event: PaginationState): void {
    this.store.setPage(event.page, event.limit);
  }
}
