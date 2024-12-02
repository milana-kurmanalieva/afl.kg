import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { TeamsContainer } from '@/entities/Teams';


export const Teams: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t('teams')} description='New about football'>
      </Meta>
      <Container variant='large'>
        <TeamsContainer/>
      </Container>
    </>
  );
};
