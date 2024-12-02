import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Loading from '@/screens/Loader/Loading';
import { ILocale } from '@/shared/lib/constants/constants';


const Home = dynamic(() => import('@/screens/Home'), { loading: () => <Loading/> }) ;


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export default Home;
