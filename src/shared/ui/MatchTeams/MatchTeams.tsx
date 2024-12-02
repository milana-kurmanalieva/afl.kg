import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { PATHS, TeamMatch } from '@/shared/lib/constants/constants';
import { HTag } from '../HTag/HTag';
import classes from './MatchTeams.module.scss';


interface IMatchTeamsProps {
  date?: string;
  tour?: string
  result?: string;
  location?: string
  judge?: string | number
  team_one?: TeamMatch
  team_two?: TeamMatch
  division?: string
}


const MatchTeams = ({
  date,
  tour,
  result,
  location,
  judge,
  team_one,
  team_two,
  division,
}: IMatchTeamsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <HTag level={5} myClass={classes.date} center>
          {date}
        </HTag>
        {division && tour && (
          <HTag level={5} myClass={classes.tour} center>
            {division} {tour}
          </HTag>
        )}
      </div>
      <div className={classes.score}>
        <Link href={`${PATHS.teams}/${team_one?.id}`}>
          <div className={classes.teamCard}>
            <div className={classes.teamLogo}>
              <img src={team_one?.logo} alt={team_one?.logo} />
            </div>
            <HTag level={5} center myClass={classes.teamName}>
              {team_one?.name}
            </HTag>
          </div>
        </Link>
        <HTag level={2} myClass={classes.result}>
          {result}
        </HTag>
        <Link href={`${PATHS.teams}/${team_two?.id}`}>
          <div className={classes.teamCard}>
            <div className={classes.teamLogo}>
              <img src={team_two?.logo} alt={team_one?.logo} />
            </div>
            <HTag level={5} center myClass={classes.teamName}>
              {team_two?.name}
            </HTag>
          </div>
        </Link>
      </div>
      <div className={classes.info}>
        <HTag level={5} center >
          {t('judge')}: {judge}
        </HTag>
        <HTag level={5} center>
          {t('location')}: {location}
        </HTag>
      </div>

    </>
  );
};

export default MatchTeams;
