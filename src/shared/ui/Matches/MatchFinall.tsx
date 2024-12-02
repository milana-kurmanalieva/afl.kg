import { format } from 'date-fns';
import Link from 'next/link';
import redCardIcon from '@/icons/redCard.svg';
import { CupInfo, MatchInfo } from '@/entities/Matches/type/MatchSchema';
import { DATE_FORMAT, IMatchesItem, MATCH_TYPE, PATHS } from '@/shared/lib/constants/constants';
import { HTag } from '../HTag/HTag';
import classes from './matches.module.scss';


export type MatchesType = Partial<MatchInfo & IMatchesItem & CupInfo >

export const MatchFinall = ({ match } : { match: MatchesType }) => {

  const teamOneLogo = match?.team_one?.logo;
  const teamTwoLogo = match?.team_two?.logo;

  return (
    <>
      {MATCH_TYPE.CUP_MATCH ?
        <>
          <p className={classes.matchTourDate}>{format(new Date(match.date as string), DATE_FORMAT)}</p>
          <p className={classes.time}>{format(new Date(match.date as string), 'HH:mm')}</p>
        </>
        : <div className={classes.matchDescription}>
          {typeof match?.tour === 'object' &&
           <>
             <p className={classes.matchTourDate}>{match?.tour?.date}</p>
             <p className={classes.matchNumber}>{match?.tour?.number}</p>
           </>
          }
        </div>}
      <div className={classes.matchInfo}>
        <div className={classes.cupTeam}>
          <Link href={`${PATHS.teams}/${match.team_one?.id}`} className={classes.teamLogo}>
            <img className={classes.teamLogoImage} src={teamOneLogo} alt="Logo1"></img>
          </Link>
          <p className={classes.matchTeamName}>{match?.team_one?.name}</p>
        </div>
        <div className={classes.resultBlock}>
          <p className={classes.matchResult} >{match.alt_result ? match.alt_result : match.result}</p>
          {!!match.description && <p className={classes.description}>{match.description}</p>}
        </div>
        <div className={classes.cupTeam}>
          <Link href={`${PATHS.teams}/${match.team_two?.id}`} className={classes.teamLogo}>
            <img className={classes.teamLogoImage} src={teamTwoLogo} alt="Logo2"></img>
          </Link>
          <p className={classes.matchTeamName}>{match?.team_two?.name}</p>
        </div>
      </div>
      <div className={classes.matchDescription}>
        <p>Судья: {match?.judge}</p>
        <p className={classes.matchLocation}>Место проведения: {match?.location}</p>
      </div>
      {!!match?.disqualificated_players?.length && <div className={classes.deletedPlayers}>
        <div>
          <img src={redCardIcon.src} alt="redCard" />
          <HTag level={4}>Дисквалифицированные игроки:</HTag>
        </div>
        <ul>
          {match.disqualificated_players.map(item => (
            <li key={item.id}>
              {item.last_name} {item.first_name}
            </li>
          ))}
        </ul>
      </div>}
    </>
  );
};
