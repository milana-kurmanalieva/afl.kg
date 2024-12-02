import { FC } from 'react';
import { useRouter } from 'next/router';
import rightIcon from '@/icons/redArrowRight.svg';
import { PATHS } from '@/shared/lib/constants/constants';
import classes from './SportShopsCard.module.scss';


const SportShopsCard: FC = () => {

  const router = useRouter();

  const handleNavigate = () => {
    router.push(PATHS.catalog + '?catalog=shops');
  };

  return (
    <div className={classes.card} onClick={handleNavigate}>
      <div className={classes.cardText}>
        <p>Спортивные</p>
        <h4>Магазины</h4>
      </div>
      <div className={classes.cardLinks}>
        <button>Посмотреть здесь</button>
        <img src={rightIcon.src} alt="right icon" />
      </div>
    </div>
  );
};

export default SportShopsCard;
