import React, { ChangeEvent, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { PATHS, SearchResult } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { IParams } from '../type/teamsSchema';
import { getTeams, resetSearchedTeams, selectTeams } from '../model/teamsSlice';


interface ITeamSearcher {
  teamSearchValue: string;
  params: IParams;
  setTeamSearchValue: (prev: string) => void;
  setIsSearching: (prev: boolean) => void;
}

export const TeamSearcher: FC<ITeamSearcher> = ({ teamSearchValue, params, setTeamSearchValue, setIsSearching }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { teamsList } = useSelector(selectTeams);

  const handleSearchTeams = useDebounce(() => {
    dispatch(getTeams({ ...params, search: teamSearchValue, offset: 0 }));
  }, 1000);

  const handleChangeSearchTeam = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamSearchValue(e.target.value);
    handleSearchTeams();
  };

  const handleFoundItemClick = (result?: SearchResult) => {
    if (result?.id) router.push(`${PATHS.teams}/${result.id}`);
  };

  const handleSubmitSearchTeam = () => {
    setIsSearching(true);
  };

  const handleCloseSearchTeam = () => {
    setTeamSearchValue('');
    setIsSearching(false);
    dispatch(resetSearchedTeams());
  };

  useEffect(() => {
    handleCloseSearchTeam();
  }, [ params ]);

  useEffect(() => {
    if (typeof router.query.search === 'string') {
      setIsSearching(true);
      dispatch(getTeams({ ...params, search: router.query.search, offset: 0 }));
    }
  }, [ router.query.search ]);

  return (
    <SearchInput
      value={teamSearchValue}
      searchKeys={[ 'name' ]}
      placeholder={t('search') as string}
      onChange={handleChangeSearchTeam}
      onFoundItemClick={handleFoundItemClick}
      onEnter={handleSubmitSearchTeam}
      onClose={handleCloseSearchTeam}
      hints={teamsList}
    />
  );
};
