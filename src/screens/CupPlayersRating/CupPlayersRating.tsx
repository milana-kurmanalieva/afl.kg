/* eslint-disable import/namespace */
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getCupPlayersRating, selectPlayersRating } from '@/entities/PlayersRating/model/playersRatingSlice';
// eslint-disable-next-line import/no-named-as-default
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { TableInfo } from '@/shared/ui/TableInfo/TableInfo';
import { getCurrentCupDescription, selectCurrentCup } from '@/entities/CurrentCup/model/currentCupSlice';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';


const formulaItems = [
  { translateKey: 'goal' },
  { translateKey: 'assist' },
  { translateKey: 'yellowCard' },
  { translateKey: 'redCard' },
  { translateKey: 'recognitionBestPlayer' },
];

const designationItems = [
  { translateKey: 'game' },
  { translateKey: 'goal' },
  { translateKey: 'assist' },
  { translateKey: 'warn' },
  { translateKey: 'deletion' },
  { translateKey: 'bestCount' },
];

const CupPlayersRating: NextPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { cupPlayersRating, cupPlayersRatingStatus } = useAppSelector(selectPlayersRating);
  const { currentCup } = useAppSelector(selectCurrentCup);
  const currentLeague = useAppSelector((state) => state.currentLeague.leagueId);

  const pages = [
    {
      href: '',
      disabled: true,
      page: t('statistics'),
    }, {
      href: PATHS.rating,
      page: t('cupPlayersRating'),
    },
  ];

  useEffect(() => {
    dispatch(getCurrentCupDescription({ leagueId: currentLeague }));
  }, [ dispatch, currentLeague ]);

  useEffect(() => {
    if (currentCup?.id) dispatch(getCupPlayersRating({ cupId: currentCup.id }));
  }, [ dispatch, currentCup ]);

  return (
    <>
      <Meta title={t('cupPlayersRating')} description={t('cupPlayersRating') as string}>

      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('cupPlayersRating')}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
        {cupPlayersRatingStatus === REQUEST_STATUSES.SUCCEEDED ? <>
          <TablePlayer
            keys={[
              { label: 'team', key: 'team' },
              { label: 'gamesLabel', key: 'games' },
              { label: 'goalsLabel', key: 'goals' },
              { label: 'assistsLabel', key: 'assists' },
              { label: 'yellowCardLabel', key: 'yel_cards' },
              { label: 'redCardLabel', key: 'red_cards' },
              { label: 'bestCount', key: 'best_player_count' },
            ]}
            table={cupPlayersRating}
          />
          <TableInfo
            title={t('designationTableColumns')}
            defaultTranslateKey='DesignationPlayerRating'
            items={designationItems}
          />

          <TableInfo
            title={t('playerRatingFormula')}
            defaultTranslateKey='Formula'
            items={formulaItems}
            caption={t('playerRatingFormulaCaption') as string}
          />
        </>
          : !currentCup?.id ? <EmptyState/> : <Loader center tall/>}

      </Container>
    </>
  );
};


export default CupPlayersRating;
