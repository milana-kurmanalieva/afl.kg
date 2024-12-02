import { Error, Status } from '@/shared/lib/constants/constants';


export interface CatalogItem {
  id: number,
  name: string,
  address: string,
  field_type: string | number,
  link: string,
  number_of_fields: number,
  numbers: string,
  photo: string,
  price: number | string,
}

export interface CatalogState {
  catalog: {
    count: number,
    next: string | null,
    previous: string | null,
    results: Array<CatalogItem>,
  },
  catalogError: Error,
  catalogStatus: Status,
}
