import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { LeagueVideosState } from '@/entities/VideosPage/type/VideoSchema';
import {
  LeagueVideosQueryParams,
  getLeaguesVideos, resetVideos, selectLeagueVideos,
} from '@/entities/VideosPage/model/VideoPageSlice';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { getDivisions, selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { Tab } from '@/entities/Tabs/type/TabsSchema';
import VideoList from '../YouTubeVideo/VIdeoList/VideoList';
import Loader from '../loader/Loader';


const query = 'square';

const VideosTab = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { divisions } = useSelector(selectDivisions);

  const currentTab = useMemo(() => {
    if (!divisions.length) return null;
    const defaultTab = divisions[ 0 ];
    const tab = divisions.find(division => division.id.toString() === router.query[ query ]) ?? defaultTab;

    return { value: tab.id.toString(), label: tab.title } as Tab;

  }, [ router, divisions ]);

  const [ theTab, setTheTab ] = useState(currentTab?.value); //TabValue for tab changing
  const [ page, setPage ] = useState(0);

  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);
  const { leagueVideos, leagueVideosStatus }:LeagueVideosState = useSelector(selectLeagueVideos);
  const [ isLoading, setIsLoading ] = useState(false);

  const params = useMemo(() => {
    return {
      leagueId: leagueId,
      leagueSquare: currentTab?.value,
      page: page,
    };
  }, [
    leagueId,
    currentTab,
    page,
  ]);

  const handleLoadMore = async () => {
    if (!currentTab) return;
    setIsLoading(true);
    const data = await dispatch(getLeaguesVideos({ ...params as LeagueVideosQueryParams, page: page + 1 })).unwrap();
    setPage(prev => prev + 1);

    if (!Array.isArray(data)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setPage(prev => prev + 1);
  };

  const handleChangeTab = () => {
    if (!currentTab) return;
    setPage(1);
    setTheTab(currentTab.value);

    if ((!leagueVideos.results.length && leagueVideosStatus !== REQUEST_STATUSES.REQUESTED)
    || leagueVideosStatus === REQUEST_STATUSES.SUCCEEDED || leagueVideosStatus === REQUEST_STATUSES.NOT_REQUESTED) {
      dispatch(getLeaguesVideos({ ...params as LeagueVideosQueryParams, page: 1 }));
    }
  };

  useEffect(() => {
    handleChangeTab();

    return () => {
      dispatch(resetVideos());
    };
  }, [ currentTab ]);


  useEffect(() => {
    dispatch(getDivisions({ leagueId }));
  }, [ leagueId ]);

  if (leagueVideosStatus !== REQUEST_STATUSES.SUCCEEDED) return <Loader center/>;

  return (
    <>
      <LoadMoreContainer loadMore={handleLoadMore} hasMore={!!leagueVideos.next}>
        <VideoList
          isLoading={isLoading}
          videoList={leagueVideos.results}/>
      </LoadMoreContainer>
    </>
  );
};

export default VideosTab;
