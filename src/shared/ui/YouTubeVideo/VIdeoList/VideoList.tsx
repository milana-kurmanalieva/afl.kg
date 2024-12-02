import { VideoItem } from '@/entities/VideosPage/type/VideoSchema';
import { styleVariants } from '@/shared/lib/constants/constants';
import YouTubeVideo from '../VideoCard/YouTubeVideo';
import { NewsSkeletonCard } from '../../Skeleton/NewsSkeleton/NewsSkeletonCard';
import { EmptyState } from '../../EmptyState/EmptyState';
import classes from './videoList.module.scss';


const limit = 8;
type Props = {
  isLoading: boolean;
  videoList: Array<VideoItem>;
}

export default function VideoList({ isLoading, videoList }: Props) {
  return (
    <div className={classes.videoListWrapper}>
      {(videoList.length === 0 && !isLoading) && <EmptyState/>}

      <ul className={classes.mediaBox}>
        {!!videoList.length && videoList.map((video, id) => (
          <YouTubeVideo
            link={video.url}
            key={id}
            title={video.title}
          />
        ))}

        {isLoading && [ ...Array(limit) ].map((_, index) => (
          <NewsSkeletonCard variant={styleVariants.big} key={index}/>
        ))}
      </ul>
    </div>
  );
}
