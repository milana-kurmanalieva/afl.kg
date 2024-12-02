import { AddressField, DayNumber, Error, PhotoItem, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface AreaItem {
  id: number;
  name: string;
}

export interface TimePaymentsItem {
  id: number;
  from_time: string;
  till_time: string;
  price: number;
}

export interface FieldAddressState {
  addresses: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AddressField[];
  };
  addressesError: Error;
  addressesStatus: REQUEST_STATUSES;

  field: {
    working_days: DayNumber[];
    id: number;
    name: string;
    field_type: string;
    field_contacts: Field_contact[];
    time_payments: TimePaymentsItem[];
    field_photos: PhotoItem[];
    reservations: Field_hour[];
    free_hours: Field_hour[];
  };
  fieldError: null;
  fieldStatus: REQUEST_STATUSES.NOT_REQUESTED;

  address: AddressField;
  addressError: null,
  addressStatus: REQUEST_STATUSES.NOT_REQUESTED,
}

export interface Field_contact {
  id: number;
  number: string;
}

export interface Field_photo {
  id: number;
  photo: string;
}

export interface Field_hour {
  id: number;
  from_time: string;
  till_time: string;
}

export interface FieldAddressById {
  id: number;
  name: string;
  field_type: string;
  field_contacts: Field_contact[];
  time_payments: TimePaymentsItem[];
  field_photos: Field_photo[];
  reservations: Field_hour[];
  free_hours: Field_hour[];
}
