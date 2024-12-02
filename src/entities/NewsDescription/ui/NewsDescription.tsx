import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HTMLReactParser from 'html-react-parser';
import { format } from 'date-fns';
import { Skeleton } from 'antd';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { Container } from '@/shared/ui/Container/Container';
import { HTag } from '@/shared/ui/HTag/HTag';
import { DATE_FORMAT, PATHS, REQUEST_STATUSES, SHARE_BASE_URL } from '@/shared/lib/constants/constants';
import NewsListByTag from '@/entities/News/ui/NewsListByTag';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { ShareButton } from '@/shared/ui/ShareButton/ShareButton';
import { ShareModal } from '@/shared/ui/ShareModal/ShareModal';
import { NewsDetailedState } from '../type/newsDetailedSchema';
import { getNewsDetailed, resetNewsDescription, selectNewsDetailed } from '../model/NewsDetailedSlice';
import classes from './newsDetailed.module.scss';


const NewsDescription = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { newsDetailed, newsDetailedStatus, newsDetailedError }:NewsDetailedState = useSelector(selectNewsDetailed);

  const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    if (!id) return;
    dispatch(getNewsDetailed({ id: +id }));

    return () => {
      dispatch(resetNewsDescription());
    };
  }, [ router ]);

  if (newsDetailedError && !newsDetailed) {
    router.push(PATHS.news);
  }

  if (!newsDetailed || newsDetailedStatus === REQUEST_STATUSES.REQUESTED) return (
    <div className={classes.newsDetailed}>
      <Container>
        <Loader center/>
        <Skeleton/>
      </Container>
    </div>
  );

  const parsedContent = HTMLReactParser(newsDetailed.content.replaceAll('h1', 'h2'));
  return (
    <>
      <div className={classes.newsDetailed}>
        <Container>
          <img
            className={classes.thumbnail}
            src={newsDetailed.cover}
            alt={newsDetailed.title}
          />
        </Container>
        <div className={classes.contentWrapper}>
          <Container variant='small'>
            <div className={classes.content}>
              <div className={classes.title}>
                <HTag level={4}>{newsDetailed.title}</HTag>
                <ShareButton onClick={handleOpenShareModal} fill='#000'/>
                {newsDetailed.view_count && <div className={classes.viewCount}>
                  <span>Просмотрено: </span>
                  <span>{Math.floor(newsDetailed.view_count) * 10} раз</span>
                </div>}
              </div>
              <div className={classes.text}>{parsedContent}</div>
              <p className={classes.date}>{format(new Date(newsDetailed.date), DATE_FORMAT)}</p>
            </div>
            {!!newsDetailed.tags.length && <div className={classes.tags}>
              {t('tags')}: {newsDetailed.tags.map((tag, index, array) => {
                if (index === array.length - 1) return tag.title;
                return `${tag.title}, `;
              })}
            </div>}
          </Container>
        </div>
        <Container variant='large'>
          <BannerRow/>
          {!!newsDetailed.tags?.length && (
            <NewsListByTag tagId={newsDetailed.tags[ 0 ].id} excludeNewsId={newsDetailed.id}/>
          )}
        </Container>

      </div>
      <ShareModal
        shareUrl={`${SHARE_BASE_URL}${PATHS.news}/${newsDetailed.id}`}
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
      />
    </>
  );
};


export default NewsDescription;
