import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FilterSelectOption, ITbaleTeam, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectDivisions, setCurrentDivision } from '@/entities/Divisions/model/DivisionSlice';
import { HTag } from '../HTag/HTag';
import { TableRowTeam } from '../TableRow/TableRowTeam';
import { BottomShowMore } from '../BottomShowMore/BottomShowMore';
import { EmptyState } from '../EmptyState/EmptyState';
import FIlterSelect from '../FIlterSelect/FIlterSelect';
import Loader from '../loader/Loader';
import { UnCLickableWrapper } from '../UnClickableWrapper/UnClickableWrapper';
import classes from './table.module.scss';


export interface TableTeamKeys {
  label: string;
  key: keyof ITbaleTeam;
}

interface ITable {
  table: Array<ITbaleTeam>;
  title?: string;
  isSmall?: boolean;
  keys?: TableTeamKeys[];
  isSelectFilter?: boolean | null;
  filterOptions?: FilterSelectOption[] | null;
  filterOption?: FilterSelectOption | null;
  onFilterChange?: (option: FilterSelectOption) => void | null;
  headerLink?: string;
  status?: REQUEST_STATUSES;
  showMore?: () => void;
  showingInMainPage?: boolean;
  isArchive?: boolean;
  isHomePage?: boolean;
}

const defaultKeys: TableTeamKeys[] = [
  { label: 'teamTableLabelGames', key: 'games' },
  { label: 'teamTableLabelWins', key: 'wins_count' },
  { label: 'teamTableLabelDraws', key: 'draws' },
  { label: 'teamTableLabelDefeats', key: 'defeats' },
  { label: 'teamTableLabelResult', key: 'goals' },
  { label: 'teamTableLabelPoints', key: 'points' },
];

const renderTeams = (
  table: ITbaleTeam[],
  showingInMainPage: boolean,
  keys: TableTeamKeys[],
  showPosition: boolean,
  showingCupPage: boolean,
) => {
  const winnerDisplayLimitCondition = 8;
  const loserDisplayLimitCondition = (table?.length / 3) - 1;


  return table && table?.map((item, index) => (
    <TableRowTeam
      keys={keys}
      rowData={item}
      index={index}
      key={item.id}
      isLoser={showPosition && table.length - index <= loserDisplayLimitCondition}
      isWinner={showPosition && index < winnerDisplayLimitCondition}
      showingCupPage={showingCupPage}
      showLoserState={!showingInMainPage}
    />
  ));
};

function TableTeam({
  table,
  title,
  isSmall = false,
  keys = defaultKeys,
  isSelectFilter = false,
  headerLink,
  status,
  showMore,
  filterOptions,
  filterOption,
  onFilterChange,
  showingInMainPage = false,
  isArchive = false,
  isHomePage = false,
}: ITable) {
  const { t } = useTranslation();
  const isMobile = useIsMobile() || isSmall;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ showingCupPage, setShowingCupPage ] = useState(false);
  const { divisions, currentDivision } = useAppSelector(selectDivisions);

  useEffect(() => {
    const currentPage = router.pathname.substring(1);
    setShowingCupPage(currentPage !== 'cup' && currentPage !== '');
  }, [ router.pathname ]);

  const titleLevel = isMobile ? 4 : 2;
  const showPosition = useMemo(() => table?.length > 0, [ table?.length ]);

  const handleNavigate = () => {
    if (headerLink) router.push(headerLink);
  };

  const handleChangeOption = (newDivision: FilterSelectOption) => {
    dispatch(setCurrentDivision(newDivision));
  };

  const handleShowNext = () => {
    if (showMore) showMore();
    else router.push(PATHS.teams);
  };
  return (
    <div className={`${classes.tableWrapper} ${isSmall ? classes.small : ''}`}>
      <div className={classes.tableTitle}>
        <HTag level={5} >
          {t('leaderboard')}
        </HTag>
      </div>
      {title && (
        <div onClick={handleNavigate} className={isMobile ? classes.titleUnstyled : classes.title}>
          <HTag level={titleLevel}>{title}</HTag>
        </div>
      )}
      {isSelectFilter && (
        <div className={classes.filter}>
          <FIlterSelect
            secondary
            label={filterOption?.title ?? currentDivision.title}
            options={filterOptions ?? divisions}
            changeOption={onFilterChange ?? handleChangeOption}
          />
        </div>
      )}
      <UnCLickableWrapper isDisabled={isArchive} className={isHomePage ? classes.homePage : ''}>

        <table className={classes.table}>
          <thead className={isMobile ? classes.headUnstyled : classes.head}>
            <tr>
              <td>№</td>
              <td className={classes.team}>{t('teams')}</td>
              {keys.map((tableItem) => (
                <td className={classes[ tableItem.key ]} key={tableItem.key}>
                  {t(tableItem.label)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className={classes.body}>
            {renderTeams(table, showingInMainPage, keys, showPosition, showingCupPage)}
            {isSmall && (status === REQUEST_STATUSES.SUCCEEDED || !status) && !table.length && (
              <EmptyState />
            )}
            {isSmall && (status !== REQUEST_STATUSES.SUCCEEDED || !status) && (
              <div className={classes.loader}>
                <Loader center />
              </div>
            )}
          </tbody>
        </table>
      </UnCLickableWrapper>
      <UnCLickableWrapper isDisabled={isArchive}>
        {isSmall && <BottomShowMore handleNext={handleShowNext}>{t('allTeams')}</BottomShowMore>}
      </UnCLickableWrapper>
    </div>
  );
}

export default memo(TableTeam, (prevProps, nextProps) => prevProps.table === nextProps.table);
