import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ILocale } from '@/shared/lib/constants/constants';
import { Field } from '@/screens/Field';
import { store } from '@/app/providers/StoreProvider/config/store';
import { getAddresses } from '@/entities/Field/model/FieldSlice';


export const getStaticProps = async({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export const getStaticPaths = async() => {
  (await store.dispatch(getAddresses()));

  const fieldAddress = store.getState().fieldAddress.addresses.results;

  const fieldAddressIds =
    fieldAddress.map(item => ({ params: { id: item.id.toString() } }));

  return {
    paths: fieldAddressIds,
    fallback: true,
  };

};

export default Field;
