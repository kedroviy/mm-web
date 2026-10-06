/**
 * Extended admin users list query (beyond generated Orval params).
 */
export type UsersLifecycleFilter = 'all' | 'new' | 'returning';

export type UsersListQueryParams = {
  page?: number;
  limit?: number;
  emailQuery?: string;
  usernameQuery?: string;
  lifecycle?: UsersLifecycleFilter;
  createdFrom?: string;
  createdTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  platform?: string;
  sort?: string;
};

export type UsersOverviewResponse = {
  period: { from: string; to: string };
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  dauAverage: number;
  wau: number;
  activeByPlatform: Array<{ platform: string | null; count: number }>;
};

export type MatchFunnelChannelStats = {
  created: number;
  joined2: number;
  started: number;
  shortlist: number;
  result: number;
  conversionCreatedToJoined2: number | null;
  conversionJoined2ToStarted: number | null;
  conversionStartedToShortlist: number | null;
  conversionStartedToResult: number | null;
};

export type MatchFunnelResponse = {
  period: { from: string; to: string };
  total: MatchFunnelChannelStats;
  byChannel: {
    web: MatchFunnelChannelStats;
    mobile: MatchFunnelChannelStats;
    unknown: MatchFunnelChannelStats;
  };
  stages: Array<{
    stage: 'created' | 'joined2' | 'started' | 'shortlist' | 'result';
    count: number;
  }>;
};

export type MatchFunnelQueryParams = {
  from?: string;
  to?: string;
  platformChannel?: 'all' | 'web' | 'mobile' | 'unknown';
};
