import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ILocale } from '@/shared/lib/constants/constants';
import { store } from '@/app/providers/StoreProvider/config/store';
import { getMyProduct, getMyProductsFromShop, getProductDetail } from '@/entities/MyProducts/model/myProductsSlice';
import { getStores } from '@/entities/Store/model/StoreSlice';
import ProductCardDetail from '.';


export const getStaticPaths = async () => {

  (await store.dispatch(getStores({ limit: 10 })));
  const storeList = store.getState().stores.stores.results;

  const ids: { params: {id: string} }[] = [];

  storeList?.forEach(async item => {
    const product = await store.dispatch(getMyProductsFromShop({ store_id: item.id })).unwrap();
    ids.push({ params: product?.data?.id?.toString() });
  });

  return { paths: ids, fallback: true };
};


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale as string, [ 'common' ])), locale } };
};


export default ProductCardDetail;
