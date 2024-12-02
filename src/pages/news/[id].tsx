import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NewsDetailedPage } from '@/screens/NewsDetailed';
import { store, wrapper } from '@/app/providers/StoreProvider/config/store';
import { getLeaguesNews, setLeagueNewsStatus } from '@/entities/News/model/LeagueNewsSlice';
import { getWorldsNews, setWorldNewsStatus } from '@/entities/WorldNews/model/WorldNewsSlice';
import { REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { getNewsDetailed } from '@/entities/NewsDescription/model/NewsDetailedSlice';


export const getStaticPaths = async () => {
  const leagueId = store.getState().currentLeague.leagueId;

  (await store.dispatch(getLeaguesNews({ leagueId })));
  (await store.dispatch(getWorldsNews({ })));


  const news = store.getState().leaguesNews.leagueNews.results;
  const worldNews = store.getState().worldsNews.worldNews.results;

  const newIds = [ ...news, ...worldNews ].map(news => {
    return ({ params: { id: news.id.toString() } });
  });

  return {
    paths: newIds,
    fallback: true,
  };
};


export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale, params }) => {
      let data = null;
      try {
        const leagueId = store.getState().currentLeague.leagueId;
        (await store.dispatch(getWorldsNews({})));
        (await store.dispatch(getLeaguesNews({ leagueId })));

        if (params?.id) {
          data = (await store.dispatch(getNewsDetailed({ id: params.id as string }))).payload;
        }

        store.dispatch(setLeagueNewsStatus(REQUEST_STATUSES.SUCCEEDED));
        store.dispatch(setWorldNewsStatus(REQUEST_STATUSES.SUCCEEDED));
      } catch (error) {
        store.dispatch(setLeagueNewsStatus(REQUEST_STATUSES.FAILED));
        store.dispatch(setWorldNewsStatus(REQUEST_STATUSES.FAILED));
      }
      return {
        props: { ...(await serverSideTranslations(locale as string, [ 'common' ])), newsData: data, locale },
        revalidate: 120,
      };
    },
);

export default NewsDetailedPage;
