import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Divisions } from '@/screens/Divisions';
import { ILocale } from '@/shared/lib/constants/constants';


export const getStaticProps = async ({ locale }: ILocale) => {
  return {
    props: { ...(await serverSideTranslations(locale as string, [ 'common' ])), locale },
    revalidate: 120,
  };
};


export default Divisions;
