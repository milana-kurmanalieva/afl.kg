import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface Sponsor {
  name: string;
  logo: string;
  link: string
}

export interface SponsorsParams {
  limit?: number;
  offset?: number;
  leagueId:number;
}

export interface SponsorsState {
  sponsorsStatus: REQUEST_STATUSES,
  sponsorsData: {
    next: string | null;
    results: Sponsor [];
    count: number;
  },
  sponsorsError: Error
}
