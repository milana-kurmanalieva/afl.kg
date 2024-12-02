import { useSelector } from 'react-redux';
import TeamTopContent from '@/shared/ui/Teams/TeamTopContent/TeamTopContent';
import { selectTeam } from '../model/teamSlice';


const TeamContent = () => {

  const { teamData } = useSelector(selectTeam);

  return <TeamTopContent data={teamData} />;
};

export default TeamContent;
