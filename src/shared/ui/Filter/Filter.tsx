import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import { Button } from '../Button/Button';
import classes from './filter.module.scss';


interface FilterProps {
  handleFilter: () => void;
  handleClearFilter: () => void;
  children?: ReactNode;
  className?: string;
}

export const Filter: FC<FilterProps> = ({
  handleFilter,
  handleClearFilter,
  children,
}) => {
  const { t } = useTranslation();


  return (
    <>
      <div className={classes.filter}>
        <div className={classes.filter_container}>
          {children}
        </div>
        <div className={classes.buttons}>
          <Button
            type="button"
            className={classes.btn}
            onClick={handleFilter}
          >
            {t('find')}
          </Button>
          <button
            type="button"
            className={classes.btnClear}
            onClick={handleClearFilter}
          >
            {t('clear')}
          </button>
        </div>
      </div>
    </>
  );
};
