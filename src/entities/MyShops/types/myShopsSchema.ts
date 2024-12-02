import { Shop } from '@/shared/lib/constants/constants';


export interface MyShopState {
  myShops: Shop[];
  myShop: Shop | null;
}
