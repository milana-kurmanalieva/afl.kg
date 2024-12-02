import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { Container } from '@/shared/ui/Container/Container';
import { REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { selectTeam } from '../model/teamSlice';


const TeamMatchesContent = () => {
  const { t } = useTranslation();

  const { teamMatchesData, teamMatchesStatus } = useSelector(selectTeam);
  const { currentDivision } = useSelector(selectDivisions);

  if (teamMatchesData.length === 0 && teamMatchesStatus === REQUEST_STATUSES.SUCCEEDED) return null;

  return (
    <Container variant='large'>
      <MatchesBlock
        title={currentDivision.title}
        matches={teamMatchesData}
        showTour={true}
        tourList={[]}
      />
    </Container>
  );
};

export default TeamMatchesContent;
