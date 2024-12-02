import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/shared/ui/Button/Button';
import { BUTTON_VARIANTS, PATHS, Shop } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { getStoresBySearch } from '@/entities/Store/model/StoreSlice';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import FixedPinIcon from '@/shared/assets/icons/fixedPinIcon.svg';
import classes from './cardShops.module.scss';


type StoreProps = {
  store: Shop;
}

const CardShops: FC<StoreProps> = ({ store }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile();

  const navigate = () => {
    dispatch(getStoresBySearch({ search: store.title }));
    router.push(`${PATHS.store}/${store.id}`);
  };

  const handleClick = isMobile ? navigate : undefined;


  return (
    <div className={classes.card} onClick={handleClick}>
      {
        store.number_store &&
        <div className={classes.fixedCardIcon}>
          <img src={FixedPinIcon.src} alt="Fixed Icon" />
        </div>
      }
      <div className={classes.cardBox}>
        <div className={classes.imageBox}>
          <img src={store?.store_logo?.logo as string} alt="catalog.photo"/>
        </div>
        <p>
          <span className={classes.title}>«{store.title}»</span>
        </p>
        <p className={classes.description}>
          <span className={classes.infoDescription}>{store.description}</span>
        </p>
      </div>
      <Button
        type="button"
        variant={BUTTON_VARIANTS.PRIMARY}
        className={classes.btnClear}
        onClick={navigate}
      >
        {t('moreDetails')}
      </Button>
    </div>
  );
};

export default CardShops;
