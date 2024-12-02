import { useTranslation } from 'react-i18next';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import { HTag } from '../HTag/HTag';
import classes from './League.module.scss';


const League = ({ leagues }: {leagues: FilterSelectOption[]}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.leagues}>
      <div className={classes.leagueTitle}>
        <HTag level={5}>
          {t('footballLeagues')}
        </HTag>
      </div>
      <div className={classes.leaguesBlock}>
        <div className={classes.leaguesList}>
          {leagues && leagues.map((league) => (
            <div key={league.id} className={classes.league}>
              <div className={classes.logo}>
                <img src={league.logo} alt={league.title}/>
              </div>
              <HTag myClass={classes.title}>
                {league.title}
              </HTag>
            </div>
          ))}
        </div>
        <div className={classes.bottomShowMore}></div>
      </div>
    </div>
  );
};

export default League;
