import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface PhotoGallery {
  id: number;
  cover: string;
  title: string;
  thesis: string;
  date: Date
}

export interface PhotoGalleryParams {
  limit?: number;
  offset?: number;
  leagueId:number;
}


export interface PhotoGalleryState {
  photoGalleryStatus: REQUEST_STATUSES,
  photoGalleryData: {
    next: string | null;
    results: Array<PhotoGallery>;
    count: number;
  }
  photoGalleryError: Error;

}
