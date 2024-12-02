import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface PhotoEssay {
  id: number;
  title: string;
  date: string;
  description: string;
  images: {image: string}[]
}

export interface PhotoEssayParams {
  leagueId: number;
  albumId: number;
}

export interface PhotoEssayState {
  photoEssayStatus: REQUEST_STATUSES | string,
  photoEssayData: PhotoEssay
  photoEssayError: Error
}
