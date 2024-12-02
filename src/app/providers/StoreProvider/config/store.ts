import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { requester } from '@/shared/config/axios/requester';
import { leagueNewsReducer } from '@/entities/News/model/LeagueNewsSlice';
import { worldNewsReducer } from '@/entities/WorldNews/model/WorldNewsSlice';
import { newsDetailedReducer } from '@/entities/NewsDescription/model/NewsDetailedSlice';
import { divisionReducer } from '@/entities/Divisions/model/DivisionSlice';
import { currentLeagueReducer } from '@/entities/CurrentLeague/model/CurrentLeague';
import { championshipReducer } from '@/entities/Championship/model/ChampionShipSlice';
import { searchHeaderSliceReducer } from '@/entities/SearchHeader/model/searchHeaderSlice';
import { teamsReducer } from '@/entities/Teams/model/teamsSlice';
import { playersReducer } from '@/entities/Players/model/PlayersSlice';
import { teamReducer } from '@/entities/Team/model/teamSlice';
import { bombardierReducer } from '@/entities/Bombardier/model/bombardierSlice';
import { playerDetailedReducer } from '@/entities/PlayerDetailed/model/playerDetailsSlice';
import { playersRatingReducer } from '@/entities/PlayersRating/model/playersRatingSlice';
import { documentsReducer } from '@/entities/Documents/model/documents';
import { leagueVideosReducer } from '@/entities/VideosPage/model/VideoPageSlice';
import { ourTeamReducer } from '@/entities/OurTeam/model/OurTeamSlice';
import { refereeReducer } from '@/entities/Referee/model/RefereeSlice';
import { sponsorsReducer } from '@/entities/Sponsors/model/SponsorsSlice';
import { catalogReducer } from '@/entities/Catalog/model/CatalogSlice';
import { photoGalleryReducer } from '@/entities/PhotoGallery/model/PhotoGallerySlice';
import { photoEssayReducer } from '@/entities/PhotoEssay/model/PhotoEssaySlice';
import { currentCupReducer } from '@/entities/CurrentCup/model/currentCupSlice';
import { archiveReducer } from '@/entities/Archive';
import { archiveGroupsReducer } from '@/entities/ArchiveGroups';
import { archiveGroupsStageReducer } from '@/entities/ArchivePlayOff';
import { archiveChampionShipReducer } from '@/entities/ArchiveChampionship';
import { pollsReducer } from '@/entities/Polls/model/pollsSlice';
import { matchesReducer } from '@/entities/Matches/model/MatchesSlice';
import { aboutUsReducer } from '@/entities/AboutUs/model/aboutUsSlice';
import { bannersReducer } from '@/entities/Banners/model/bannersSlice';
import { footerReducer } from '@/entities/FooterInfo/model/FooterSlice';
import { authReducer } from '@/entities/Auth/model/authSlice';
import { myFieldsReducer } from '@/entities/Profile/model/myFieldsSlice';
import { fieldAddressReducer } from '@/entities/Field/model/FieldSlice';
import { storesReducer } from '@/entities/Store/model/StoreSlice';
import { myShopReducer } from '@/entities/MyShops/model/myShopsSlice';
import { myProductsReducer } from '@/entities/MyProducts/model/myProductsSlice';
import { supportReducer } from '@/entities/WhatsApp/model/supporSlice';
import { blackListReducer } from '@/entities/BlackList/model/BlackListSlice';
import { bestPlayersReducer } from '@/entities/BestPlayers/model/bestPlayersSlice';
import { winnersReducer } from '@/entities/MainWinnerTeams/model/winnersSlice';


export function createReduxStore() {
  return configureStore(
    {
      reducer: {
        searchHeader: searchHeaderSliceReducer,
        currentLeague: currentLeagueReducer,
        leaguesNews: leagueNewsReducer,
        worldsNews: worldNewsReducer,
        newsDetailed: newsDetailedReducer,
        division: divisionReducer,
        championship: championshipReducer,
        teams: teamsReducer,
        players: playersReducer,
        team: teamReducer,
        bombardier: bombardierReducer,
        player: playerDetailedReducer,
        playersRating: playersRatingReducer,
        documents: documentsReducer,
        leaguesVideos: leagueVideosReducer,
        ourTeam: ourTeamReducer,
        referee: refereeReducer,
        sponsors: sponsorsReducer,
        catalog: catalogReducer,
        currentCup: currentCupReducer,
        blackList: blackListReducer,
        archive: archiveReducer,
        archiveGroups: archiveGroupsReducer,
        archiveStages: archiveGroupsStageReducer,
        archiveChampionShip: archiveChampionShipReducer,
        polls: pollsReducer,
        photoGallery: photoGalleryReducer,
        photoEssay: photoEssayReducer,
        matches: matchesReducer,
        aboutUs: aboutUsReducer,
        banner: bannersReducer,
        footer: footerReducer,
        auth: authReducer,
        myAddresses: myFieldsReducer,
        fieldAddress: fieldAddressReducer,
        stores: storesReducer,
        myShop: myShopReducer,
        myProducts: myProductsReducer,
        techSupport: supportReducer,
        bestPlayers: bestPlayersReducer,
        winners: winnersReducer,
      },
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ thunk: { extraArgument: requester } }),
    },
  );
}


export const store = createReduxStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof createReduxStore>

export const wrapper = createWrapper<AppStore>(createReduxStore, { debug: false });
