import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PATHS, SEARCH_MODELS, styleVariants } from '@/shared/lib/constants/constants';
import { TeamsList } from '@/shared/ui/Teams/TeamsList/TeamsList';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { HTag } from '@/shared/ui/HTag/HTag';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ShowAllLink } from '@/shared/ui/ShowAllLink/ShowAllLink';
import Loader from '@/shared/ui/loader/Loader';
import { selectSearchHeader } from '../model/searchHeaderSlice';
import classes from './search.module.scss';


const modelCount = 4;

export const SearchResultsContainer = () => {
  const { t } = useTranslation();
  const { searchValue, displayResults } = useSelector(selectSearchHeader);
  const [ isEmpty, setIsEmpty ] = useState(false);

  const pages = [ { href: PATHS.searchResults, page: t('search') } ];

  const results = [
    {
      title: t('teams'),
      href: `${PATHS.teams}?search=${searchValue}`,
      model: SEARCH_MODELS.TEAMS,
    },
    {
      title: t('players'),
      href: `${PATHS.players}?search=${searchValue}`,
      model: SEARCH_MODELS.PLAYERS,
    },
    {
      title: t('leagueNews'),
      href: `${PATHS.news}?search=${searchValue}`,
      model: SEARCH_MODELS.NEWS_LEAGUE,
    },
    {
      title: t('mainNews'),
      href: `${PATHS.worldNews}?search=${searchValue}`,
      model: SEARCH_MODELS.NEWS_WORLD,
    },
  ];

  const data = useMemo(() => {
    const map = new Map();
    let emptyResultsCount = 0;

    for (const { result, model } of displayResults) {
      if (!result.length) emptyResultsCount ++;
      map.set(model, result);
    }

    setIsEmpty(emptyResultsCount === modelCount);

    return map;
  }, [ displayResults ]);


  const displaySearchQuery = useMemo(() => {
    return searchValue;
  }, [ displayResults ]);

  const renderList = (model: SEARCH_MODELS) => {
    switch (model) {
    case SEARCH_MODELS.TEAMS: return <TeamsList teamsList={data.get(model)}/>;
    case SEARCH_MODELS.PLAYERS: return <PlayersList isAbleToOpenCard={true} players={data.get(model)}/>;
    case SEARCH_MODELS.NEWS_WORLD:
    case SEARCH_MODELS.NEWS_LEAGUE: return (
      <NewsList
        title={''}
        listVariant={styleVariants.big}
        cardVariant={styleVariants.big}
        newsList={data.get(model)}
      />
    );
    case SEARCH_MODELS.TEAMS: return (
      <NewsList
        title={''}
        listVariant={styleVariants.small}
        cardVariant={styleVariants.small}
        newsList={data.get(model)}
      />
    );
    }
  };

  return (
    <>
      <TopContent
        className={classes.topContent}
        breadcrumbs={pages}
        title={`${t('byRequest')}: ${displaySearchQuery}`}
      />
      {!displayResults.length && <Loader center/>}
      <ul className={classes.results}>
        {results.map((item) => (
          data.get(item.model)?.length > 0 && (
            <li key={item.title} className={classes.resultItem}>
              <div className={classes.topResult}>
                <HTag level={4}>{item.title}</HTag>
                <ShowAllLink href={item.href}/>
              </div>
              {renderList(item.model)}
            </li>)
        ))}
        {isEmpty && <EmptyState/>}
      </ul>
    </>
  );
};
