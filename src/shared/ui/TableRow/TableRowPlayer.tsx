import { FC, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ITbalePlayer, PATHS } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { setPlayerId } from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import { truncateText } from '@/shared/lib/helpers/helpers';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import classes from './tableRow.module.scss';


interface ITableRowPlayer {
  rowData: ITbalePlayer;
  index: number;
  keys: {
    label: string;
    key: keyof ITbalePlayer;
  }[];
  isSmall?: boolean;
  showImages?: boolean;
}

export const TableRowPlayer:FC<ITableRowPlayer> = ({ rowData, index, keys, isSmall, showImages }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();

  const teamKillBoxRef = useRef<HTMLAnchorElement>(null);

  const handleOpenPlayer = (e: any) => {
    if (teamKillBoxRef.current && teamKillBoxRef.current.contains(e.target)) {
      return;
    }
    dispatch(setPlayerId(rowData.id));
  };

  const handleOpenTeam = (teamId: number) => {
    router.push(`${PATHS.teams}/${teamId}`);
  };
  return (
    <tr className={`${classes.row} ${isSmall ? classes.smallRow : ''} ${showImages ? classes.expandInfo : ''}`}>
      <td>{index + 1}</td>
      <td onClick={handleOpenPlayer} className={classes.player}>
        {showImages ? <div className={classes.teamPlayer}>
          <img className={classes.avatar} src={rowData.avatar} alt='avatar' />
          <div className={classes.textContent}>

            <span className={classes.name}>{truncateText(`${rowData.first_name} ${rowData.last_name}`, 24)}</span>

            <Link ref={teamKillBoxRef} href={`${PATHS.teams}/${rowData.team_id}`} className={classes.teamInfo}>
              <img className={classes.teamLogo} src={rowData.team_logo } alt="logo" />
              <p>{truncateText(rowData.team, 18)}</p>
            </Link>
          </div>
        </div> : <span className={classes.name}>{rowData.first_name} {rowData.last_name}</span>}
      </td>

      {keys.map((el, index) => {
        if (!isMobile && index === 0) return (
          <td
            onClick={() => handleOpenTeam(rowData.team_id || Number(rowData.team))}
            className={classes.command}
            key={el.label}
          >
            {rowData?.team_name || rowData?.team}
          </td>
        );

        return <td key={el.label}>{rowData[ el.key ]}</td>;
      })}
    </tr>
  );
};
