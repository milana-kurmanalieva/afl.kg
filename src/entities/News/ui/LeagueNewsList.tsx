import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { styleVariants } from '@/shared/lib/constants/constants';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { getLeaguesNews, selectLeagueNews } from '../model/LeagueNewsSlice';
import { LeagueNewsState } from '../type/newsSchema';


interface LeagueListProps {
  cardVariant?: styleVariants;
  listVariant?: styleVariants;
}

const limit = 8;

const LeagueNewsList = ({
  cardVariant = styleVariants.small,
  listVariant = styleVariants.small,
}:LeagueListProps) => {
  const dispatch = useAppDispatch();
  const { leagueNews }:LeagueNewsState = useSelector(selectLeagueNews);
  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);


  const [ isLoading, setIsLoading ] = useState(false);

  const params = useMemo(() => ({
    limit,
    offset: leagueNews?.results.length,
    leagueId: leagueId,
  }), [ leagueNews ]);

  const handleLoadMore = async () => {
    setIsLoading(true);

    const { results } = await dispatch(getLeaguesNews(params)).unwrap();

    if (!Array.isArray(results)) return;

    setIsLoading(false);
  };

  useEffect(() => {
    if (!leagueNews.results.length) handleLoadMore();
  }, [ ]);


  return (
    <div>
      <LoadMoreContainer
        loadMore={handleLoadMore}
        hasMore={!!leagueNews.next} >
        <NewsList
          isLoading={isLoading}
          newsList={leagueNews.results}
          cardVariant={cardVariant}
          listVariant={listVariant}
          title={false}
        />
      </LoadMoreContainer>
    </div>
  );
};


export default LeagueNewsList;
