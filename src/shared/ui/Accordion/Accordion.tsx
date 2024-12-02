import React, { FC, MouseEvent, ReactNode, RefObject, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Directions } from '@/shared/lib/constants/constants';
import { Arrow } from '../Arrow/Arrow';
import classes from './accordion.module.scss';


interface Props {
  title: ReactNode;
  children: ReactNode;
  buttonsRefs?: RefObject<HTMLButtonElement>[];
  rightTitle?: ReactNode;
  isExpandable?: boolean;
  onToggle?: (isOpen: boolean) => void;
}


export const Accordion: FC<Props> = ({ children, title, buttonsRefs, rightTitle, isExpandable = true, onToggle }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const contentBlockRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!isExpandable ||
      (contentBlockRef.current && contentBlockRef.current.contains(e.target as Node)) ||
      (buttonsRefs?.length && buttonsRefs.some(item => item?.current && item.current.contains(e.target as Node)))
    ) return;
    onToggle && onToggle(!isOpen);
    setIsOpen(prev => !prev);
  };

  return (
    <div className={classes.accordion} onClick={handleToggle}>
      <div className={classes.title}>
        <div>
          {title}
        </div>
        <div className={classes.rightTitle}>
          {rightTitle}
          {isExpandable && <Arrow className={classes.arrow} direction={isOpen ? Directions.down : Directions.up}/>}
        </div>
      </div>
      {<AnimatePresence>
        {(isOpen && isExpandable) && (
          <motion.div
            ref={contentBlockRef}
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: .3 }}
            className={classes.body}
          >
            {children}
          </motion.div>)}
      </AnimatePresence>}
    </div>
  );
};
