export interface PageAction {
  link: string;
  label: string;
}

export interface PageData {
  title: string;
  canGoBack?: boolean;
  action?: PageAction;
}

export interface AppRouteConfig {
  path: string;
  data: PageData;
  [key: string]: unknown | AppRouteConfig;
}
