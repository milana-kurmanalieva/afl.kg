import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Container } from '@/shared/ui/Container/Container';
import VideosTab from '@/shared/ui/VideosTab/VideosTab';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { TabsWrapper } from '@/entities/Tabs';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { Meta } from '@/shared/ui/seo/Meta';
import { BannerRow } from '@/entities/Banners';
import { getDivisions, selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';


const query = 'square';

const VideosPage: NextPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const pages = [ { href: t('home'), page: t('videoGallery') } ];
  const title = isMobile ? t('video') : t('videoGallery');


  const { divisions } = useSelector(selectDivisions);
  const { leagueId } = useSelector(selectCurrentLeague);

  useEffect(() => {
    dispatch(getDivisions({ leagueId }));
  }, [ leagueId ]);

  return (
    <>
      <Meta title={t('videoGallery')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={title}
          breadcrumbs={pages}
        >
          <TabsWrapper
            tabsList={divisions.map(item => ({ label: `${item.title}`, value: item.id.toString() }))}
            query={query}
            variant={'videoGallery'}
          />
        </TopContent>
        <BannerRow/>

        <VideosTab/>
      </Container>
    </>
  );
};


export default VideosPage;
