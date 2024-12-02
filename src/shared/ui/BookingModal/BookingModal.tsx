import { createPortal } from 'react-dom';
import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  FC,
  ChangeEvent,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { SwiperRef } from 'swiper/react';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import {
  BUTTON_VARIANTS,
  DATE_FORMAT_FIELD,
  DayNumber,
  FilterSelectOption,
} from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { bookField } from '@/entities/Profile/model/myFieldsSlice';
import { Field_hour } from '@/entities/Field/type/fieldSchema';
import { HTag } from '../HTag/HTag';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { SelectWeekDays } from '../SelectWeekDays/SelectWeekDays';
import { TimePickerIos } from '../TimePickerIos/TimePickerIos';
import classes from './BookingModal.module.scss';


interface IBookingModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  date: Date;
  // example for fromTime: 00:00
  fromTime: string;
  selectedField: FilterSelectOption;
  workHours: Array<string | Field_hour>;
  workingDays: number[];
  onBook?: () => Promise<void>;
}

const MINUTES = [
  {
    id: 1,
    title: '00',
  }, {
    id: 2,
    title: '30',
  },
];

const BookingModal: FC<IBookingModalProps> = ({
  isOpen,
  setIsOpen,
  date,
  fromTime,
  selectedField,
  workHours,
  workingDays,
  onBook,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const hourSwiperRef = useRef<SwiperRef | null>(null);
  const minuteSwiperRef = useRef<SwiperRef | null>(null);

  const [ bookingData, setBookingData ] = useState<any>({
    date: format(date, DATE_FORMAT_FIELD),
    name: '',
    number: '+996',
  });
  const [ tillTime, setTillTime ] = useState({ minute: MINUTES[ 0 ].title, hour: (+fromTime.slice(0, 2)) + 1 });

  const availableHours = useMemo<any[]>(() => {
    const start = workHours.findIndex(item => item === fromTime);
    const end = workHours.findIndex((item, idx) => {
      return (start < idx && (item as Field_hour)?.id) || idx === workHours.length - 1;
    });

    return workHours.slice(start + 1, end + 1).map((item) => {
      if ((item as Field_hour)?.id) {
        return { id: (item as Field_hour).from_time, title: (item as Field_hour).from_time };
      }
      return { id: item, title: item };
    });

  }, [ workHours, fromTime ]);


  const handleClose = () => {
    setIsOpen(false);
    setBookingData({
      date: format(date, DATE_FORMAT_FIELD),
      name: '',
      number: '+996',
    });
  };

  const handleHourChange = () => {
    if (hourSwiperRef.current) {
      const activeIndex = hourSwiperRef.current.swiper.realIndex;
      setTillTime(prev => ({ ...prev, hour: availableHours[ activeIndex ].title.slice(0, 2) }));
    }
  };

  const handleMinuteChange = () => {
    if (minuteSwiperRef.current) {
      const activeIndex = minuteSwiperRef.current.swiper.realIndex;
      setTillTime(prev => ({ ...prev, minute: MINUTES[ activeIndex ].title }));
    }
  };

  const handleChange = (key: string, value: number | string| DayNumber[]) => {
    setBookingData((prev: any) => ({ ...prev, [ key ]: value }));
  };

  const handleSubmit = async () => {
    const payload = { ...bookingData, from_time: fromTime, till_time: `${tillTime.hour}:${tillTime.minute}` };
    delete payload.date;
    await dispatch(bookField({ date: format(date, DATE_FORMAT_FIELD), field_id: selectedField.id, payload }));
    onBook && await onBook();
    handleClose();
  };

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) window.document.body.style.overflow = 'hidden';
    else {
      handleClose();
      window.document.body.style.overflow = 'auto';
    }

    return () => {
      window.document.body.style.overflow = 'auto';
    };
  }, [ isOpen ]);


  useOutsideClick<HTMLDivElement | null>(modalRef, handleClose, isOpen);

  if (!isMounted.current || !isOpen) return <></>;


  return createPortal(
    <div className={classes.bookingModalContainer}>
      <div ref={modalRef} className={classes.bookingModalContent}>
        <HTag level={4}>{t('createAnEvent')}</HTag>
        <div className={classes.clientInfo}>
          <div className={classes.clientName}>
            <p>{t('clientName')}</p>
            <Input
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange('name', event.target.value)
              }
              value={bookingData.name}
              containerClassName={classes.clientNameInput}
            />
          </div>
        </div>
        <div className={classes.clientInfo}>
          <div className={classes.clientName}>
            <p>{t('contacts')}</p>
            <Input
              maxLength={13}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange('number', event.target.value)
              }
              value={bookingData.number}
              containerClassName={classes.clientNameInput}
            />
          </div>
        </div>
        <div className={classes.timSelect}>
          <p>{t('bookingTime')}</p>

          <div className={classes.timeBlock}>
            <p className={classes.timeBlockName}>{t('start')}</p>
            <div className={classes.allTimeSelect}>
              <div className={classes.timeNameSelect}>
                <div className={classes.startTimeNameSelect}>
                  {t('hours')}
                </div>
                <div className={classes.startTimeNameSelect}>
                  {t('minutes')}
                </div>
              </div>
              <div className={classes.timeSelect}>
                <div className={classes.startTimeSelect}>
                  {fromTime.slice(0, 2)}
                </div>
                <div className={classes.startTimeSelect}>
                  {fromTime.slice(3)}
                </div>
              </div>
            </div>
          </div>

          <div className={classes.timeBlock}>
            <p className={classes.timeBlockName}>{t('end')}</p>
            <div className={classes.allTimeSelect}>
              <div className={classes.timeNameSelect}>
                <div className={classes.startTimeNameSelect}>
                  {t('hours')}
                </div>
                <div className={classes.startTimeNameSelect}>
                  {t('minutes')}
                </div>
              </div>
              <div className={classes.timeSelect}>
                <TimePickerIos times={availableHours} sliderRef={hourSwiperRef} handleChange={handleHourChange} />
                <TimePickerIos times={MINUTES} sliderRef={minuteSwiperRef} handleChange={handleMinuteChange} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.clientInfo}>
          <div className={classes.clientName}>
            <p>{t('repeatThisEventWeekly')}</p>
            <div>
              <div className={classes.repeatEvent}>
                <p className={classes.repeatTitle}>{t('repeatEvery')}</p>
                <button
                  onClick={() => handleChange('repeat_per_weeks', (bookingData.repeat_per_weeks ?? 1) + 1)}
                  className={classes.counter}
                >+</button>
                <div className={classes.weekCount}>{bookingData.repeat_per_weeks ?? 1}</div>
                <button
                  onClick={() => {
                    if (bookingData.repeat_per_weeks && bookingData.repeat_per_weeks >= 2) {
                      handleChange('repeat_per_weeks', bookingData.repeat_per_weeks - 1);
                    }
                  }}
                  className={classes.counter}
                >-</button>
                <p>{t('aWeek')}</p>
              </div>
              <SelectWeekDays
                weekDays={workingDays}
                onChange={(newDay) => {
                  let newDays = [];

                  if (bookingData.repeated_days_on_the_week && bookingData.repeated_days_on_the_week.includes(newDay)) {
                    newDays = bookingData.repeated_days_on_the_week.filter((item: number) => item !== newDay);
                  } else {
                    newDays = [ ...(bookingData.repeated_days_on_the_week ?? []), newDay ];
                  }

                  handleChange(
                    'repeated_days_on_the_week',
                    newDays,
                  );

                }}
                workingDays={bookingData.repeated_days_on_the_week ?? []}
              />
            </div>
          </div>
        </div>
        <div className={classes.modalActionBlock}>
          <Button variant={BUTTON_VARIANTS.OUTLINED} onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} variant={BUTTON_VARIANTS.PRIMARY}>{t('reserve')}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BookingModal;
