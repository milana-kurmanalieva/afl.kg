import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion, FIELD_TYPES } from '@/shared/lib/constants/constants';
import { FieldAddressState } from '../type/fieldSchema';


const name = 'fieldAddress';

const initialState: FieldAddressState = {
  addresses: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  addressesError: null,
  addressesStatus: REQUEST_STATUSES.NOT_REQUESTED,

  field: {
    id: 0,
    name: '',
    field_type: '',
    field_contacts: [],
    time_payments: [],
    field_photos: [],
    reservations: [],
    free_hours: [],
    working_days: [],
  },
  fieldError: null,
  fieldStatus: REQUEST_STATUSES.NOT_REQUESTED,

  address: {
    id: 0,
    name: '',
    address: '',
    address_link: '',
    area: {
      id: 0,
      name: '',
    },
    fields: [],
    area_data: {
      id: 0,
      name: '',
    },
    fields_count: 0,
  },
  addressError: null,
  addressStatus: REQUEST_STATUSES.NOT_REQUESTED,
};


interface queryParamsFields {
  limit?: number;
  offset?:number;
  field_type?: FIELD_TYPES | '';
  area?: string;
  fields_count?: number | string;
  price_from?:number | string;
  price_to?:number | string;
}

interface queryParamsId {
  id: number;
  date: string;
}
interface queryParamsOneId {
  location_id: number;
}

const ENDPOINTS = {
  ADDRESSES: () => (
    `/${apiVersion}/fields/`
  ),
  ADDRESS: (location_id: number) => (
    `/${apiVersion}/fields/?location_id=${location_id}`
  ),
  FIELD: (id: number, date: string) => (
    `/${apiVersion}/fields/${id}/${date}`
  ),
};


export const getAddresses = createAsyncThunk(
  `${name}/getAddresses`,
  async (params?:queryParamsFields, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.ADDRESSES(), { params });
      return response.data;
    } catch (err) {
      return [];
    }
  },
);

export const getAddressesWithFilters = createAsyncThunk(
  `${name}/getAddressesWithFilters`,
  async (params?:queryParamsFields, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.ADDRESSES(), { params });
      return response.data;
    } catch (err) {
      return [];
    }
  },
);

export const getAddress = createAsyncThunk(
  `${name}/getAddress`,
  async (params:queryParamsOneId, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.ADDRESS(params?.location_id));
      return response.data.results[ 0 ];
    } catch (err) {
      return [];
    }
  },
);

export const getField = createAsyncThunk(
  `${name}/getField`,
  async (params:queryParamsId, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.FIELD(params.id, params.date), params);
      if (response.data.working_days) {
        response.data.working_days = Array.from(new Set(response.data.working_days as string[]))
          .map((item: string) => +item);
      }
      return response.data;
    } catch (err) {
      return [];
    }
  },
);


export const fieldAddressSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    resetAddresses: (state) => {
      state.addresses = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getAddresses, {
      status: 'addressesStatus',
      data: 'addresses',
      error: 'addressesError',
      options: { concat: true },
    });
    addQueryCases(builder, getAddressesWithFilters, {
      status: 'addressesStatus',
      data: 'addresses',
      error: 'addressesError',
    });
    addQueryCases(builder, getAddress, {
      status: 'addressStatus',
      data: 'address',
      error: 'addressError',
    });
    addQueryCases(builder, getField, {
      status: 'fieldStatus',
      data: 'field',
      error: 'fieldError',
    });
  },
});

export const { reducer: fieldAddressReducer } = fieldAddressSlice;
export const { resetAddresses } = fieldAddressSlice.actions;
export const selectFieldAddress = (state: RootState) => {
  return state.fieldAddress;
};
