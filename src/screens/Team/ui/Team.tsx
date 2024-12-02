// Team.tsx

import { useTranslation } from 'next-i18next';
import { NextPage } from 'next';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Meta } from '@/shared/ui/seo/Meta';
import {
  TeamContent,
  TeamMatchesContent,
  TeamNewsContent,
  TeamPlayerContent,
  TeamSponsorsContent,
} from '@/entities/Team';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import {
  getArchiveTeamPlayers,
  getTeam,
  getTeamMatches,
  getTeamNews,
  getTeamPlayers,
  getTeamRating,
  selectTeam,
} from '@/entities/Team/model/teamSlice';
import Loading from '@/screens/Loader/Loading';
import { Container } from '@/shared/ui/Container/Container';
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import { FilterSelectOption, TABLE_KEYS } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';


const Team: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { champId } = router.query;

  const id = router.query.id as string;
  const [ isLoading, setIsLoading ] = useState(false);
  const { teamRating, teamData } = useSelector(selectTeam);
  const [ selectedFilter, setSelectedFilter ] = useState({
    id: 1,
    title: t('championship'),
  });

  const getTeamData = async (filter: FilterSelectOption) => {
    setIsLoading(true);

    await Promise.all([
      dispatch(getTeam(id)),
      dispatch(getTeamMatches({ matches_by: filter.value === 'cup' ? 'cup' : '', id })),
      dispatch(getTeamRating({ rating: filter.value === 'cup' ? 'cup' : '', id })),
    ]);

    if (champId) {
      dispatch(getArchiveTeamPlayers({ id: id, champId: champId }));
    } else {
      dispatch(getTeamPlayers(id));
    }

    setIsLoading(false);
  };

  const filterOption = [
    {
      title: t('championship'),
      value: 'Чемпионат',
      id: 1,
    }, {
      title: t('cup'),
      value: 'cup',
      id: 2,
    },
  ];

  const handleFilterChange = (filter: FilterSelectOption) => {
    setSelectedFilter(filter);
    getTeamData(filter);
  };

  useLayoutEffect(() => {
    if (!id) return;
    getTeamData(selectedFilter);
  }, [ id, selectedFilter ]);

  useEffect(() => {
    const tagId = teamData?.tag?.id;
    if (tagId) dispatch(getTeamNews(tagId));
  }, [ teamData?.tag?.id ]);


  return (
    <>
      <Meta title={t('team')} description='New about football' />
      {(isLoading || !id) ? <Loading/> : (
        <>
          <TeamContent />
          <TeamPlayerContent />
          <Container>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <FIlterSelect
                label={selectedFilter ? selectedFilter.title : ''}
                options={filterOption}
                changeOption={handleFilterChange}
              />
            </div>
            <TablePlayer
              isArchive={true}
              table={teamRating}
              keys={[
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                { label: '', key: 'empty' },
                { label: TABLE_KEYS.GAMES, key: 'games' },
                { label: TABLE_KEYS.GOALS, key: 'goals' },
                { label: TABLE_KEYS.A, key: 'assists' },
                { label: TABLE_KEYS.P, key: 'yel_cards' },
                { label: TABLE_KEYS.U, key: 'red_cards' },
                { label: 'bestCount', key: 'best_player_count' },
              ]}
            />
          </Container>
          <TeamMatchesContent />
          <TeamSponsorsContent />
          <TeamNewsContent />
        </>
      )}
    </>
  );
};

export default Team;
