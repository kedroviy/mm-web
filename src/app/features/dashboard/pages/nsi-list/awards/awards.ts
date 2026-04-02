import { Component, computed, inject, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { catchError, of } from 'rxjs';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { ActiveImportService } from '@core/services/import-progress/active-import.service';
import { NsiAwardcategoryService } from '@core/api/generated/nsi-awardcategory/nsi-awardcategory.service';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { PaginationState } from '@shared/kit/kit-paginator/kit-paginator';
import { AwardsStore } from '@features/dashboard/pages/nsi-list/awards/awards.store';
import type { Awards as AwardRow } from './awards.types';
import type { AwardCategory } from '@features/dashboard/pages/nsi-list/award-category/award-category.types';

@Component({
  selector: 'app-awards',
  imports: [
    DatePipe,
    KitTable,
  ],
  templateUrl: './awards.html',
  styleUrl: './awards.css',
  standalone: true,
})
export class Awards implements OnInit, OnDestroy {
  @ViewChild('dateCell', { static: true }) dateCell!: TemplateRef<unknown>;

  readonly store = inject(AwardsStore);
  private readonly activeImport = inject(ActiveImportService);
  private readonly awardCategoryApi = inject(NsiAwardcategoryService);

  private readonly expandedAwardIds = signal(new Set<number>());
  readonly expandedKeysList = computed(() => [...this.expandedAwardIds()]);

  private readonly categoriesByAwardId = signal(new Map<number, AwardCategory[]>());
  private readonly loadingCategoryByAwardId = signal(new Set<number>());

  readonly columns: TableColumn[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Название премии' },
    { key: 'slug', label: 'URL-путь' },
    { key: 'createdAt', label: 'Дата создания' },
    { key: 'description', label: 'Описание' },
  ];

  ngOnInit() {
    this.activeImport.register(this.store);
    this.store.load();
  }

  ngOnDestroy() {
    this.activeImport.unregister(this.store);
  }

  onPageChange(event: PaginationState) {
    this.store.setPage(event.page, event.limit);
  }

  categoriesForAward(awardId: number): AwardCategory[] {
    return this.categoriesByAwardId().get(awardId) ?? [];
  }

  isCategoriesLoading(awardId: number): boolean {
    return this.loadingCategoryByAwardId().has(awardId);
  }

  onExpandToggle(award: AwardRow): void {
    const id = award.id;
    const next = new Set(this.expandedAwardIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      if (!this.categoriesByAwardId().has(id)) {
        this.fetchCategoriesForAward(id);
      }
    }
    this.expandedAwardIds.set(next);
  }

  private fetchCategoriesForAward(awardId: number): void {
    this.loadingCategoryByAwardId.update((s) => new Set(s).add(awardId));
    this.awardCategoryApi
      .awardCategoryControllerGetWithPages({ page: 1, limit: 100, awardId })
      .pipe(catchError(() => of({ data: [] as AwardCategory[] })))
      .subscribe((res) => {
        this.categoriesByAwardId.update((m) => {
          const copy = new Map(m);
          copy.set(awardId, (res.data as AwardCategory[]) ?? []);
          return copy;
        });
        this.loadingCategoryByAwardId.update((s) => {
          const n = new Set(s);
          n.delete(awardId);
          return n;
        });
      });
  }

}
