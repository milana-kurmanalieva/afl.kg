import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { Meta } from '@/shared/ui/seo/Meta';
import { PATHS } from '@/shared/lib/constants/constants';
import { AboutUsContent } from '@/entities/AboutUs/ui/AboutUsContent';
import { BannerRow } from '@/entities/Banners';


const AboutUs: NextPage = () => {
  const { t } = useTranslation();
  const pages = [
    {
      href: '',
      page: t('infoCenter'),
      disabled: true,
    }, {
      href: PATHS.aboutUs,
      page: t('aboutUs'),
    },
  ];

  return (
    <>
      <Meta title={t('aboutUs')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('aboutUs')}
          breadcrumbs={pages}
        />

        <AboutUsContent/>
        <BannerRow/>
      </Container>
    </>
  );
};


export default AboutUs;
