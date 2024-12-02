import { FC } from 'react';
import NextImage from 'next/image';
import { TeamCard } from '../Teams/TeamCard/TeamCard';
import first from '../../assets/icons/archive/first.svg';
import second from '../../assets/icons/archive/second.svg';
import third from '../../assets/icons/archive/third.svg';
import { ITeam } from '../Teams/TeamsList/TeamsList';
import classes from './PodiumCard.module.scss';


interface IPodiumCardProps {
  variant: string;
  team: ITeam,
}


const icons: Record<string, string> = {
  first_place: first,
  second_place: second,
  third_place: third,
};

const PodiumCard: FC<IPodiumCardProps> = ({ variant, team }) => {
  return (
    <div className={`${classes.card} ${classes[ variant ]}`}>
      <TeamCard team={team} />
      <div className={classes.podiumPlace}>
        <NextImage src={icons[ variant ]} alt='fds' />
      </div>
    </div>
  );
};

export default PodiumCard;
