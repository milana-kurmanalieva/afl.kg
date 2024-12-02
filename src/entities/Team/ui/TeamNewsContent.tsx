import { useSelector } from 'react-redux';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { Container } from '@/shared/ui/Container/Container';
import { selectTeam } from '../model/teamSlice';
import classes from './Team.module.scss';


const TeamNewsContent = () => {

  const { teamNewsData } = useSelector(selectTeam);

  if (!teamNewsData.length) return <></>;

  return (
    <div className={classes.mainNews}>
      <Container variant='large'>
        <NewsList newsList={teamNewsData}/>
      </Container>
    </div>
  );
};

export default TeamNewsContent;
