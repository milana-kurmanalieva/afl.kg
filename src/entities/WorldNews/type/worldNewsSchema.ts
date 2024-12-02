import { Error, Status } from '@/shared/lib/constants/constants';


export interface NewsItem {
  id: number;
  title: string;
  cover: string;
  thesis: string;
  date: Date;
}
export interface WorldNewsState {
  worldNews: {
    count: number;
    results: Array<NewsItem>;
    next: null | string;
  };
  worldNewsError?: Error;
  worldNewsStatus?: Status;

  searchWorldNews: Array<NewsItem>,
  searchWorldNewsError: Error,
  searchWorldNewsStatus: Status,
}
