import { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { ProfileContent, Sidebar } from '@/entities/Profile';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { selectAuth } from '@/entities/Auth/model/authSlice';
import { Directions } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { Arrow } from '@/shared/ui/Arrow/Arrow';
import usePrivateAuthRoute from '@/shared/lib/hooks/usePrivateAuthRoute';
import classes from './profile.module.scss';


export const Profile: NextPage = () => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const { user } = useAppSelector(selectAuth);

  usePrivateAuthRoute();

  if (!user) return <></>;

  return (
    <>
      <Meta title='Профиль' description='Профиль'>
      </Meta>
      <Container variant='large'>
        <div className={classes.profile}>
          {router.query.tab && <div onClick={() => router.back()} className={classes.backArrow}>
            <Arrow direction={Directions.left} />
          </div>}
          {((isMobile && !router.query.tab) || !isMobile) && <Sidebar />}
          <ProfileContent/>
        </div>
      </Container>
    </>
  );
};
