export interface AuthUrls {
  login: string;
  logout: string;
}

export interface UsersUrls {
  list: string;
  create: string;
  edit: (id: string) => string;
}

export interface FiltersUrls {
  list: string;
  create: string;
  edit: (id: string) => string;
}

export interface ApiUrls {
  auth: AuthUrls;
  users: UsersUrls;
  filters: FiltersUrls;
}
