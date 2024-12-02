import React, { FC, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import { SelectLanguage } from '@/entities/SelectLanguage';
import { ProfileButton } from '@/entities/Auth';
import { selectAuth } from '@/entities/Auth/model/authSlice';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { useUserDefaultProfileRoute } from '@/shared/lib/hooks/useUserDefaultProfileRoute';
import { NavBar } from '../NavBar/NavBar';
import { BurgerButton } from '../BurgerButton/BurgerButton';
import classes from './menu.module.scss';


interface IBurgerMenu {
  onToggle: () => void;
  isOpen: boolean;
}

type menuElementType = HTMLDivElement | null;


export const BurgerMenu: FC<IBurgerMenu> = ({ isOpen, onToggle }) => {
  const { user } = useAppSelector(selectAuth);
  const menuRef = useRef<menuElementType>(null);

  const userDefaultProfileRoute = useUserDefaultProfileRoute();

  useOutsideClick<menuElementType>(menuRef, onToggle, isOpen);

  return (
    <div className={classes.container}>
      <BurgerButton isOpen={isOpen} onToggle={onToggle}/>

      <div ref={menuRef}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ translateY: -10, opacity: 0, scale: .9 }}
              animate={{ translateY: 0, opacity: 1, scale: 1 }}
              exit={{ translateY: -10, opacity: 0, scale: .9 }}
              transition={{ duration: .2 }}
              className={classes.menu}
            >
              <div>
                {!!user && <Link
                  onClick={onToggle}
                  className={classes.link}
                  href={userDefaultProfileRoute}
                >Профиль</Link>}
                <NavBar closeMenu={onToggle}/>
              </div>
              <div className={classes.bottom}>
                <SelectLanguage />
                <ProfileButton showAvatar={false} className={classes.profileButton}/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
