import { FC } from 'react';
import { useRouter } from 'next/router';
import rightIcon from '@/icons/whiteArrowRight.svg';
import { PATHS } from '@/shared/lib/constants/constants';
import classes from './FootballFieldsCard.module.scss';


const FootballFieldsCard: FC = () => {

  const router = useRouter();

  const handleNavigate = () => {
    router.push(PATHS.catalog + '?catalog=fields');
  };

  return (
    <div className={classes.card} onClick={handleNavigate}>
      <div className={classes.cardText}>
        <p>Футбольные</p>
        <h4>Поля</h4>
      </div>
      <div className={classes.cardLinks}>
        <button>Посмотреть здесь</button>
        <img src={rightIcon.src} alt="right icon" />
      </div>
    </div>
  );
};

export default FootballFieldsCard;
