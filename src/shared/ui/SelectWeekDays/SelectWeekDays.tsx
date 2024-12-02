import React, { FC } from 'react';
import { DayNumber, WEEK_DAYS } from '@/shared/lib/constants/constants';
import classes from './weekDays.module.scss';


interface Props {
  workingDays: DayNumber[];
  onChange: (day: DayNumber, remove?: boolean) => void;
  weekDays?: number[];
}

export const SelectWeekDays: FC<Props> = ({ onChange, workingDays, weekDays }) => {
  const days = structuredClone((weekDays ?? Object.keys(WEEK_DAYS))).sort();

  return (
    <div className={classes.checkboxList}>
      {days.map((day: any) => (
        <div key={day} className={classes.checkboxInfo}>
          <input
            className={classes.checkboxLabel}
            type="checkbox"
            checked={workingDays.includes(+day as DayNumber)}
            onChange={() => onChange(+day as DayNumber, workingDays.includes(+day as DayNumber))}
          />
          <p>{WEEK_DAYS[ +day as DayNumber ]}</p>
        </div>
      ))}
    </div>
  );
};
