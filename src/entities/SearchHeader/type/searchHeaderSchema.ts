import { SEARCH_MODELS, SearchResult } from '@/shared/lib/constants/constants';


export interface IResultItem {
  model: SEARCH_MODELS;
  result: SearchResult[];
}


export interface ISearchHeaderSchema {
  response: IResultItem[];
  searchValue: string;
  displayResults: IResultItem[];
}

export interface IParamsSearch {
  q: string,
  leagueId: number,
  page?: number,
  limit?: number,
  offset?: number,
}
