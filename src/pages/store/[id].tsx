import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ILocale } from '@/shared/lib/constants/constants';
import { Store } from '@/screens/Store';
import { store } from '@/app/providers/StoreProvider/config/store';
import { getStores } from '@/entities/Store/model/StoreSlice';


export const getStaticProps = async({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export const getStaticPaths = async() => {
  (await store.dispatch(getStores()));

  const stores = store.getState().stores.stores.results;

  const storesIds = stores?.map(item => ({ params: { id: item.id } }));

  return {
    paths: storesIds,
    fallback: true,
  };

};

export default Store;
