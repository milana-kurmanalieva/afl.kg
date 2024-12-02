import React from 'react';
import { Container } from '@/shared/ui/Container/Container';
import classes from './footer.module.scss';
import { Bottom } from './Bottom/Bottom';
import { Top } from './Top/Top';


export const Footer = () => {
  return (
    <footer className={classes.footer}>
      <Container variant='large'>
        <Top/>
        <Bottom/>
      </Container>
    </footer>
  );
};
