import { Status, Error } from '@/shared/lib/constants/constants';


export interface AboutUsState {
  aboutUs: {
    title: string,
    content: string,
  },
  aboutUsError: Error,
  aboutUsStatus: Status,
}
