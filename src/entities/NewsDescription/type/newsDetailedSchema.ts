import { Error, Status } from '@/shared/lib/constants/constants';


interface Tag {
  id: number;
  title: string;
}

export interface NewsDetailed {
  id: number;
  title: string;
  cover: string;
  content: string;
  date: Date;
  tags: Array<Tag>;
  thesis: string;
  view_count: number;
}

export interface NewsDetailedState {
  newsDetailed: NewsDetailed | null,
  newsDetailedStatus: Status,
  newsDetailedError: Error,
}
