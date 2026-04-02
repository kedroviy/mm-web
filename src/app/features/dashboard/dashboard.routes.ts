import { Routes } from '@angular/router';
import { COMMON_CONSTANTS } from '@core/constants';
import { DASHBOARD_CONFIG as PAGES } from '@features/dashboard/lib/dashboard.config';
import { AwardCategory } from '@features/dashboard/pages/nsi-list/award-category';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: PAGES.HOME.path,
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: PAGES.HOME.data,
  },
  {
    path: PAGES.NSI.path,
    data: PAGES.NSI.data,
    children: [
      {
        path: COMMON_CONSTANTS.EMPTY_STRING,
        loadComponent: () => import('./pages/nsi-list/nsi-list').then((m) => m.NsiList),
      },
      {
        path: PAGES.NSI.GENRES.path,
        data: { title: PAGES.NSI.GENRES.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/genres/genres').then((m) => m.Genres),
            data: PAGES.NSI.GENRES.data,
          },
          {
            path: PAGES.NSI.GENRES.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/genres/genres-create/').then((m) => m.GenresCreate),
            data: PAGES.NSI.GENRES.CHILDREN.CREATE.data,
          },
          {
            path: PAGES.NSI.GENRES.CHILDREN.VIEW.path,
            loadComponent: () =>
              import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
            data: PAGES.NSI.GENRES.CHILDREN.VIEW.data,
          },
        ],
      },
      {
        path: PAGES.NSI.COUNTRIES.path,
        data: { title: PAGES.NSI.COUNTRIES.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/countries').then((m) => m.Countries),
            data: PAGES.NSI.COUNTRIES.data,
          },
          {
            path: PAGES.NSI.COUNTRIES.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/countries').then((m) => m.CountriesCreate),
            data: PAGES.NSI.COUNTRIES.CHILDREN.CREATE.data,
          },
          // {
          //   path: PAGES.NSI.COUNTRIES.CHILDREN.VIEW.path,
          //   loadComponent: () =>
          //     import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
          //   data: PAGES.NSI.COUNTRIES.CHILDREN.VIEW.data,
          // },
        ],
      },
      {
        path: PAGES.NSI.AWARDS.path,
        data: { title: PAGES.NSI.AWARDS.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/awards').then((m) => m.Awards),
            data: PAGES.NSI.AWARDS.data,
          },
          {
            path: PAGES.NSI.AWARDS.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/awards').then((m) => m.AwardsCreate),
            data: PAGES.NSI.AWARDS.CHILDREN.CREATE.data,
          },
          // {
          //   path: PAGES.NSI.AWARDS.CHILDREN.VIEW.path,
          //   loadComponent: () =>
          //     import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
          //   data: PAGES.NSI.AWARDS.CHILDREN.VIEW.data,
          // },
        ],
      },
      {
        path: PAGES.NSI.CONTENT_TYPE.path,
        data: { title: PAGES.NSI.CONTENT_TYPE.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/content-types').then((m) => m.ContentTypes),
            data: PAGES.NSI.CONTENT_TYPE.data,
          },
          {
            path: PAGES.NSI.CONTENT_TYPE.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/content-types').then((m) => m.ContentTypeCreate),
            data: PAGES.NSI.CONTENT_TYPE.CHILDREN.CREATE.data,
          },
          // {
          //   path: PAGES.NSI.AWARDS.CHILDREN.VIEW.path,
          //   loadComponent: () =>
          //     import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
          //   data: PAGES.NSI.AWARDS.CHILDREN.VIEW.data,
          // },
        ],
      },
      {
        path: PAGES.NSI.AGE_RATING.path,
        data: { title: PAGES.NSI.AGE_RATING.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/age-ratings').then((m) => m.AgeRatings),
            data: PAGES.NSI.AGE_RATING.data,
          },
          {
            path: PAGES.NSI.AGE_RATING.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/age-ratings').then((m) => m.AgeRatingCreate),
            data: PAGES.NSI.AGE_RATING.CHILDREN.CREATE.data,
          },
          // {
          //   path: PAGES.NSI.AWARDS.CHILDREN.VIEW.path,
          //   loadComponent: () =>
          //     import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
          //   data: PAGES.NSI.AWARDS.CHILDREN.VIEW.data,
          // },
        ],
      },
      {
        path: PAGES.NSI.AWARD_CATEGORY.path,
        data: { title: PAGES.NSI.AWARD_CATEGORY.data.title },
        children: [
          {
            path: COMMON_CONSTANTS.EMPTY_STRING,
            loadComponent: () => import('./pages/nsi-list/award-category').then((m) => m.AwardCategory),
            data: PAGES.NSI.AWARD_CATEGORY.data,
          },
          {
            path: PAGES.NSI.AWARD_CATEGORY.CHILDREN.CREATE.path,
            loadComponent: () =>
              import('./pages/nsi-list/award-category').then((m) => m.AwardCategory),
            data: PAGES.NSI.AWARD_CATEGORY.CHILDREN.CREATE.data,
          },
          // {
          //   path: PAGES.NSI.AWARDS.CHILDREN.VIEW.path,
          //   loadComponent: () =>
          //     import('./pages/nsi-list/genres/genres-view/genres-view').then((m) => m.GenresView),
          //   data: PAGES.NSI.AWARDS.CHILDREN.VIEW.data,
          // },
        ],
      },
    ],
  },
];
