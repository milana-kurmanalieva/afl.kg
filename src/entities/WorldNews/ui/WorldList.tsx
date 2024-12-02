import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { getWorldsNews, selectWorldNews } from '../model/WorldNewsSlice';
import { WorldNewsState } from '../type/worldNewsSchema';


const limit = 12;

const WorldList = () => {
  const dispatch = useAppDispatch();
  const { worldNews }:WorldNewsState = useSelector(selectWorldNews);

  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const params = useMemo(() => ({
    limit,
    offset: worldNews.results.length,
  }), [ worldNews.results ]);

  const handleLoadMore = async () => {
    if (params.offset < worldNews.results.length) return;
    setIsLoading(true);

    const { results } = await dispatch(getWorldsNews(params)).unwrap();

    if (!Array.isArray(results)) return;

    setIsLoading(false);
  };


  useEffect(() => {
    if (!worldNews.results.length) handleLoadMore();
  }, []);

  return (
    <div>
      <LoadMoreContainer
        loadMore={handleLoadMore}
        hasMore={!!worldNews.next}
      >
        <NewsList
          isLoading={isLoading}
          newsList={worldNews.results}
          title={false}
        />
      </LoadMoreContainer>
    </div>
  );
};


export default WorldList;
