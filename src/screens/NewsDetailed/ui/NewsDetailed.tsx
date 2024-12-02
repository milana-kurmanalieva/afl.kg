import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { BreadCrumbs } from '@/shared/ui/BreadCrumbs/BreadCrumbs';
import { Container } from '@/shared/ui/Container/Container';
import { NewsDescription } from '@/entities/NewsDescription';
import { PATHS, SHARE_BASE_URL } from '@/shared/lib/constants/constants';


export const NewsDetailedPage: NextPage = ({ newsData }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const pages = [
    {
      href: PATHS.news,
      page: t('news'),
    }, {
      href: `${PATHS.news}/${id}`,
      page: newsData?.title ?? '',
    },
  ];


  return (
    <>
      {newsData && (
        <Meta title={newsData.title}>
          <meta name="title" content={newsData.title} />
          <meta name="description" content={newsData.thesis} />

          <meta property="og:site_name" content="FootballKg" />
          <link rel="canonical" href={`${SHARE_BASE_URL}${PATHS.news}/${newsData.id}`} />

          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${SHARE_BASE_URL}${PATHS.news}/${newsData.id}`} />
          <meta property="og:title" content={newsData.title} />
          <meta property="og:description" content={newsData.thesis} />
          <meta property="og:image" content={newsData.cover} />
          <meta property="og:image:width" content="200" />
          <meta property="og:image:height" content="100" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={`${SHARE_BASE_URL}${PATHS.news}/${newsData.id}`} />
          <meta property="twitter:title" content={newsData.title} />
          <meta property="twitter:description" content={newsData.thesis} />
          <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
          <meta property="twitter:image" content={newsData.cover} />
          <meta property="twitter:image:width" content="200" />
          <meta property="twitter:image:height" content="100" />
        </Meta>
      )}
      <Container variant='large'>
        <BreadCrumbs
          pages={pages}
        />
      </Container>
      <NewsDescription/>
    </>
  );
};
