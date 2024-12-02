import { Place1 } from '@/shared/assets/icons/Place1';
import { Place2 } from '@/shared/assets/icons/Place2';
import { Place3 } from '@/shared/assets/icons/Place3';
import { HTag } from '../HTag/HTag';
import classes from './WinnerPlaceCard.module.scss';


interface IProps {
  image: string
  name: string
  captain: string
  place: number
}

export const WinnerPlaceCard = ({ image, name, captain, place }: IProps) => {
  let placeIcon;
  let placeClass;

  switch (place) {
  case 1:
    placeIcon = <Place1 />;
    placeClass = `${classes.winner} ${classes.firstPlace}`;
    break;
  case 2:
    placeIcon = <Place2 />;
    placeClass = `${classes.winner} ${classes.secondPlace}`;
    break;
  case 3:
    placeIcon = <Place3 />;
    placeClass = `${classes.winner} ${classes.thirdPlace}`;
    break;
  default: placeIcon = null;
    placeClass = '';
    break;
  }
  return (
    <div className={placeClass}>
      <div className={classes.card}>
        <div className={classes.winnerLogo}>
          <img src={image} alt='logo'/>
        </div>
        <div className={classes.winnerData}>
          <HTag level={5}>{name}</HTag>
          <HTag level={5} myClass={classes.captain}>{captain}</HTag>
        </div>
      </div>
      <div className={classes.place}>
        {placeIcon}
      </div>
    </div>
  );
};
