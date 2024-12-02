import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import { v4 as uuidv4 } from 'uuid';
import { AddButton } from '@/shared/ui/AddButton/AddButton';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import { Input } from '@/shared/ui/Input/Input';
import close from '@/icons/closeDark.svg';
import classes from './payments.module.scss';


interface TimePayment {
  id: number | string;
  from_time: { id: number; title: string };
  till_time: { id: number; title: string };
  price: number;
}

interface Props {
  timePayments: TimePayment[];
  setTimePayments: Dispatch<SetStateAction<any>>;
  hours: Array<{
    id: number;
    title: string;
  }>;
}

export const TimePayments:FC<Props> = ({ timePayments, setTimePayments, hours }) => {
  const { t } = useTranslation();

  const addPayment = () => {
    const newPayment: TimePayment = {
      id: uuidv4(),
      from_time: hours[ 0 ],
      till_time: hours[ hours.length - 1 ],
      price: 0,
    };
    setTimePayments([ ...timePayments, newPayment ]);
  };

  const updatePaymentTime = (idx: number, timeKey: 'from_time' | 'till_time', time: FilterSelectOption) => {
    const prev = [ ...timePayments ];
    prev[ idx ][ timeKey ] = time;
    setTimePayments(prev);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const inputValue = e.target.value;
    if (!isNaN(+inputValue)) {
      const prev = [ ...timePayments ];
      prev[ idx ].price = +inputValue;
      setTimePayments(prev);
    } else {
      console.error('Неверное значение прайса');
    }
  };

  const removeTimePayment = (idx: number) => {
    const prev = [ ...timePayments ];
    prev.splice(idx, 1);
    setTimePayments(prev);
  };

  return (
    <>
      <div className={classes.timePayment}>
        <p>{t('addPaymentByTime')}</p>
        {timePayments.map((item: TimePayment, idx: number) => (
          <div key={idx} className={classes.timeItem}>
            {idx > 0 && <img className={classes.removeTimePayment}
              onClick={() => removeTimePayment(idx)}
              src={close.src} alt="x"
            />}
            <div className={classes.timeZonePrice}>
              <div>
                <p>От</p>
                <FIlterSelect
                  className={classes.select}
                  secondary
                  options={hours}
                  label={item.from_time?.title}
                  changeOption={(time) => updatePaymentTime(idx, 'from_time', time)}
                />
              </div>
              <div>
                <p>До</p>
                <FIlterSelect
                  className={classes.select}
                  secondary
                  options={hours}
                  label={item.till_time?.title}
                  changeOption={(time) => updatePaymentTime(idx, 'till_time', time)}
                />
              </div>
              <div>
                <Input
                  value={item.price}
                  onChange={(e) => handlePriceChange(e, idx)}
                  label={`${t('sum')} (KGS)`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <AddButton onClick={addPayment}>{t('addAnotherPayment')}</AddButton>
      </div>
    </>
  );
};
