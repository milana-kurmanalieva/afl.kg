import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { Players } from '@/entities/Players';


export const PlayersPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t('players')} description='New about football'>
      </Meta>
      <Container variant='large'>
        <Players/>
      </Container>
    </>
  );
};
