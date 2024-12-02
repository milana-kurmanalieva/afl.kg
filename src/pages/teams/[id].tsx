import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { store } from '@/app/providers/StoreProvider/config/store';
import { getTeams } from '@/entities/Teams/model/teamsSlice';
import Loading from '@/screens/Loader/Loading';
import { getDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { ILocale } from '@/shared/lib/constants/constants';


const Team = dynamic(() => import('@/screens/Team'), { loading: () => <Loading/> });


export const getStaticPaths = async () => {
  const leagueId = store.getState().currentLeague.leagueId;
  let paths: {params: {id: string}}[] = [];

  (await store.dispatch(getDivisions({ leagueId })));

  const division = store.getState().division.currentDivision.id;
  (await store.dispatch(getTeams({ leagueId, division })));

  const teams = store.getState().teams.teamsList;

  if (Array.isArray(teams)) {
    paths = teams.map(team => ({ params: { id: team.id.toString() } }));
  }

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ locale }: ILocale) => {
  return {
    props: { ...(await serverSideTranslations(locale as string, [ 'common' ])), locale },
    revalidate: 120,
  };
};


export default Team;
