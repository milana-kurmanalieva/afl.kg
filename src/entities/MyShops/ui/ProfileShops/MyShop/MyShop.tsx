import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BUTTON_VARIANTS, PATHS, Shop } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { declensionOfGoods, truncateText } from '@/shared/lib/helpers/helpers';
import { Button } from '@/shared/ui/Button/Button';
import { Accordion } from '@/shared/ui/Accordion/Accordion';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { deleteProduct, getMyProductsFromShop, selectMyProducts } from '@/entities/MyProducts/model/myProductsSlice';
import { Modal } from '@/shared/ui/Modal/Modal';
import { selectSupport } from '@/entities/WhatsApp/model/supporSlice';
import MyProductCard from '../MyProductCard/MyProductCard';
import classes from './myShop.module.scss';


const PRODUCT_LIMIT = 20;
const LIMIT_TEXT_LENGTH = 15;

interface Props {
  shop: Shop;
  idx: number;
  deleteButton?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const MyShop: FC<Props> = ({
  shop,
  idx,
  onToggle,
}) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { myProductsRecord } = useAppSelector(selectMyProducts);
  const { techLink } = useAppSelector(selectSupport);
  const { products, hasMore } = useMemo(
    () => myProductsRecord[ shop.id ] ?? { products: [], hasMore: false }, [ shop.id, myProductsRecord ]);

  const [ open, setOpen ] = useState<boolean>(false);

  const editBtn = useRef(null);
  const addProductBtn = useRef(null);

  const isActive = shop.is_confirmed;

  const handleAddProduct = () => {
    if (shop.product_limit === shop.products_total) {
      setOpen(true);
    } else {
      router.push(`${PATHS.profileCreateProduct}&store=${shop.id}`);
    }
  };

  const handleRedirectToSupport = () => {
    window.open(techLink?.url ?? '', '_blank');
  };

  const handleLoadMoreProducts = () => {
    if (isActive) {
      dispatch(getMyProductsFromShop({ store_id: shop.id, limit: PRODUCT_LIMIT }));
    }
  };

  const updateProducts = () => {
    dispatch(getMyProductsFromShop({ store_id: shop.id, limit: PRODUCT_LIMIT }));
  };

  const toggleShop = (isOpen: boolean) => {
    dispatch(getMyProductsFromShop({ store_id: shop.id, limit: PRODUCT_LIMIT }));
    onToggle && onToggle(isOpen);
  };

  return (
    <li className={classes.address}>
      <Accordion
        onToggle={toggleShop}
        buttonsRefs={[ editBtn, addProductBtn ]}
        isExpandable={isActive}
        rightTitle={isActive ? (
          <div className={classes.buttons}>
            <Link
              href={`${PATHS.profileEditShop}&shop_id=${shop.id}`}
              className={classes.editLink}
              ref={editBtn}
            > Изменить</Link>
            <Button
              className={classes.btn}
              ref={addProductBtn}
              variant={BUTTON_VARIANTS.PRIMARY}
              onClick={handleAddProduct}
            >Добавить товар</Button>
          </div>
        ) : <p>{t('onReview')}</p>}
        title={
          <div className={classes.title}>
            <div className={classes.addressTitle}>
              <p className={classes.number}>{idx + 1}</p>
              <div className={classes.addressInfo}>
                <p className={classes.name}>
                  {isMobile ? truncateText(shop.title, LIMIT_TEXT_LENGTH) : shop.title}
                </p>
              </div>
            </div>
          </div>
        }>
        <LoadMoreContainer hasMore={hasMore} loadMore={handleLoadMoreProducts}>
          <div className={classes.fields}>
            {products?.map((item: any) => (
              <MyProductCard
                updateProducts={updateProducts}
                title={item.title}
                product_photos={item.product_photos}
                key={item.id}
                price={item.price}
                id={item.id}
                is_active={item.is_active}
                pin_product={item.pin_product}
              />
            ))}
          </div>
        </LoadMoreContainer>
      </Accordion>
      <Modal
        isOpen={open}
        setIsOpen={setOpen}
        cancelButton
        centered
        submitButton={'Связаться'}
        className={classes.modal}
        onSubmit={handleRedirectToSupport}
      >
        <p>
          Извините, но вы достигли лимита в {declensionOfGoods(shop.product_limit ?? 20)}
          для добавления в магазин. Пожалуйста, свяжитесь
          с администратором сайта для получения дополнительной информации.
        </p>
      </Modal>
    </li>
  );
};
