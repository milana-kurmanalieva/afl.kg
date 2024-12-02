import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import { DayNumber, FilterSelectOption } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { SelectWeekDays } from '@/shared/ui/SelectWeekDays/SelectWeekDays';
import classes from './working.module.scss';


interface Props {
  hours: FilterSelectOption[];
  workingDays: DayNumber[];
  setWorkingDays: Dispatch<SetStateAction<DayNumber[]>>;
  fromTime: string;
  setFromTime: Dispatch<SetStateAction<string>>;
  tillTime: string;
  setTillTime: Dispatch<SetStateAction<string>>;
}

export const WorkingTime: FC<Props> = ({
  hours,
  workingDays,
  setWorkingDays,
  fromTime,
  setFromTime,
  tillTime,
  setTillTime,
}) => {
  const { t } = useTranslation();


  return (
    <div>
      <p>{t('schedule')}</p>

      <div className={classes.selectHours}>
        <FIlterSelect
          secondary
          className={classes.select}
          options={hours}
          label={fromTime}
          changeOption={(time) => setFromTime(time.title)}
        />
        <FIlterSelect
          secondary
          className={classes.select}
          options={hours}
          label={tillTime}
          changeOption={(time) => setTillTime(time.title)}
        />
      </div>

      <div className={classes.selectDays}>
        <SelectWeekDays
          workingDays={workingDays}
          onChange={(day, remove) => {
            let newDays = [];
            if (remove) newDays = workingDays.filter(item => item !== day);
            else newDays = [ ...workingDays, day ];

            setWorkingDays(newDays);
          }}
        />
      </div>

    </div>
  );
};
