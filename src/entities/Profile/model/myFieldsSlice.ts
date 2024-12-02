import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import { REQUEST_STATUSES, THUNK_ANY, apiVersion } from '@/shared/lib/constants/constants';
import { MyFieldsState } from '../types/profile';


const name = 'myAddresses';

const initialState: MyFieldsState = {
  myAddresses: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  myAddressesError: null,
  myAddressesStatus: REQUEST_STATUSES.NOT_REQUESTED,

  areas: [],
  areasError: null,
  areasStatus: REQUEST_STATUSES.NOT_REQUESTED,

  field: null,
  fieldStatus: REQUEST_STATUSES.NOT_REQUESTED,
  fieldError: null,

  reservation: null,
};

const ENDPOINTS = {
  MY_FIELDS: `/${apiVersion}/profile/fields/`,
  FIELDS_AREAS: `${apiVersion}/profile/fields/areas/`,
  CREATE_FIELD: `${apiVersion}/profile/fields/create/`,
  ADDRESS: (addressId: number) => `${apiVersion}/profile/fields/locations/${addressId}/`,
  FIELD: (fieldId: number) => `${apiVersion}/profile/fields/${fieldId}/`,
  EDIT_FIELD_PHOTO: (photoId: number) => `${apiVersion}/profile/fields/photo/${photoId}/`,
  CREATE_FIELD_PHOTO: (fieldId: number) => `${apiVersion}/profile/fields/${fieldId}/photo/`,
  BOOK_FIELD: (fieldId: number, date: string) => `${apiVersion}/profile/fields/reservations/${fieldId}/${date}/create/`,
  RESERVATION: (fieldId: number, date: string, id: number) =>
    `${apiVersion}/profile/fields/reservations/${fieldId}/${date}/${id}/`,
};

interface queryParams {
  limit?: number;
  offset?: number;
}


export const getMyAddresses = createAsyncThunk(
  `${name}/getMyAddresses`,
  async (params?: queryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.MY_FIELDS, params);
      return response.data;

    } catch (err) {

    }
  },
);


export const getMyField = createAsyncThunk(
  `${name}/getMyField`,
  async (params: {fieldId: number}, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.FIELD(params.fieldId));
      return response.data;

    } catch (err) {
      return [];
    }
  },
);


interface AddressFieldParams {
  name: string;
  address: string;
  area: number;
  address_link: string;
}

export const createAddressField = createAsyncThunk(
  `${name}/createAddressField`,
  async (params: AddressFieldParams, { dispatch, extra: api }: THUNK_ANY = {}) => {
    try {
      const response = await api.post(ENDPOINTS.MY_FIELDS, params);
      dispatch(addAddress(response.data));
      return response.data;
    } catch (err) {

    }
  },
);

export const deleteAddressField = createAsyncThunk(
  `${name}/createAddressField`,
  async (params: {addressId: number}, { dispatch, extra: api }: THUNK_ANY = {}) => {
    try {
      const response = await api.delete(ENDPOINTS.ADDRESS(params.addressId));
      dispatch(deleteAddress(params.addressId));
      return response.data;
    } catch (err) {

    }
  },
);

// FIX_ME: replace any
interface CreateFieldParams {
  location: number;
  time_payments: any[];
  working_days: number[];
  till_time: string;
  from_time: string;
  field_type: string;
  name: string;
  field_contacts: {number: string}[];
}

export const createField = createAsyncThunk(
  `${name}/createField`,
  async (params: CreateFieldParams, { extra: api }: THUNK_ANY = {}) => {
    try {

      const response = await api.post(ENDPOINTS.CREATE_FIELD, params);

      return response.data;
    } catch (err: any) {
      return { error: true, data: err?.response?.data };
    }
  },
);


interface EditFieldParams {
  body: CreateFieldParams;
  fieldId: number;
}

export const editField = createAsyncThunk(
  `${name}/editField`,
  async (params: EditFieldParams, { extra: api }: THUNK_ANY = {}) => {
    try {

      const response = await api.patch(ENDPOINTS.FIELD(params.fieldId), params.body);

      return response.data;
    } catch (err: any) {
      return { error: true, data: err?.response?.data };
    }
  },
);

export const deleteField = createAsyncThunk(
  `${name}/deleteField`,
  async (params: {fieldId: number}, { extra: api }: THUNK_ANY = {}) => {
    try {

      const response = await api.delete(ENDPOINTS.FIELD(params.fieldId));
      return response.data;

    } catch (err: any) {
      return { error: true, data: err?.response?.data };
    }
  },
);

export const createFieldPhoto = createAsyncThunk(
  `${name}/createFieldPhoto`,
  async (params: {fieldId: number, data: any[]}, { extra: api }: THUNK_ANY = {}) => {
    const formData = new FormData();
    params.data.forEach((item) => {
      formData.append('data', item.photo ? item.photo : item.id);
    });

    try {
      const response = await api.post(
        ENDPOINTS.CREATE_FIELD_PHOTO(params.fieldId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      return response.data;
    } catch (err) {

    }
  },
);


export const getAreas = createAsyncThunk(
  `${name}/getAreas`,
  async (params?: queryParams, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.get(ENDPOINTS.FIELDS_AREAS, params);
      return response.data.results.map((item: {id: number, name: string}) => ({ ...item, title: item.name }));

    } catch (err) {
      return [];
    }
  },
);

export const bookField = createAsyncThunk(
  `${name}/bookField`,
  async (params: {date: string, field_id: number, payload: any}, { extra: api }: { extra?: THUNK_ANY } = {}) => {
    try {
      const response = await api.post(ENDPOINTS.BOOK_FIELD(params.field_id, params.date), params.payload);
      return response.data;

    } catch (err) {

    }
  },
);

export const getReservation = createAsyncThunk(
  `${name}/getReservation`,
  async (
    params: {date: string, field_id: number, reservation_id: number},
    { extra: api }: { extra?: THUNK_ANY } = {},
  ) => {
    try {
      const response = await api.get(ENDPOINTS.RESERVATION(params.field_id, params.date, params.reservation_id));
      return response.data;

    } catch (err) {

    }
  },
);

export const deleteReservation = createAsyncThunk(
  `${name}/deleteReservation`,
  async (
    params: {date: string, field_id: number, reservation_id: number},
    { extra: api }: { extra?: THUNK_ANY } = {},
  ) => {
    try {
      const response = await api.delete(ENDPOINTS.RESERVATION(params.field_id, params.date, params.reservation_id));
      return response.data;

    } catch (err) {

    }
  },
);


export const myFieldsSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    setMyFields: (state, action) => {
      state.myAddresses = action.payload;
    },
    addAddress: (state, action) => {
      state.myAddresses.results.push(action.payload);
    },
    deleteAddress: (state, action) => {
      state.myAddresses.results = state.myAddresses.results.filter(item => item.id !== action.payload);
    },
    setField: (state, action) => {
      state.field = action.payload;
    },
    setReservation: (state, action) => {
      state.reservation = action.payload;
    },
  },
  extraReducers(builder) {
    addQueryCases(builder, getMyAddresses, {
      status: 'myFieldsStatus',
      data: 'myAddresses',
      error: 'myFieldsError',
    });
    addQueryCases(builder, getAreas, {
      status: 'areasStatus',
      data: 'areas',
      error: 'areasError',
    });
    addQueryCases(builder, getMyField, {
      status: 'fieldStatus',
      data: 'field',
      error: 'fieldError',
    });
    addQueryCases(builder, getReservation, {
      status: '',
      data: 'reservation',
      error: '',
    });
  },
});

export const { reducer: myFieldsReducer } = myFieldsSlice;
export const { setMyFields, addAddress, deleteAddress, setField, setReservation } = myFieldsSlice.actions;
export const selectMyFields = (state: RootState) => state[ name ];
