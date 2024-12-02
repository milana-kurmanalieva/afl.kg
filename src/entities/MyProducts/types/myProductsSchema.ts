import { Product, ShopDelivery } from '@/shared/lib/constants/constants';


export interface Categories {
  id: number;
  slug: string;
  title: string;
  children: Categories[];
}


export interface productRoot {
  id: string;
  store: string;
  title: string;
  description: string;
  categories: {
    id: number;
    slug: string;
    title: string;
    parent: number | null;
  }[];
  delivery: string;
  main_number: string;
  brand: string;
  price: number;
  product_photos: ProductPhoto[];
}

export interface ProductPhoto {
  id: number
  photo: string
  product: string
}


export interface SimilarProductsQuery {
  store_id: string;
  limit?: number;
  offset?: number;
  category_slug: string
}


export interface MyProductsState {
  myProductsRecord: Record<string, {
    products: Product[];
    hasMore: boolean
  }>
  categories?: Categories[];
  product: productRoot | null;
  similarProducts: Product[]
}
