import { FC, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ru from 'date-fns/locale/ru';
import { getDaysInMonth } from 'date-fns';
import { DayNumber } from '@/shared/lib/constants/constants';
import classes from './date.module.scss';


interface IDatePickerProps {
  onChangeDate: (date?: Date) => void;
  selected?: Date;
  workingDays?: DayNumber[]
}

export const DatePickerComponent: FC<IDatePickerProps> = ({ onChangeDate, selected, workingDays = [] }) => {

  const today = new Date();

  const [ selectedMonth, setSelectedMonth ] = useState(new Date());

  const disabledDays = useMemo(() => {
    const output = [];

    const daysCount = getDaysInMonth(selectedMonth);

    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    for (let i = 1; i <= daysCount; i ++) {
      const date = new Date(year, month, i);
      let day = date.getDay();

      if (day === 0) day = 7;

      if (!workingDays.includes(day as DayNumber)) {
        output.push(date);
      }
    }

    output.push({
      from: new Date(1970, 1, 1),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    });

    return output;
  }, [ selectedMonth, workingDays ]);

  return (
    <DayPicker
      className={classes.datePicker}
      mode='single'
      locale={ru}
      selected={selected ?? today}
      onMonthChange={(newDate) => newDate && setSelectedMonth(newDate)}
      onSelect={onChangeDate}
      modifiersStyles={{ selected: { backgroundColor: '#F41414', padding: '25px' } }}
      disabled={disabledDays}
    />
  );
};
