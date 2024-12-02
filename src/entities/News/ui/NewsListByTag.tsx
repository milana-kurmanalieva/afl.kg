import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { REQUEST_STATUSES, styleVariants } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { LeagueNewsState } from '../type/newsSchema';
import { getLeaguesNewsByTag, resetLeaguesNewsByTag, selectLeagueNews } from '../model/LeagueNewsSlice';


interface INewsListByTag {
  cardVariant?: styleVariants;
  listVariant?: styleVariants;
  tagId: number;
  excludeNewsId?: number;
}

const NewsListByTag = ({
  cardVariant = styleVariants.small,
  listVariant = styleVariants.small,
  excludeNewsId,
  tagId,
}:INewsListByTag) => {
  const isMobile = useIsMobile();

  const limit = isMobile ? 4 : 8;

  const dispatch = useAppDispatch();
  const { leagueNewsByTag, leagueNewsByTagStatus }:LeagueNewsState = useSelector(selectLeagueNews);
  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);

  const params = useMemo(() => {
    return {
      tagId: tagId,
      limit,
      news_id: excludeNewsId ?? '',
      leagueId: leagueId,
    };
  }, [
    tagId,
    excludeNewsId,
    leagueId,
  ]);

  useEffect(() => {
    dispatch(getLeaguesNewsByTag(params));

    return () => {
      dispatch(resetLeaguesNewsByTag());
    };
  }, [ ]);

  if (leagueNewsByTagStatus === REQUEST_STATUSES.FAILED) return <></>;

  return (
    <NewsList
      isLoading={leagueNewsByTagStatus === REQUEST_STATUSES.REQUESTED}
      newsList={leagueNewsByTag}
      cardVariant={cardVariant}
      listVariant={listVariant}
    />
  );
};


export default NewsListByTag;
