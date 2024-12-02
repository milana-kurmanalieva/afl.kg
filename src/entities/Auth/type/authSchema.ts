import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface User {
  id: number,
  username: string,
  email: string,
  avatar: string | null,
  phone: string | null,
  full_name: string | null,
  is_business_owner: boolean,
  is_email_auth: boolean,
  is_google_oauth: boolean,
}

export interface AuthState {
  user: User | null;
  userStatus: REQUEST_STATUSES;
  userError: Error;
}
