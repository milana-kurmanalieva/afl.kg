import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Button } from '@/shared/ui/Button/Button';
import { PATHS } from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getMyShops, selectMyShop } from '../../model/myShopsSlice';
import classes from './shops.module.scss';
import { MyShopsList } from './MyShopList/MyShopsList';


export const ProfileShops = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { myShops } = useAppSelector(selectMyShop);

  const [ hideCreationBtn, setHideCreationBtn ] = useState(false);

  useEffect(() => {
    dispatch(getMyShops({ limit: 20 }));
  }, []);

  const buttonText = myShops.length === 0 ? t('addShop') : 'Добавить магазин';

  return (
    <div>
      <HTag level={4}>{t('listOfShops')}</HTag>
      <p className={classes.caption}>{t('createShopsData')}</p>
      <MyShopsList list={myShops} setHideCreationBtn={setHideCreationBtn}/>
      {!hideCreationBtn &&
        <Button
          onClick={() => router.push(PATHS.profileCreateShop)} className={classes.addShop}
        >
          {buttonText}
        </Button>}
    </div>
  );
};
