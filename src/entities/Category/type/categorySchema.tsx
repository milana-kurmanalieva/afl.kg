import {
  REQUEST_STATUSES,
  StoreChildrenItem,
} from '@/shared/lib/constants/constants';


export interface CategoryState {
  categories: {
    count: number;
    next: string | null;
    previous: string | null;
    results: StoreChildrenItem[];
  },
  categoriesError: null,
  categoriesStatus: REQUEST_STATUSES.NOT_REQUESTED,
}
