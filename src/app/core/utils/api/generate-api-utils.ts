import { HttpParams } from '@angular/common/http';

export const customParamsSerializer = (params: any): HttpParams => {
  let httpParams = new HttpParams();

  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          httpParams = httpParams.set(key, JSON.stringify(value));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
  }

  return httpParams;
};
