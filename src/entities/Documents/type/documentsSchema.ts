import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface Document {
  id: number;
  title: string;
  document: string
}

export interface IDocumentsState {
  documents: Document[];
  documentsError: Error;
  documentsStatus: REQUEST_STATUSES;
}

export interface IParams {
  leagueId: number;
}
