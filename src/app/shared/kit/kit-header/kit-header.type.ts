import { UserProfileResponseDto } from '@core/api/model';

export type HeaderUser = UserProfileResponseDto;

export interface HeaderConfig {
  showNotifications?: boolean;
  showSearch?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string; // Для навигации
  action?: string; // Для вызова функций (например, 'logout')
  roles?: string[]; // На всякий случай для доп. фильтрации на фронте
}
