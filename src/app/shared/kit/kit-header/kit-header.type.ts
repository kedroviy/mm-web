import { GetMeType } from '@core/api/model';

export type HeaderUser = GetMeType;

export interface HeaderConfig {
  showNotifications?: boolean;
  showSearch?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  action?: string;
  roles?: string[];
}
