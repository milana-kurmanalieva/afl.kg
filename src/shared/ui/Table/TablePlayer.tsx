import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';
// eslint-disable-next-line import/named
import { DefaultTFuncReturn } from 'i18next';
import { useTranslation } from 'next-i18next';
import {
  ITbalePlayer,
  REQUEST_STATUSES,
} from '@/shared/lib/constants/constants';
// eslint-disable-next-line import/namespace
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  selectDivisions,
  setCurrentDivision,
} from '@/entities/Divisions/model/DivisionSlice';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
// eslint-disable-next-line import/namespace
import { BottomShowMore } from '../BottomShowMore/BottomShowMore';
import { EmptyState } from '../EmptyState/EmptyState';
import FIlterSelect from '../FIlterSelect/FIlterSelect';
import { HTag } from '../HTag/HTag';
import Loader from '../loader/Loader';
import { TableRowPlayer } from '../TableRow/TableRowPlayer';
import { UnCLickableWrapper } from '../UnClickableWrapper/UnClickableWrapper';
import classes from './table.module.scss';


export interface ITableItem {
  label: string;
  key: keyof ITbalePlayer;
}

interface ITable {
  table: Array<ITbalePlayer>;
  keys: ITableItem[];
  title?: string | DefaultTFuncReturn;
  isSmall?: boolean;
  showImages?: boolean;
  isSelectFilter?: boolean;
  headerLink?: string;
  status?: REQUEST_STATUSES;
  isArchive?: boolean;
}

export const TablePlayer = ({
  table,
  title,
  keys,
  isSmall,
  showImages,
  isSelectFilter = false,
  headerLink,
  status,
  isArchive = false,
}: ITable) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile() || isSmall;
  const router = useRouter();
  const titleLevel = isMobile ? 4 : 2;
  const dispatch = useAppDispatch();

  const { divisions, currentDivision } = useAppSelector(selectDivisions);

  const handleShowNext = () => {
    if (headerLink) router.push(headerLink);
  };
  const resultKeys = useMemo(() => {
    if (isMobile) return keys.filter((item) => item.key !== 'team');
    return keys;
  }, [ isMobile, keys ]);

  const handleNavigate = () => {
    if (headerLink) router.push(headerLink);
  };
  return (
    <div className={`${classes.tableWrapper} ${isSmall ? classes.small : ''}`}>
      {!!title && (
        <div
          onClick={handleNavigate}
          className={isMobile ? classes.titleUnstyled : classes.title}
        >
          <HTag level={titleLevel}>{title}</HTag>
        </div>
      )}
      {isSelectFilter && (
        <div className={classes.filter}>
          <FIlterSelect
            secondary
            label={currentDivision.title}
            options={divisions}
            changeOption={(newDivision) =>
              dispatch(setCurrentDivision(newDivision))
            }
          />
        </div>
      )}
      <UnCLickableWrapper isDisabled={isArchive}>
        <table className={`${classes.table} ${classes.tablePlayer}`}>
          <thead className={isMobile ? classes.headUnstyled : classes.head}>
            <tr>
              <td>№</td>
              <td className={classes.player}>{t('players')}</td>
              {keys.map((tableItem) => (
                <td className={classes[ tableItem.key ]} key={tableItem.key}>
                  {t(tableItem.label)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className={classes.body}>
            {(status === REQUEST_STATUSES.SUCCEEDED || !status) &&
              table?.length > 0 &&
              table.map((item, index) => (
                <TableRowPlayer
                  keys={resultKeys}
                  rowData={item}
                  index={index}
                  key={item.id}
                  isSmall={isSmall}
                  showImages={showImages}
                />
              ))}

            {isSmall &&
              (status === REQUEST_STATUSES.SUCCEEDED || !status) &&
              !table?.length && <EmptyState />}
            {isSmall && (status !== REQUEST_STATUSES.SUCCEEDED || !status) && (
              <div className={classes.loader}>
                <Loader center />
              </div>
            )}
          </tbody>
        </table>
      </UnCLickableWrapper>
      <UnCLickableWrapper isDisabled={isArchive}>
        {isSmall && (
          <BottomShowMore handleNext={handleShowNext}>
            {t('allBombardiers')}
          </BottomShowMore>
        )}
      </UnCLickableWrapper>
    </div>
  );
};

export default memo(TablePlayer, (prevProps, nextProps) => {
  return prevProps.table === nextProps.table;
});
