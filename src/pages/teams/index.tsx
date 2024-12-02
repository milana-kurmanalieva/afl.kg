import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Teams } from '@/screens/Teams';
import { ILocale } from '@/shared/lib/constants/constants';


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export default Teams;
