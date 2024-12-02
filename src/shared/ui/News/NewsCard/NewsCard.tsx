/* eslint-disable max-len */
import React, { MouseEvent, memo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { PhotoGallery } from '@/entities/PhotoGallery/type/photoGallerySchema';
import { NewsItem } from '@/entities/News/type/newsSchema';
import { DATE_FORMAT, PATHS, SHARE_BASE_URL } from '@/shared/lib/constants/constants';
import { truncateText } from '@/shared/lib/helpers/helpers';
import { ShareModal } from '../../ShareModal/ShareModal';
import { ShareButton } from '../../ShareButton/ShareButton';
import classes from './card.module.scss';


interface NewsCardProps {
  variant?: 'small' | 'big';
  newsItem: NewsItem | PhotoGallery;
  onOpen?: (id: number) => void;
  isHovering? :boolean;
  isAbleToShare?: boolean;
  shareRoute?: string;
}

const NewsCard = ({ variant = 'small', newsItem, onOpen, isHovering = true, isAbleToShare = true, shareRoute = PATHS.news }:NewsCardProps) => {
  const router = useRouter();
  const shareIconRef = useRef<HTMLDivElement | null>(null);

  const [ hovered, setHovered ] = useState(false);
  const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);

  const handleOpen = ({ target }: MouseEvent) => {
    if (shareIconRef.current?.contains(target as Node)) {
      setIsShareModalOpen(true);
      document.body.style.overflow = 'hidden';
      return;
    }

    if (onOpen) return onOpen(newsItem.id);

    router.push(`${shareRoute}/${newsItem.id}`);
  };

  return (

    <>
      <li
        onClick={handleOpen} className={classes[ variant + 'Card' ]}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div
          className={classes.content}
          style={{
            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.8) 68.23%)
            , url(${newsItem?.cover}) no-repeat center`,
            backgroundSize: 'cover',
            cursor: 'pointer',
          }}>
          <p className={classes.title}>{truncateText(newsItem.title, 55)}</p>
          {!isHovering && <h2 className={classes.date}>{format(new Date(newsItem.date), DATE_FORMAT)}</h2>}
          {isAbleToShare && <ShareButton className={classes.shareIcon} shareIconRef={shareIconRef}/>}

          {isHovering && <AnimatePresence>
            <h2 className={classes.date}>
              {!!newsItem.thesis && hovered
                ?
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: .3 }}
                >
                  {truncateText(newsItem.thesis, variant === 'small' ? 56 : 120)}
                </motion.div>
                :
                <motion.div
                  initial={{ height: 'auto', opacity: 1 }}
                  animate={{ height: 22, opacity: 1 }}
                  exit={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: .3 }}
                >
                  {format(new Date(newsItem.date), DATE_FORMAT)}
                </motion.div>}
            </h2>
          </AnimatePresence>}
        </div>
      </li>
      <ShareModal
        shareUrl={`${SHARE_BASE_URL}${shareRoute}/${newsItem.id}`}
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
      />
    </>
  );
};

export default memo(NewsCard, (prev, next) => {
  return prev.newsItem.id === next.newsItem.id;
});
