/* eslint-disable import/namespace */
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { FilterSelectOption, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getPlayersRating, selectPlayersRating } from '@/entities/PlayersRating/model/playersRatingSlice';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { getDivisions, selectDivisions, setCurrentDivision } from '@/entities/Divisions/model/DivisionSlice';
// eslint-disable-next-line import/no-named-as-default
import TablePlayer from '@/shared/ui/Table/TablePlayer';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import { TableInfo } from '@/shared/ui/TableInfo/TableInfo';


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

const PlayerRating: NextPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { playersRating, playersRatingStatus } = useAppSelector(selectPlayersRating);
  const { divisions, currentDivision } = useAppSelector(selectDivisions);
  const currentLeague = useAppSelector((state) => state.currentLeague.leagueId);

  const pages = [
    {
      href: '',
      disabled: true,
      page: t('statistics'),
    }, {
      href: PATHS.rating,
      page: t('playersRating'),
    },
  ];


  const handleChange = (division: FilterSelectOption) => {
    dispatch(setCurrentDivision(division));
    dispatch(getPlayersRating({ divisionId: division.id }));
  };

  useEffect(() => {
    if (!divisions.length) {
      dispatch(getDivisions({ leagueId: currentLeague }));
    }
  }, [ dispatch, currentLeague ]);

  useEffect(() => {
    if (!currentDivision.id) return;

    if (!playersRating.length) {
      dispatch(getPlayersRating({ divisionId: currentDivision.id }));
    }
  }, [ dispatch, currentDivision.id ]);

  return (
    <>
      <Meta title={t('playersRating')} description={t('playersRating') as string}>

      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('playersRating')}
          breadcrumbs={pages}
        >
          <FIlterSelect
            options={divisions}
            changeOption={handleChange}
            label={currentDivision?.title}

          />
        </TopContent>
        <BannerRow/>
        {playersRatingStatus === REQUEST_STATUSES.SUCCEEDED ? <TablePlayer
          keys={[
            { label: 'team', key: 'team' },
            { label: 'gamesLabel', key: 'games' },
            { label: 'goalsLabel', key: 'goals' },
            { label: 'assistsLabel', key: 'assists' },
            { label: 'yellowCardLabel', key: 'yel_cards' },
            { label: 'redCardLabel', key: 'red_cards' },
            { label: 'bestCount', key: 'best_player_count' },
          ]}
          table={playersRating}
        /> : <Loader center tall/>}

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
      </Container>
    </>
  );
};


export default PlayerRating;
