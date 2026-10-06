import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppDatePipe } from '@shared/date/app-date.pipe';
import { KitChartBar } from '@shared/kit/kit-chart-bar/kit-chart-bar';
import { KitTable } from '@shared/kit/kit-table/kit-table';
import { TableColumn } from '@shared/kit/kit-table/kit-table.types';
import { MatchFunnelStore } from './match-funnel.store';

@Component({
  selector: 'app-match-funnel-analytics',
  imports: [
    KitChartBar,
    KitTable,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppDatePipe,
  ],
  templateUrl: './match-funnel.html',
  styleUrl: './match-funnel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MatchFunnelAnalytics implements OnInit {
  readonly store = inject(MatchFunnelStore);

  readonly channelOptions = [
    { value: 'all' as const, label: 'Все каналы' },
    { value: 'web' as const, label: 'Web' },
    { value: 'mobile' as const, label: 'Mobile (RN)' },
    { value: 'unknown' as const, label: 'Unknown' },
  ];

  readonly channelColumns: TableColumn[] = [
    { key: 'channel', label: 'Канал' },
    { key: 'created', label: 'Создано' },
    { key: 'joined2', label: '≥2' },
    { key: 'started', label: 'Старт' },
    { key: 'shortlist', label: 'Shortlist' },
    { key: 'result', label: 'Результат' },
    { key: 'convResult', label: 'Старт→Результат' },
  ];

  ngOnInit(): void {
    this.store.load();
  }

  channelRows(): Array<Record<string, string | number>> {
    const data = this.store.data();
    if (!data) {
      return [];
    }
    const formatConv = (value: number | null): string =>
      value == null ? '—' : `${Math.round(value * 100)}%`;
    return [
      {
        channel: 'Всего',
        created: data.total.created,
        joined2: data.total.joined2,
        started: data.total.started,
        shortlist: data.total.shortlist,
        result: data.total.result,
        convResult: formatConv(data.total.conversionStartedToResult),
      },
      {
        channel: 'Web',
        created: data.byChannel.web.created,
        joined2: data.byChannel.web.joined2,
        started: data.byChannel.web.started,
        shortlist: data.byChannel.web.shortlist,
        result: data.byChannel.web.result,
        convResult: formatConv(data.byChannel.web.conversionStartedToResult),
      },
      {
        channel: 'Mobile',
        created: data.byChannel.mobile.created,
        joined2: data.byChannel.mobile.joined2,
        started: data.byChannel.mobile.started,
        shortlist: data.byChannel.mobile.shortlist,
        result: data.byChannel.mobile.result,
        convResult: formatConv(data.byChannel.mobile.conversionStartedToResult),
      },
      {
        channel: 'Unknown',
        created: data.byChannel.unknown.created,
        joined2: data.byChannel.unknown.joined2,
        started: data.byChannel.unknown.started,
        shortlist: data.byChannel.unknown.shortlist,
        result: data.byChannel.unknown.result,
        convResult: formatConv(data.byChannel.unknown.conversionStartedToResult),
      },
    ];
  }
}
