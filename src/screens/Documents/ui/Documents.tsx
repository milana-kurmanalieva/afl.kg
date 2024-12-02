import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { Meta } from '@/shared/ui/seo/Meta';
import Doc from '@/shared/ui/Doc/Doc';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getDocuments, selectDocuments } from '@/entities/Documents/model/documents';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import Loader from '@/shared/ui/loader/Loader';
import { PATHS } from '@/shared/lib/constants/constants';
import { BannerRow } from '@/entities/Banners';
import classes from './Documents.module.scss';


const Documents = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { documents } = useAppSelector(selectDocuments);
  const { leagueId } = useAppSelector(selectCurrentLeague);

  const pages = [
    {
      href: PATHS.documents,
      page: t('documents'),
    },
  ];

  useEffect(() => {
    dispatch(getDocuments({ leagueId }));
  }, []);

  return (
    <>
      <Meta title={t('documents')} description={t('documents') as string}>
      </Meta>

      <Container variant='large'>
        <TopContent
          title={t('documents')}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
        <div className={classes.main}>
          {documents.map(item => <Doc key={item.id} href={item.document} name={item.title}/>)}
          {
            !documents.length && <Loader center/>
          }
        </div>
      </Container>
    </>
  );
};

export default Documents;
