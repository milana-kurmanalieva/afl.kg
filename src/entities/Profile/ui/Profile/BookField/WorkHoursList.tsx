import React, { FC, useMemo } from 'react';
import { FieldAddressById, Field_hour } from '@/entities/Field/type/fieldSchema';
import { DateSelect } from '@/shared/ui/DateSelect';
import { getWorkHours } from '@/shared/lib/helpers/helpers';


interface Props {
  field: FieldAddressById;
  date: Date;
  forUser?: boolean;
  onBook?: (time: string) => void;
}

export const WorkHoursList: FC<Props> = ({ field, forUser, onBook, date }) => {
  const workHours = useMemo(() => getWorkHours(field, date), [ field, date ]);
  return (
    <>
      {workHours.map((item, idx) => (
        <DateSelect
          onBook={onBook}
          key={idx}
          fromTime={(item as Field_hour)?.from_time ?? item}
          tillTime={(item as Field_hour)?.till_time}
          forUser={forUser}
          reservationId={(item as Field_hour).id}
        />
      ))}
    </>
  );
};
