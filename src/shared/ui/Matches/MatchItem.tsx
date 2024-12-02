import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MATCH_TYPE, PATHS } from '@/shared/lib/constants/constants';
import { useAppSelector } from '@/app/providers/StoreProvider';
import classes from './matches.module.scss';
import { MatchesType } from './MatchFinall';


interface MatchItemProps {
  match: MatchesType
  type?: string;
  label?: string;
  status?: string;
}

interface IMatchStatus {
  [key: string]: string | React.ReactNode;
}
interface IClassStatus {
  [key: string]: string;
}


export const MatchItem = ({ match, type, label, status = 'default' }: MatchItemProps) => {
  const { t } = useTranslation();
  const classStatus: IClassStatus = {
    default: classes.status,
    completed: classes.statusCompleted,
    rescheduled: classes.statusRescheduled,
    await: classes.statusAwait,
    is_on: classes.statusIsOn,
  };
  const { divisionSelect } = useAppSelector((state) => state.archive);

  const matchDate = match.date;
  const matchTime = matchDate?.slice(matchDate.length - 5);
  const matchDateFormatted = matchDate?.slice(0, matchDate.length - 5);


  const matchType = match.tour ? MATCH_TYPE.MATCH : MATCH_TYPE.CUP_MATCH;

  const champIdParam = useMemo(() => {
    if (!divisionSelect) return '';
    return `?champId=${divisionSelect?.id}`;
  }, [ divisionSelect ]);

  return (
    <li className={classes[ type as string ]}>
      <Link href={`${PATHS.matches}?id=${match.id}&type=${matchType}`} className={classes.linkStyle}>
        <p className={classStatus[ status ]}>
          <span className={classes.matchDate}>{matchDateFormatted}</span>
          <span className={classes.matchTime}>{matchTime}</span>
        </p>
        <div className={classes.teams}>
          <div className={classes.team}>
            <Link href={`${PATHS.teams}/${match.team_one?.id}${champIdParam}`}>
              <p className={classes.teamName}>{match?.team_one?.name || String(match.team_one)}</p>
              <img className={classes.logo}
                src={match?.team_one?.logo || match.team_one_logo}
                alt={String(match.team_one)}
              />
            </Link>
          </div>

          <p className={classes.result}>{match.alt_result ? match.alt_result : match.score || match.result}</p>

          <div className={classes.team}>
            <Link
              href={`${PATHS.teams}/${match.team_two?.id}${champIdParam}`}
            >
              <img className={classes.logo}
                src={match?.team_two?.logo || match.team_two_logo}
                alt={String(match.team_two)}
              />
              <p className={classes.teamName}>{match?.team_two?.name || String(match.team_two)}</p>
            </Link>
          </div>
        </div>
      </Link>
    </li>
  );
};
