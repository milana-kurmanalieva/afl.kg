import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HTMLReactParser from 'html-react-parser';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { PATHS, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { Meta } from '@/shared/ui/seo/Meta';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getCurrentCupDescription, selectCurrentCup } from '@/entities/CurrentCup/model/currentCupSlice';
import { CurrentCupState } from '@/entities/CurrentCup/type/currentCupSchema';
import { CurrentCup } from '@/entities/CurrentCup';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import Loader from '@/shared/ui/loader/Loader';
import classes from './cup.module.scss';


export const Cup: NextPage = () => {
  const dispatch = useAppDispatch();
  const { leagueId, currentLeague }:currentLeagueState = useSelector(selectCurrentLeague);
  const { currentCup, currentCupStatus }: CurrentCupState = useSelector(selectCurrentCup);

  const [ showCupDescription, setShowCupDescription ] = useState(false);

  const pages = [
    {
      href: '',
      page: currentLeague.title,
      disabled: true,
    }, {
      href: PATHS.cup,
      page: currentCup?.title ?? '',
    },
  ];

  useEffect(() => {
    dispatch(getCurrentCupDescription({ leagueId }));
  }, []);


  if (currentCupStatus !== REQUEST_STATUSES.SUCCEEDED) return (
    <div className={classes.loader}>
      <Loader/>
    </div>
  );

  if (!currentCup) return (
    <EmptyState/>
  );

  const parsedContent = HTMLReactParser(currentCup.description.replaceAll('h1', 'h2'));

  return (
    <>
      <Meta title={currentCup.title} description={currentCup.description}>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={<div className={classes.headTitle}>
            {!!currentCup.image && <img src={currentCup.image} alt='logo' />}
            {currentCup.title}
          </div>}
          breadcrumbs={pages}
        >
        </TopContent>
        <div
          onClick={() => setShowCupDescription(prev => !prev)}
          className={classes.description}
        >
          <div className={`${showCupDescription ? '' : classes.cupDescriptionHide}`}>
            {parsedContent}
          </div>
        </div>
        <CurrentCup/>
      </Container>
    </>
  );
};
