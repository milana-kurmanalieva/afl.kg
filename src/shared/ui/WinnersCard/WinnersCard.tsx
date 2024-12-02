import { HTag } from '../HTag/HTag';
import classes from './WinnersCard.module.scss';


interface IWinnersCard {
  games: number
  wins_count: number
  draws: number
  defeats: number
  goals: number
  conceded: number
  points: number
  logo: string
  name: string
  index: number
}

const WinnersCard = (props: IWinnersCard) => {
  const { games, wins_count, draws, defeats, goals, conceded, logo, name, points, index } = props;

  const stats = [
    { label: 'И', value: games ?? 0 },
    { label: 'В', value: wins_count ?? 0 },
    { label: 'Н', value: draws ?? 0 },
    { label: 'П', value: defeats ?? 0 },
    { label: 'М', value: `${goals} - ${conceded}` || 0 },
    { label: 'О', value: points ?? 0 },
  ];

  let className = '';

  switch (index) {
  case 0:
    className = classes.secondPlace;
    break;
  case 1:
    className = classes.firstPlace;
    break;
  case 2:
    className = classes.thirdPlace;
    break;
  default:
    className = '';
  }

  return (
    <div className={`${classes.winnerCard} ${className}`}>
      <div className={classes.teamLogo}>
        <img src={logo} alt={name} />
      </div>
      <div>
        <div className={classes.winnersName}>
          <HTag level={5}>{name}</HTag>
        </div>
        <div className={classes.winnerPoints}>
          {stats.map((stat, index) => (
            <div key={index} className={classes.point}>
              <HTag level={5} myClass={classes.label}>{stat.label}</HTag>
              <HTag level={5} myClass={classes.value}>{stat.value}</HTag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnersCard;
