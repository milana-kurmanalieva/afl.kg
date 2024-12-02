import { Error, Status } from '@/shared/lib/constants/constants';


export interface NewsItem {
  id: number;
  title: string;
  cover: string;
  thesis: string;
  date: Date;
}

export interface Tag {
  id: number;
  title: string;
}

export interface LeagueNewsState {
  leagueNews: {
    count: number,
    results: Array<NewsItem>;
    next: string | null;
  };
  leagueNewsError: Error;
  leagueNewsStatus: Status;

  leagueNewsByTag: Array<NewsItem>;
  leagueNewsByTagError: Error;
  leagueNewsByTagStatus: Status;

  searchNews: Array<NewsItem>;
  searchNewsError: Error;
  searchNewsStatus: Status;
}
