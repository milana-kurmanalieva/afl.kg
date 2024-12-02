import { FC, HTMLAttributes } from 'react';
import { useTranslation } from 'next-i18next';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import { Button } from '../Button/Button';
import classes from './DateSelect.module.scss';


interface IDateSelectProps extends HTMLAttributes<HTMLDivElement> {
  fromTime: string;
  tillTime?: string;
  forUser?: boolean;
  onBook?: (fromTime: string, reservationId?: number) => void;
  reservationId?: number;
}

export const DateSelect: FC<IDateSelectProps> = ({ fromTime, tillTime, forUser, onBook, reservationId }) => {
  const isBooked = !!tillTime;
  const { t } = useTranslation();


  return (
    <div className={`${classes.dateSelect} ${isBooked ? classes.isTrue : ''}`}>
      <div className={classes.dateSelectTime}>
        <p>{fromTime}{tillTime ? ` - ${tillTime}` : ''}</p>
      </div>
      <div className={classes.dateSelectButton}>
        {forUser ? <p className={isBooked ? classes.booked : ''}>{isBooked ? t('isBooked') : ''}</p> :
          <Button
            variant={isBooked ? BUTTON_VARIANTS.DELETE : BUTTON_VARIANTS.PRIMARY}
            onClick={() => onBook && onBook(fromTime, reservationId)}
          >
            {isBooked ? t('delete') : t('reserve')}
          </Button>}
      </div>
    </div>
  );
};
