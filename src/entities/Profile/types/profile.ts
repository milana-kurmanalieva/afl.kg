import { AddressField, Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface Address {
  id: number;
  name: string;
  address: string;
  address_link: string;
  fields: [];
  area_data: {
    id: number;
    name: string
  }
}

export interface MyFieldsState {
   myAddresses: {
    count: number;
    next: string | null;
    previous: string | null;
    results: AddressField[];
  };
  myAddressesError: Error;
  myAddressesStatus: REQUEST_STATUSES;

  // FIX_ME: use area type
  areas: any[],
  areasError: Error,
  areasStatus: REQUEST_STATUSES,

  // FIX_ME: replace any
  field: any,
  fieldStatus: REQUEST_STATUSES,
  fieldError: Error,

  reservation: any,
}

interface myFieldsParamsPhotos {
  id: number;
  photo: string;
  field: number
}

interface myFieldsParamsContacts {
  id: number;
  number: string
}

interface myFieldsParamsTimePayments {
  id: number;
  from_time: string;
  till_time: string;
  price: number
}

interface myFieldsParamsAddress {
  id: number;
  address: string
}
