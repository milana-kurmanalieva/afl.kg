import React, { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
// eslint-disable-next-line import/named
import { DefaultTFuncReturn } from 'i18next';
import { Directions, FilterSelectOption } from '@/shared/lib/constants/constants';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { Arrow } from '../Arrow/Arrow';
import classes from './select.module.scss';


interface IFilterSelect {
  options?: Array<FilterSelectOption>;
  label: string | DefaultTFuncReturn;
  labelIcon?: string;
  changeOption: (option: FilterSelectOption) => void;
  secondary?: boolean;
  hover?: boolean;
  isInitialOpen?: boolean;
  isCatalogFilter?: boolean;
  className?: string;
  menuClass?: string;
  disabled?: boolean;
  menuDirection?: boolean;
}

type selectRefType = HTMLDivElement | null;

const FilterSelect = ({
  options = [],
  label,
  labelIcon = '',
  changeOption,
  secondary = false,
  hover,
  isInitialOpen = false,
  isCatalogFilter = false,
  className = '',
  menuClass = '',
  disabled = false,
  menuDirection = false,
}: IFilterSelect) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const selectRef = useRef<selectRefType>(null);

  const handleToggleMenu = () => {
    if (options?.length <= 0) return;
    setIsOpen(prev => !prev);
  };

  const handleChangeOption = (option : FilterSelectOption) => {
    handleToggleMenu();
    changeOption(option);
  };

  const closeSelect = () => {
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (!hover || isMobile) return;
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!hover || isMobile) return;
    setIsOpen(false);
  };

  useOutsideClick<selectRefType>(selectRef, closeSelect, isOpen && options.length > 0);

  useEffect(() => {
    if (isInitialOpen) {
      setIsOpen(isInitialOpen);
    }
  }, [ isInitialOpen ]);

  return (
    <div
      ref={selectRef}
      className={`
      ${classes.container} ${secondary ? classes.secondary : ''}
      ${isOpen ? classes.active : ''}
      ${isCatalogFilter ? classes.catalogFilter : ''}
      ${className}
      ${menuDirection ? classes.menuDirection : ''}
      `}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onClick={handleToggleMenu}
        className={`${classes.toggle} ${isOpen ? classes.click : ''} ${disabled ? classes.disabledSelect : ''}`}
      >
        <div className={`${classes.labelContainer} ${disabled ? classes.disabledLabel : ''}`}>
          {isMobile ? (
            (label !== undefined && label !== null) ? label : options[ 0 ]?.title
          ) : (
            !!labelIcon ? (
              <div className={classes.title}>
                <Image src={labelIcon} width={24} height={20} alt='logo' />
                <p className={classes.selectingLabel}>
                  {(label !== undefined && label !== null) ? label : options[ 0 ]?.title}
                </p>
              </div>
            ) : (
              <p className={classes.selectingLabel}>
                {(label !== undefined && label !== null) ? label : options[ 0 ]?.title}
              </p>
            )
          )}
        </div>
        {options?.length > 0 && (
          <Arrow direction={isOpen ? Directions.up : Directions.down} />
        )}
      </div>
      <AnimatePresence>
        {isOpen && options.length > 0 && (
          <motion.div
            initial={menuDirection ? { height: 0, opacity: 0 } : { translateY: -10, opacity: 0, scale: .9 }}
            animate={menuDirection ? { height: 'auto', opacity: 1 } : { translateY: 0, opacity: 1, scale: 1 }}
            exit={menuDirection ? { height: 0, opacity: 0 } : { translateY: -10, opacity: 0, scale: .9 }}
            transition={{ duration: .3 }}
            className={`${classes.menu} ${menuClass}`}
          >
            <ul>
              {!!options.length && options.map(option => (
                <li
                  onClick={() => handleChangeOption(option)}
                  key={option.title}
                >
                  {option.logo && <img className={classes.optionImage} src={option.logo} alt=''/>}
                  <span>{option.title}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

  );
};

export default memo(FilterSelect, (prevProps, nextProps) => {
  return prevProps.label === nextProps.label &&
   prevProps.options === nextProps.options &&
   prevProps.isInitialOpen === nextProps.isInitialOpen;
});
