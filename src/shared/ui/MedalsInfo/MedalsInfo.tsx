import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import medalIcon1 from '@/icons/1st-place-medal.svg';
import medalIcon2 from '@/icons/2nd-place-medal.svg';
import medalIcon3 from '@/icons/3rd-place-medal.svg';
import classes from './MedalsInfo.module.scss';


const medals = [
  medalIcon1,
  medalIcon2,
  medalIcon3,
];


const MedalsInfo: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.infoBlockMedals}>
      <div className={classes.titleBlock}>
        <span>Информация</span>
      </div>
      <div className={classes.contentBlock}>
        <div className={classes.medalsBlock}>
          <div className={classes.medals}>
            {medals.map((icon, iconIndex) => (
              <img src={icon.src} alt="medal icon" key={iconIndex}/>
            ))}
          </div>
          <div className={classes.greenBlock}>1</div>
          <div className={classes.redBlock}>1</div>
        </div>
        <div className={classes.contentText}>
          <p>{t('topPlaces')}</p>
          <p>{t('ticketToTheSuperCup')}</p>
          <p>{t('departureArea')}</p>
        </div>
      </div>
    </div>
  );
};

export default MedalsInfo;
