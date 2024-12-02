import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { getOurTeam, selectOurTeam } from '@/entities/OurTeam/model/OurTeamSlice';
import { CardPersonVariant, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import classes from './ourTeam.module.scss';


export const OurTeamPage: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { leagueId, currentLeague }:currentLeagueState = useSelector(selectCurrentLeague);

  const { ourTeamData, ourTeamStatus } = useSelector(selectOurTeam);
  const pages = [
    {
      href: PATHS.ourteam,
      page: t('ourTeam'),
    },
  ];


  useEffect(() => {
    dispatch(getOurTeam(leagueId));

  }, [ dispatch, leagueId ]);

  if (ourTeamStatus !== REQUEST_STATUSES.SUCCEEDED) return (
    <div className={classes.loader}>
      <Loader />
    </div>
  );


  return (
    <>
      <Meta title={t('ourTeam')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={`Оргкомитет ${currentLeague.title}`}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
      </Container>
      <Container>
        <PlayersList players={ourTeamData} variant={CardPersonVariant.OUR_TEAMS} />
      </Container>
    </>
  );
};
