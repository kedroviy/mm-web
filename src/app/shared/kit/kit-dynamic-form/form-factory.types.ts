import { InjectionToken, Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

export const FORM_COMPONENT_REGISTRY = new InjectionToken<Record<string, Type<unknown>>>(
  'FORM_COMPONENT_REGISTRY',
);

export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  initialValue?: unknown;
  validators?: ValidatorFn[];
  errors?: Record<string, string>;
  placeholder?: string;
  className?: string;
}

// export const Colors = {
//   light: {
//     text: '#000000',
//     background: '#ffffff',
//     backgroundElement: '#F0F0F3',
//     backgroundSelected: '#E0E1E6',
//     textSecondary: '#60646C',
//   },
//   dark: {
//     text: '#ffffff',
//     background: '#000000',
//     backgroundElement: '#212225',
//     backgroundSelected: '#2E3135',
//     textSecondary: '#B0B4BA',
//   },
// } as const;
//
// export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
