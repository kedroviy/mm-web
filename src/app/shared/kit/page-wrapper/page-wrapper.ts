import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-wrapper',
  imports: [],
  templateUrl: './page-wrapper.html',
  styleUrl: './page-wrapper.css',
  standalone: true,
})
export class PageWrapper {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get containerClasses(): string {
    const base = 'w-full bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100';

    const sizes = {
      sm: 'max-w-md', // ~448px (для логина)
      md: 'max-w-xl', // ~576px (для средних форм)
      lg: 'max-w-4xl', // ~896px (для таблиц/дашбордов)
    };

    return `${base} ${sizes[this.size]}`;
  }
}
