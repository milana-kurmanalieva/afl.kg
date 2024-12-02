import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { DATE_FORMAT_FIELD, FilterSelectOption } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { deleteReservation, getMyAddresses, selectMyFields } from '@/entities/Profile/model/myFieldsSlice';
import { getAddress, getField, selectFieldAddress } from '@/entities/Field/model/FieldSlice';
import { HTag } from '@/shared/ui/HTag/HTag';
import BookingModal from '@/shared/ui/BookingModal/BookingModal';
import { DatePickerComponent } from '@/shared/ui/DatePicker';
import { getWorkHours } from '@/shared/lib/helpers/helpers';
import { Modal } from '@/shared/ui/Modal/Modal';
import classes from './bookField.module.scss';
import { WorkHoursList } from './WorkHoursList';


export const BookField = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { address, field } = useAppSelector(selectFieldAddress);

  const addressId = +(router.query.address_id as string);
  const fieldId = +(router.query.field_id as string);

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ fromTime, setFromTime ] = useState('');
  const [ deleteReservationId, setDeleteReservationId ] = useState<false | number>(false);

  const workHours = useMemo(() => getWorkHours(field, selectedDate), [ field, selectedDate ]);

  const handleChangeDay = useCallback(async (newDate?: Date) => {
    if (newDate) {
      setSelectedDate(newDate);
      dispatch(getField({ id: fieldId, date: format(newDate, DATE_FORMAT_FIELD) }));
    }
  }, [ ]);

  const handleDeleteReservation = async (reservation_id: number) => {
    if (fieldId) {
      await dispatch(deleteReservation(
        { field_id: fieldId, date: format(selectedDate, DATE_FORMAT_FIELD), reservation_id },
      ));
      await handleChangeDay(structuredClone(selectedDate));
      setDeleteReservationId(false);
    }
  };

  useEffect(() => {
    if (addressId) dispatch(getAddress({ location_id: addressId }));
  }, [ addressId ]);


  useEffect(() => {
    dispatch(getMyAddresses());
    handleChangeDay(new Date());
  }, [ ]);

  return (
    <div className={classes.bookForm}>
      {field && (
        <BookingModal
          onBook={() => handleChangeDay(structuredClone(selectedDate))}
          workingDays={field.working_days}
          selectedField={{ title: field.name, id: field.id }}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          date={selectedDate}
          fromTime={fromTime}
          workHours={workHours}
        />
      )}
      <div className={classes.title}>
        <HTag level={4}>{address.name}</HTag>
        <p>{address.area_data?.name}</p>
      </div>
      <div className={classes.calendar}>
        <DatePickerComponent
          selected={selectedDate}
          onChangeDate={handleChangeDay}
          workingDays={field.working_days}
        />

        {field && <WorkHoursList
          field={field}
          onBook={(time, reservationId?: number) => {
            if (reservationId) {
              setDeleteReservationId(reservationId);
              return;
            }
            setFromTime(time);
            setIsModalOpen(true);
          }}
          date={selectedDate}
        />}
        <Modal
          title="Вы точно хотите удалить ?"
          submitButton="Удалить"
          onSubmit={() => deleteReservationId && handleDeleteReservation(deleteReservationId)}
          cancelButton
          isOpen={!!deleteReservationId}
          setIsOpen={setDeleteReservationId as Dispatch<SetStateAction<boolean>>}
        >
        </Modal>
      </div>
    </div>
  );
};
