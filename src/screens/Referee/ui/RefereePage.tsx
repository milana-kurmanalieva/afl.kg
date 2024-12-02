import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { PlayersList } from '@/shared/ui/Players/PlayersList/PlayersList';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { CardPersonVariant, PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { Meta } from '@/shared/ui/seo/Meta';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getReferee, selectReferee } from '@/entities/Referee/model/RefereeSlice';
import Loader from '@/shared/ui/loader/Loader';
import { BannerRow } from '@/entities/Banners';
import ProductCard from '@/shared/ui/ProductCard/ProductCard';
import SneakerGallery from '@/shared/ui/ProductCardDetail/ProductCardDetail';
import productCardImage5 from '../../../shared/assets/icons/photo.svg';
import classes from './referee.module.scss';


export const RefereePage: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);

  const { refereeData, refereeStatus } = useSelector(selectReferee);
  const pages = [
    {
      href: PATHS.referee,
      page: t('judges'),
    },
  ];


  useEffect(() => {
    dispatch(getReferee(leagueId));
  }, [ dispatch, leagueId ]);

  if (refereeStatus !== REQUEST_STATUSES.SUCCEEDED) return (
    <div className={classes.loader}>
      <Loader />
    </div>
  );

  const images = [
    productCardImage5.src,
    productCardImage5.src,
    productCardImage5.src,
    productCardImage5.src,
  ];

  return (
    <>
      <Meta title={t('judges')} description=''>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('judges')}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
      </Container>
      <Container>
        <PlayersList players={refereeData} variant={CardPersonVariant.REFEREE} />
      </Container>
    </>
  );
};
