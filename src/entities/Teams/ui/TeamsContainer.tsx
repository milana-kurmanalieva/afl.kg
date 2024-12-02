import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { TeamsList } from '@/shared/ui/Teams/TeamsList/TeamsList';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { FilterSelectOption, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { getTeamsInfinity, resetTeams, selectTeams } from '@/entities/Teams/model/teamsSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getDivisions, selectDivisions, setCurrentDivision } from '@/entities/Divisions/model/DivisionSlice';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { TeamSearcher } from './TeamSearcher';


const limit = 12;

const TeamsContainer = () => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const { leagueId, currentLeague }: currentLeagueState = useSelector(selectCurrentLeague);
  const { currentDivision, divisions } = useSelector(selectDivisions);
  const { teamsResponse, teamsStatus, teamsList, teamsListStatus } = useSelector(selectTeams);

  const dispatch = useAppDispatch();

  const [ teamSearchValue, setTeamSearchValue ] = useState('');
  const [ isSearching, setIsSearching ] = useState(false);

  const pages = [
    {
      href: '',
      page: currentLeague.title,
      disabled: true,
    }, {
      href: PATHS.teams,
      page: t('teams'),
    },
  ];

  const teamParams = useMemo(() => {
    return {
      limit,
      offset: teamsResponse.results.length,
      leagueId,
      division: currentDivision?.id,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ currentDivision, teamsResponse.results.length ]);

  const handleLoadMore = useCallback(() => {
    dispatch(getTeamsInfinity(teamParams));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ teamParams ]);

  const handleChangeDivision = (division: FilterSelectOption) => {
    dispatch(setCurrentDivision(division));
  };

  useEffect(() => {
    if (!divisions.length) {
      dispatch(getDivisions({ leagueId }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  useEffect(() => {
    if (currentDivision.id) dispatch(getTeamsInfinity({ ...teamParams, offset: 0 }));

    return () => {
      dispatch(resetTeams());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ currentDivision ]);

  return (
    <>
      <TopContent
        title={t('teams')}
        breadcrumbs={pages}
      >
        {
          isMobile
            ?
            <>
              <TeamSearcher
                teamSearchValue={teamSearchValue}
                setTeamSearchValue={setTeamSearchValue}
                setIsSearching={setIsSearching}
                params={teamParams}
              />
              <FIlterSelect
                options={divisions}
                label={currentDivision?.title}
                changeOption={handleChangeDivision}
              />
            </>
            :
            <>
              <FIlterSelect
                options={divisions}
                label={currentDivision?.title}
                changeOption={handleChangeDivision}
              />
              <TeamSearcher
                teamSearchValue={teamSearchValue}
                setTeamSearchValue={setTeamSearchValue}
                setIsSearching={setIsSearching}
                params={teamParams}
              />
            </>
        }

      </TopContent>
      <BannerRow/>
      {((isSearching && teamsListStatus === REQUEST_STATUSES.SUCCEEDED && teamsList.length === 0) ||
       (teamsResponse.count === 0 && teamsStatus === REQUEST_STATUSES.SUCCEEDED)
       || teamsStatus !== REQUEST_STATUSES.SUCCEEDED) && (
        <Loader center/>
      )}
      {!!divisions.length && isSearching ? <TeamsList teamsList={teamsList}/> : (
        <LoadMoreContainer
          loadMore={handleLoadMore}
          hasMore={!!teamsResponse.next}
        >
          <TeamsList
            isLoading={teamsStatus === REQUEST_STATUSES.REQUESTED}
            teamsList={teamsResponse.results}
            limit={limit}
          />
        </LoadMoreContainer>
      )}
    </>
  );
};

export default TeamsContainer;
