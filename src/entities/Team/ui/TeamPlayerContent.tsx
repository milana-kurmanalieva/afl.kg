import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { Container } from '@/shared/ui/Container/Container';
import { HTag } from '@/shared/ui/HTag/HTag';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { BannerRow } from '@/entities/Banners';
import { selectTeam } from '../model/teamSlice';
import classes from './Team.module.scss';


const TeamPlayerContent = () => {
  const { t } = useTranslation();
  const { teamPlayersData, archiveTeamPlayersData } = useSelector(selectTeam);
  const { currentArchiveChampionShip } = useAppSelector((state) => state.archiveChampionShip);


  const teamPlayers = archiveTeamPlayersData.length
    ?
    archiveTeamPlayersData : teamPlayersData;

  const archiveTitle = currentArchiveChampionShip?.title.replace(' ', ' сезон ');

  if (teamPlayers.length) {
    return (
      <div className={classes.main}>
        <Container variant='large'>
          <BannerRow/>
        </Container>

        <Container variant='mid'>
          <HTag level={3}>
            {teamPlayers === archiveTeamPlayersData
              ? archiveTitle
              : t('commandStructure')}
          </HTag>
          <PlayersList isAbleToOpenCard={true} players={teamPlayers}/>
        </Container>
      </div>
    );
  }

  return null;
};

export default TeamPlayerContent;
