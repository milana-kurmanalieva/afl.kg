import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SelectLanguage } from '@/entities/SelectLanguage';
import { Container } from '@/shared/ui/Container/Container';
import { ProfileButton } from '@/entities/Auth';
import classes from './Header.module.scss';
import { NavBar } from './NavBar/NavBar';
import { BurgerMenu } from './BurgetMenu/BurgerMenu';


const Logo = dynamic(() => import('@/shared/ui/Logo/Logo'), { ssr: false });
const SearchHeader = dynamic(() => import('@/entities/SearchHeader/ui/SearchHeader'), { ssr: false });

const headerHeight = 170;

const Header = () => {
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  const ref = useRef<HTMLHeadElement | null>(null);

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const [ isInputActive, setIsInputActive ] = useState(false);

  const handleToggleInput = () => {
    setIsInputActive(prev => !prev);
  };

  const handleClose = () => {
    setIsInputActive(false);
  };

  useEffect(() => {
    let prevYOffset = 0;

    const handler = () => {
      if (!ref.current) return;

      const currentYOffset = window.pageYOffset;

      if (prevYOffset > currentYOffset || currentYOffset === 0 || currentYOffset < headerHeight) {
        ref.current.style.transform = 'translateY(0)';
      } else {
        setIsMenuOpen(false);
        handleClose();
        ref.current.style.transform = `translateY(-${headerHeight}px)`;
      }

      prevYOffset = currentYOffset;
    };

    window.addEventListener('scroll', handler);

    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header ref={ref} className={`${classes.header} ${isInputActive ? classes.activeSearch : ''}`}>
      <nav>
        <Container variant='large'>
          <div className={`${classes.container} ${isInputActive ? classes.activeSearcher : ''}`}>
            {!isInputActive && <Logo/>}
            <div className={classes.rightHalf} >
              <SearchHeader
                isInputActive={isInputActive}
                onToggleInput={handleToggleInput}
                onClose={handleClose}
              />
              {!isInputActive && <>
                <div className={classes.lang}>
                  <SelectLanguage/>
                </div>
                <div className={classes.burgerMenu}>
                  <BurgerMenu isOpen={isMenuOpen} onToggle={handleToggleMenu}/>
                </div>

                <ProfileButton className={classes.authButton}/>
              </>}
            </div>
          </div>
          <div className={classes.navbar}>
            <NavBar/>
          </div>
        </Container>
      </nav>
    </header>
  );
};

export default Header;
