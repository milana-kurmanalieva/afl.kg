import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Shop } from '@/shared/lib/constants/constants';
import { MyShop } from '../MyShop/MyShop';
import classes from './myShops.module.scss';


interface Props {
  list: Shop[];
  setHideCreationBtn?: Dispatch<SetStateAction<boolean>>;
  deleteButton?: boolean;
}

export const MyShopsList: FC<Props> = ({
  list,
  setHideCreationBtn,
  deleteButton,
}) => {
  const { t } = useTranslation();
  const [ openedShops, setOpenedShops ] = useState(0);

  const onShopOpen = (isOpen: boolean) => {
    setOpenedShops(prev => {
      let res = prev;

      if (isOpen) res += 1;
      else res -= 1;

      if (res === 0) setHideCreationBtn && setHideCreationBtn(false);
      else setHideCreationBtn && setHideCreationBtn(true);

      return res;
    });
  };

  return (
    <>
      <ul className={classes.header}>
        <li>№</li>
        <li>{t('name')}</li>
      </ul>
      <ul className={classes.body}>
        {list.map((item, idx) => (
          <MyShop
            onToggle={onShopOpen}
            key={item.id}
            shop={item}
            idx={idx}
            deleteButton={deleteButton}
          />
        ))}
      </ul>
    </>
  );
};
