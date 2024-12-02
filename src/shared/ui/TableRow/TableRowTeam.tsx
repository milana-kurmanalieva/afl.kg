import { useRouter } from 'next/router';
import { ITbaleTeam, PATHS } from '@/shared/lib/constants/constants';
import medalIcon1 from '@/icons/1st-place-medal.svg';
import medalIcon2 from '@/icons/2nd-place-medal.svg';
import medalIcon3 from '@/icons/3rd-place-medal.svg';
import { TableTeamKeys } from '../Table/TableTeam';
import classes from './tableRow.module.scss';


interface ITableRowTeam {
  rowData: ITbaleTeam;
  index: number;
  keys: TableTeamKeys[];
  isLoser?: boolean;
  isWinner?: boolean;
  showingCupPage?: boolean;
  showLoserState?: boolean;
}

const medals = [
  medalIcon1,
  medalIcon2,
  medalIcon3,
];

export const TableRowTeam = ({
  rowData,
  index,
  keys,
  isLoser,
  isWinner,
  showingCupPage = true,
  showLoserState = true,
}: ITableRowTeam) => {
  const router = useRouter();
  const MEDAL_COUNT = 3;

  const handleNavigate = () => {
    router.push(`${PATHS.teams}/${rowData.id}`);
  };

  const showMedal = showingCupPage && index < MEDAL_COUNT;
  const showWinner = isWinner && showingCupPage;

  return (
    <tr className={classes.row} onClick={handleNavigate}>
      <td
        data-rating={index + 1}
        className={`${showLoserState && isLoser ? classes.loser : ''} ${showWinner ? classes.winner : ''}`}
      >
        {index + 1}
        {showMedal && (
          <div className={classes.icons}>
            <img src={medals[ index ].src} alt="medal" />
          </div>
        )}
      </td>
      <td className={classes.team}>
        <div className={`${classes.teamHero} ${showingCupPage ? '' : classes.withoutMedal}`}>
          <img src={rowData.logo} alt={rowData.name} />
          <span className={classes.teamName}>{rowData.name}</span>
        </div>
      </td>
      {keys.map(el => {
        if (el.key === 'goals') {
          return (
            <td key={el.key} className={classes.result}>
              {rowData.goals}-{rowData.conceded}
            </td>
          );
        }
        return <td key={el.label}>{rowData[ el.key ]}</td>;
      })}
    </tr>
  );
};
