import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ILocale } from '@/shared/lib/constants/constants';
import { Cup } from '@/screens/Cup';


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export default Cup;
