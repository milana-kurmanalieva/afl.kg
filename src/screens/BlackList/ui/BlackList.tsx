import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PATHS } from '@/shared/lib/constants/constants';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { BlackListContent } from '@/entities/BlackList/ui/BlackListContent';
import { useAppSelector, useAppDispatch } from '@/app/providers/StoreProvider';
import { getBlackListContent, selectBlackList } from '@/entities/BlackList/model/BlackListSlice';
import { useInnerWidthExceedsDefault } from '@/shared/lib/hooks/useInnerWidthExceedsDefault';
import classes from './blackList.module.scss';


const BlackList: NextPage = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { currentLeague, leagueId } = useAppSelector(selectCurrentLeague);
  const { blackListData } = useAppSelector(selectBlackList);
  const isMobile = useInnerWidthExceedsDefault();

  useEffect(() => {
    if (leagueId) {
      dispatch(getBlackListContent({ leagueId }));
    }
  }, [ dispatch, leagueId ]);

  if (!blackListData?.data) return <></>;

  const pages = [
    {
      href: '',
      page: currentLeague?.title || '',
      disabled: true,
    }, {
      href: PATHS.blackList,
      page: t('blackList'),
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Meta title={t('blackList')} description="" />
      <Container variant="large">
        <TopContent
          title={
            <div className={classes.headTitle}>
              {i18n.language === 'ru' && t('blackListTitle')}{' '}
              {currentLeague?.title}{' '}
              {i18n.language === 'ky' && t('blackListTitle')}
            </div>
          }
          breadcrumbs={pages}
          showBreadcrumbs={isMobile}
        />
        <section>
          <div className={classes.description}>
            {parse(blackListData.data.description)}
          </div>
          <BlackListContent blackListId={blackListData.data.id} />
        </section>
      </Container>
    </div>
  );
};

export default BlackList;
