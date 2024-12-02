import React, { FC } from 'react';
import { BurgerFilterButton } from '@/widgets/FilterField/ui/BurgerFilterButton/BurgerFilterButton';
import CatalogFilter from '@/shared/ui/Catalog/CatalogCard/CatalogFilter/CatalogFilter';
import { Modal } from '@/shared/ui/Modal/Modal';
import { CATALOG_TABS } from '@/shared/lib/constants/constants';
import CatalogFilterShop from '@/shared/ui/Catalog/CatalogCard/CatalogFilter/CatalogFilterShop/CatalogFilterShop';
import classes from './burgerFilter.module.scss';


interface IBurgerMenu {
  onToggle: () => void;
  tab: string;
  isOpen: boolean;
}

export const BurgerFilter: FC<IBurgerMenu> = ({ isOpen, onToggle, tab }) => {

  return (
    <div className={classes.burgerFilter}>
      <BurgerFilterButton isOpen={isOpen} onToggle={onToggle}/>
      <Modal
        className={`${classes.modalFilter}`}
        isOpen={isOpen}
        setIsOpen={onToggle}
        centered={false}
        closeButton={true}
      >
        <BurgerFilterButton isOpen={isOpen} onToggle={onToggle}/>
        {
          isOpen && tab === CATALOG_TABS.FIELDS && <CatalogFilter onToggle={onToggle}/>
        }
        {
          isOpen && tab === CATALOG_TABS.SHOPS && <CatalogFilterShop onToggle={onToggle}/>
        }
      </Modal>
    </div>
  );
};
