import { CSSProperties, FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { getYoutubeVideoId } from '@/shared/lib/helpers/helpers';
import YouTubeIcon from '@/shared/assets/icons/media/youtubeIcon.svg';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import classes from './youTubeVideo.module.scss';


interface Props {
  key: string | number;
  link: string;
  title: string;
  className?: string;
  isSmall?: boolean;
  isAutoplay?: boolean;
  isBlackOut?: boolean
}

const YouTubeVideo: FC<Props> = ({ key, link, title, className, isSmall, isAutoplay, isBlackOut = false }) => {
  const [ showVideo, setShowVideo ] = useState(false);

  const isMobile = useIsMobile() || isSmall;

  const imageStyle: CSSProperties = { width: '100%' };
  const iconStyle: CSSProperties = { width: !isMobile ? '100' : '60x' };

  const handleClick = () => {
    setShowVideo(true);
  };

  useEffect(() => {
    if (isAutoplay) setShowVideo(true);
  }, [ isAutoplay ]);

  return (
    <li
      className={`${classes.video} ${className}`} key={'youtube' + key}
    >
      {showVideo ? (
        <iframe
          src={`https://www.youtube.com/embed/${getYoutubeVideoId(link)}?autoplay=1&mute=${isAutoplay ? 1 : 0}`}
          title={`youtube video${key}`}
          allowFullScreen
          loading='lazy'
          allow='autoplay'
        ></iframe>
      ) : (
        <div
          className={classes.thumbnail} onClick={handleClick}>
          <img
            src={`https://i.ytimg.com/vi_webp/${getYoutubeVideoId(link)}/mqdefault.webp`}
            alt={`Youtube Preview ${key}`}
            style={imageStyle}
            className={classes.youtubeThumbnail}
          />
          {!isBlackOut && <div className={classes.blackout}/>}

          <p className={classes.youtubeTitle}>{title}</p>
          <Image
            src={YouTubeIcon}
            width={100}
            height={100}
            quality={100}
            alt='play'
            style={iconStyle}
            className={classes.youtubePlayBtn}
          />
        </div>
      )}
    </li>
  );
};

export default YouTubeVideo;
