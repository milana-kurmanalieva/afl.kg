import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';
import { addQueryCases } from '@/shared/lib/helpers/helpers';
import { RootState } from '@/app/providers/StoreProvider';
import {
  IS_AUTHORIZED, REQUEST_STATUSES,
  THUNK_ANY, apiVersion,
} from '@/shared/lib/constants/constants';
import { AuthState } from '../type/authSchema';


const name = 'auth';

const initialState: AuthState = { user: null, userStatus: REQUEST_STATUSES.NOT_REQUESTED, userError: null };


const ENDPOINTS = {
  LOGIN: `${apiVersion}/auth/login/`,
  SIGN_UP: `${apiVersion}/auth/signup/`,
  VERIFY: (email: string, code: number) => `${apiVersion}/auth/verify/user/?email=${email}&code=${code}`,
  VERIFY_RESEND: `${apiVersion}/auth/verify/resend/`,
  PROFILE: `${apiVersion}/profile/`,
  PASSWORD_RESET_LINK: `${apiVersion}/auth/password/reset/send-link/`,
  PASSWORD_RESET: `${apiVersion}/auth/password/reset/verify/`,
  PASSWORD_CHANGE: `${apiVersion}/auth/password/change/`,
  EMAIL_CHANGE: `${apiVersion}/auth/email/change/send-link/`,
  LOGOUT: `${apiVersion}/auth/logout/`,
};

interface LoginCredentials {
  login: string;
  password: string;
}

export const login = createAsyncThunk(
  `${name}/login`,
  async (params: LoginCredentials, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, params);
      setCookie(IS_AUTHORIZED, true);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

export interface SignUpCredentials {
  email: string;
  username: string;
  confirm_is_business_owner: boolean | null;
  password: string;
  confirm_password: string;
  phone?: string
}

export const signUp = createAsyncThunk(
  `${name}/signUp`,
  async (params: SignUpCredentials, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.SIGN_UP, params);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

interface VerifyUserParams {
  email: string;
  code: number;
}

export const verifyUser = createAsyncThunk(
  `${name}/verifyUser`,
  async (params: VerifyUserParams, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.VERIFY(params.email, params.code), params);
      setCookie(IS_AUTHORIZED, true);
      return response;
    } catch (error) {
      return error;
    }
  },
);

export const verifyResend = createAsyncThunk(
  `${name}/verifyResend`,
  async (params: {email: string}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.VERIFY_RESEND, params);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

export const getProfile = createAsyncThunk(
  `${name}/getProfile`,
  async (_, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.get(ENDPOINTS.PROFILE);
      setCookie(IS_AUTHORIZED, true);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },
);

export const passwordResetLink = createAsyncThunk(
  `${name}/passwordResetLink`,
  async (params: {email: string}, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.PASSWORD_RESET_LINK, params);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);

export interface ProfileChanges {
  username: string;
  avatar: any;
  phone?: string;
  full_name: string;
  confirm_is_business_owner?: boolean;
}

export const changeProfile = createAsyncThunk(
  `${name}/changeProfile`,
  async (changes: ProfileChanges, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.patch(ENDPOINTS.PROFILE, changes);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);


interface PasswordChange {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const passwordChange = createAsyncThunk(
  `${name}/passwordChange`,
  async (changes: PasswordChange, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.PASSWORD_CHANGE, changes);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  },
);


interface EmailChange {
  new_email: string;
  password: string
}

export const emailChange = createAsyncThunk(
  `${name}/changeEmail`,
  async (changes: EmailChange, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.EMAIL_CHANGE, changes);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  },
);

interface ResetPasswordCredentials {
  email: string;
  code: string;
  new_password: string;
  confirm_new_password: string;
}

export const resetPassword = createAsyncThunk(
  `${name}/passwordResetLink`,
  async (params: ResetPasswordCredentials, { extra: api }: THUNK_ANY) => {
    try {
      const response = await api.post(ENDPOINTS.PASSWORD_RESET, params);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);


export const logout = createAsyncThunk(
  `${name}/logout`,
  async (_, { extra: api }: THUNK_ANY) => {
    try {
      await api.post(ENDPOINTS.LOGOUT);
      setCookie(IS_AUTHORIZED, false);
      return null;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
);


export const authSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    addQueryCases(builder, getProfile, {
      status: 'userStatus',
      data: 'user',
      error: 'userError',
    });

    addQueryCases(builder, changeProfile, {
      status: 'userStatus',
      data: 'user',
      error: 'userError',
    });

    addQueryCases(builder, logout, {
      status: 'userStatus',
      data: 'user',
      error: 'userError',
    });
  },
});


export const { reducer: authReducer } = authSlice;
export const selectAuth = (state: RootState) => state.auth;
