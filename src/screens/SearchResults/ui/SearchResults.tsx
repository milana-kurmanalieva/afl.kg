import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Container } from '@/shared/ui/Container/Container';
import { Meta } from '@/shared/ui/seo/Meta';
import { SearchResultsContainer } from '@/entities/SearchHeader';


export const SearchResults: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t('search')} description='New about football'>
      </Meta>
      <Container variant='large'>
        <SearchResultsContainer/>
      </Container>
    </>
  );
};
