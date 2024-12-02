import {
  Product,
  ProductDetails,
  REQUEST_STATUSES,
  Shop,
  ShopAddress,
} from '@/shared/lib/constants/constants';


export interface productsAndShops {
  stores?: Shop[];
  products?: Product[];
}

export interface StoreState {
  stores: {
    count: number;
    next: string | null;
    previous: string | null;
    results?: Shop[];
  };
  storesCategories: object[];
  productsAndShops: {
    count: number;
    next: string | null;
    previous: string | null;
    results?: productsAndShops & Product[];
  };
  storesError: null;
  storesStatus: REQUEST_STATUSES;
  storeProducts: {
    count: number;
    next: string | null;
    previous: string | null;
    results?: Product[];
  };
  storeProductsStatus: REQUEST_STATUSES;
  store: {
    id: string;
    store_logo: { logo: string };
    title: string;
    description: string;
    delivery: string;
    is_confirmed: boolean;
    addresses: ShopAddress[];
  };
  storeError: null;
  storeStatus: REQUEST_STATUSES;

  storeProductDetail: ProductDetails | null;
  storeProductsDetailError: null;
  storeProductsDetailStatus: REQUEST_STATUSES;
}
