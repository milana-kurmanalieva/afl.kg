import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import {
  PATHS,
  SEARCH_MODELS,
  SearchResult,
} from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import { setPlayerId } from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import {
  getSearch,
  selectSearchHeader,
  setDisplayResults,
  setSearchValue,
} from '../model/searchHeaderSlice';
import { IResultItem } from '../type/searchHeaderSchema';


interface ISearchInputWithResults {
  isInputActive: boolean;
  onClose: () => void;
}

const searchDelay = 500;
const maxSearchItems = 15;

export const SearchInputWithResults: FC<ISearchInputWithResults> = ({
  isInputActive,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 820px)');

  const { t } = useTranslation();

  const { response, searchValue } = useAppSelector(selectSearchHeader);
  const { leagueId }: currentLeagueState = useSelector(selectCurrentLeague);
  const [ isSubmitted, setIsSubmitted ] = useState(false);
  const handleSearchRequest = useDebounce((value: string) => {
    const params = {
      q: value,
      leagueId: leagueId,
      limit: maxSearchItems,
    };
    dispatch(getSearch(params));
  }, searchDelay);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.value.length)
      router.push({ search: '', pathname: router.pathname });
    dispatch(setSearchValue(e.target.value));

    if (e.target.value.length > 2) handleSearchRequest(e.target.value);
  };

  const handleSubmit = async () => {
    const params = {
      q: searchValue,
      leagueId: leagueId,
      limit: maxSearchItems,
    };
    await dispatch(getSearch(params));
    setIsSubmitted(true);
    router.push({
      pathname: PATHS.searchResults,
      search: `search=${searchValue}`,
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      dispatch(setDisplayResults());
      setIsSubmitted(false);
    }
  }, [ isSubmitted ]);

  useEffect(() => {
    if (
      typeof router.query.search === 'string' &&
      router.pathname === PATHS.searchResults
    ) {
      dispatch(setSearchValue(router.query.search));
      dispatch(
        getSearch({ q: router.query.search, leagueId, limit: maxSearchItems }),
      ).then(() => dispatch(setDisplayResults()));
    }
  }, [ router ]);

  const handleFoundItemClick = async (result?: SearchResult) => {
    if (!result) return;

    const foundItem = response.find((item: IResultItem) => {
      return item.result.find((res: SearchResult) => res.id === result.id);
    });

    if (foundItem === undefined) return;
    switch (foundItem.model) {
    case SEARCH_MODELS.NEWS_LEAGUE:
    case SEARCH_MODELS.NEWS_WORLD: {
      return router.push(`${PATHS.news}/${result.id}`);
    }
    case SEARCH_MODELS.TEAMS: {
      return router.push(`${PATHS.teams}/${result.id}`);
    }
    case SEARCH_MODELS.PLAYERS: {
      dispatch(setPlayerId(result.id));
      return await router.push({
        pathname: PATHS.searchResults,
        search: `search=${searchValue}&player_id=${result.id}`,
      });
    }
    }
  };

  const hintsForSearchedItems = useMemo<SearchResult[]>(() => {
    const formattedSearchResults: Array<SearchResult> = [];

    for (const res of response) {
      if (res.result.length === 0) continue;
      res.result.forEach((item: SearchResult) =>
        formattedSearchResults.push(item),
      );
    }

    return formattedSearchResults;
  }, [ response ]);

  return isInputActive || !isMobile ? (
    <SearchInput
      value={searchValue}
      searchKeys={[
        'title',
        'first_name',
        'last_name',
        'name',
      ]}
      placeholder={t('search') as string}
      onChange={onChange}
      onClose={onClose}
      onFoundItemClick={handleFoundItemClick}
      onEnter={handleSubmit}
      hints={hintsForSearchedItems}
    />
  ) : null;
};
