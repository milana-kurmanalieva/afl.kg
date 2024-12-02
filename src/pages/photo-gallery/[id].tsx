import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { store, wrapper } from '@/app/providers/StoreProvider/config/store';
import { getPhotoGallery } from '@/entities/PhotoGallery/model/PhotoGallerySlice';
import { getPhotoEssay } from '@/entities/PhotoEssay/model/PhotoEssaySlice';
import PhotoEssayPage from '@/screens/PhotoEssay';


export const getStaticPaths = async () => {
  const leagueId = store.getState().currentLeague.leagueId;
  (await store.dispatch(getPhotoGallery({ leagueId })));

  const photoGallery = store.getState().photoGallery.photoGalleryData.results;

  const photoIds = photoGallery.map(photoGallery => ({ params: { id: photoGallery.id.toString() } }));

  return {
    paths: photoIds,
    fallback: true,
  };

};

export const getStaticProps = wrapper.getStaticProps((wrapperStore) => async ({ locale, params }) => {
  let data = null;
  try {
    const leagueId = store.getState().currentLeague.leagueId;

    if (params?.id) {
      data = (await wrapperStore.dispatch(getPhotoEssay({ leagueId, albumId: +params.id }))).payload;
    }

  } catch (err) {

  }

  return {
    props: { ... (await serverSideTranslations(locale as string, [ 'common' ])), locale, galleryData: data },
    revalidate: 120,
  };
});

export default PhotoEssayPage;
