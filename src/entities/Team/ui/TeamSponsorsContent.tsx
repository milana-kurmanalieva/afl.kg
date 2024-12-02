import { useSelector } from 'react-redux';
import TeamSponsors from '@/shared/ui/Teams/TeamSponsors/TeamSponsors';
import { REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { selectTeam } from '../model/teamSlice';


const TeamSponsorsContent = () => {
  const { teamData, teamStatus } = useSelector(selectTeam);

  if ((!teamData?.sponsors || teamData?.sponsors?.length === 0)
   && teamStatus === REQUEST_STATUSES.SUCCEEDED) return null;

  return <TeamSponsors data={teamData?.sponsors ?? []}/>;
};

export default TeamSponsorsContent;
