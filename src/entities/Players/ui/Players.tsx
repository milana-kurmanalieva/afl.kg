import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PATHS, REQUEST_STATUSES, SearchResult } from '@/shared/lib/constants/constants';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { AlphabetFilter } from '@/shared/ui/AlphabetFilter/AlphabetFilter';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { setSearchValue } from '@/entities/SearchHeader/model/searchHeaderSlice';
import { setPlayerId } from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { getPlayers, getPlayersInfinity, resetPlayers, selectPlayers } from '../model/PlayersSlice';
import classes from './players.module.scss';


const limit = 18;

const Players = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [ letterFilter, setLetterFilter ] = useState('');
  const [ searchPlayerValue, setSearchPlayerValue ] = useState('');
  const [ isSearching, setIsSearching ] = useState(false);

  const { leagueId, currentLeague } = useSelector(selectCurrentLeague);
  const { playersResponse, playersStatus, playersList, playersListStatus } = useSelector(selectPlayers);

  const pages = [
    {
      href: '',
      page: currentLeague.title,
      disabled: true,
    }, {
      href: PATHS.players,
      page: t('players'),
    },
  ];

  const handleSearchTeams = () => {
    const params = { search: searchPlayerValue, leagueId };
    dispatch(getPlayers(params));
  };

  const handleSetLetterFIlter = (letterValue: string) => {
    setLetterFilter(letterValue);
    dispatch(setSearchValue(''));
    setSearchPlayerValue('');
    setIsSearching(false);
  };

  const handleSearchTeamsDebounced = useDebounce(() => {
    if (isSearching) return;
    handleSearchTeams();
  }, 1000);

  const handleChangeSearchPlayer = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(''));
    setSearchPlayerValue(e.target.value);
    handleSearchTeamsDebounced();
  };

  const handleOnFoundItem = (result?: SearchResult) => {
    if (result) dispatch(setPlayerId(result.id));
  };

  const handleClose = () => {
    router.push({ pathname: router.pathname, search: '' });
    setSearchPlayerValue('');
    setIsSearching(false);
  };

  const handleSubmit = () => {
    router.push({ pathname: router.pathname, search: `search=${searchPlayerValue}` });
    setIsSearching(true);
    handleSearchTeams();
  };

  const handleLoadMore = useCallback(() => {
    dispatch(getPlayersInfinity({
      leagueId,
      letter: letterFilter,
      limit,
      offset: playersResponse.results.length,
    }));
  }, [ letterFilter, playersResponse.results.length ]);

  useEffect(() => {
    dispatch(getPlayersInfinity({
      leagueId,
      letter: letterFilter,
      limit,
    }));

    return () => {
      dispatch(resetPlayers());
    };
  }, [ letterFilter ]);

  useEffect(() => {
    if (typeof router.query.search === 'string') {
      setIsSearching(true);
      setSearchPlayerValue(router.query.search);
      dispatch(getPlayers({ search: router.query.search, leagueId }));
    }
  }, [ router ]);

  const hintsSearchedPlayers = useMemo(() => {
    return playersList
      .map(player => ({ id: player.id, last_name: player.last_name, first_name: player.first_name }));
  }, [ playersList ]);

  return (
    <>
      <TopContent
        title={t('players')}
        breadcrumbs={pages}
      >
        <div className={classes.topContent}>
          <AlphabetFilter value={letterFilter} setValue={handleSetLetterFIlter}/>
          <SearchInput
            value={searchPlayerValue}
            searchKeys={[ 'first_name', 'last_name' ]}
            placeholder={t('search') as string}
            onChange={handleChangeSearchPlayer}
            onFoundItemClick={handleOnFoundItem}
            onEnter={handleSubmit}
            onClose={handleClose}
            hints={hintsSearchedPlayers}
          />
        </div>
      </TopContent>
      <BannerRow />


      {(!playersResponse.results.length && playersStatus !== REQUEST_STATUSES.SUCCEEDED) ||
      (!playersList.length && playersListStatus !== REQUEST_STATUSES.SUCCEEDED && isSearching) ||
        playersStatus !== REQUEST_STATUSES.SUCCEEDED ? (
          <Loader center />
        ) : (
          !playersList.length && !playersResponse.results.length && <EmptyState />
        )}


      {isSearching && (
        <PlayersList isAbleToOpenCard={true} players={playersList}/>
      )}

      {!isSearching && (
        <LoadMoreContainer
          loadMore={handleLoadMore}
          hasMore={!!playersResponse.next}
        >
          <PlayersList isAbleToOpenCard={true} players={playersResponse.results}/>
        </LoadMoreContainer>
      )}
    </>
  );
};

export default Players;
