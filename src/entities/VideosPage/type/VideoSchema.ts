import { Error, Status } from '@/shared/lib/constants/constants';


export interface VideoItem {
  id: number;
  title: string;
  date: Date;
  is_live: boolean,
  url: string;
}

export interface LeagueVideosState {
  leagueVideos: {
    count: number,
    results: Array<VideoItem>;
    next: string | null;
  };
  leagueVideosError: Error;
  leagueVideosStatus: Status;
  liveVideos: VideoItem[];

  mainVideos: VideoItem[];
}
