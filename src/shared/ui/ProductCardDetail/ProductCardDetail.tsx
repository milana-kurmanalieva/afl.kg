import { type ParsedUrlQuery } from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getSimilarProducts, selectMyProducts } from '@/entities/MyProducts/model/myProductsSlice';
import phoneCallIcon from '@/shared/assets/icons/phoneCall.svg';
import { getStoreProductDetails, selectStoreFields } from '@/entities/Store/model/StoreSlice';
import { Container } from '../Container/Container';
import ProductCard from '../ProductCard/ProductCard';
import { HTag } from '../HTag/HTag';
import classes from './productCardDetail.module.scss';


const ProductCardDetail: FC = () => {
  const dispatch = useAppDispatch();
  const { similarProducts } = useAppSelector(selectMyProducts);
  const { storeProductDetail } = useAppSelector(selectStoreFields);
  const router = useRouter();
  const [ activeImage, setActiveImage ] = useState<string | undefined>(undefined);
  const [ showPhoneNumber, setShowPhoneNumber ] = useState(false);
  const { t } = useTranslation();

  const productCategory = storeProductDetail?.categories[ storeProductDetail?.categories.length - 1 ];

  const { productId, id } = router.query as ParsedUrlQuery & { productId?: string; id: string};
  const storeId = id;

  useEffect(() => {
    if (storeId && productId) {
      dispatch(getStoreProductDetails({ storeId: storeId, productId: productId }));
    }
  }, [
    dispatch,
    productId,
    storeId,
  ]);

  useEffect(() => {
    if (!storeProductDetail || !productCategory) return;
    if (!storeProductDetail.product_photos || storeProductDetail.product_photos?.length === 0) {
      setActiveImage(undefined);
    } else {
      setActiveImage(storeProductDetail.product_photos[ 0 ]?.photo);
    }
    dispatch(getSimilarProducts({
      store_id: storeProductDetail?.store,
      category_slug: productCategory.slug,
    }));
  }, [
    dispatch,
    storeProductDetail,
    productCategory,
  ]);

  if (similarProducts.length === 0) return <></>;

  const handleShowPhoneNumber = () => {
    setShowPhoneNumber(true);
  };

  return (
    <Container variant='large'>
      <div className={classes.main}>
        <div className={classes.gallery}>
          <div className={classes.thumbnails}>
            {storeProductDetail?.product_photos.length && storeProductDetail?.product_photos?.map((image, index) => (
              <div key={index} className={`${classes.thumbnailWrapper}
                ${activeImage === image.photo ? classes.active : ''}`}
              >
                <img
                  className={`${classes.thumbnail} `}
                  src={image.photo}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setActiveImage(image.photo)}
                />
              </div>
            ))}
          </div>
          <div className={classes.mainImage}>
            <img src={activeImage} alt="Selected" />
          </div>
        </div>
        <div className={classes.block}>
          <p className={classes.title}>{storeProductDetail?.title.slice(0, 50)}</p>
          <p className={classes.description}>{storeProductDetail?.description}</p>
          <div className={classes.characteristic}>
            <p className={classes.characteristicTitle}>{t('characteristic')}</p>
            <p className={classes.characteristicObject}>
              {t('brand')} <div className={classes.characteristicKey} />
              <span className={classes.nameBrand}>{storeProductDetail?.brand}</span>
            </p>
            <p className={classes.characteristicObject}>
              {t('category')} <div className={classes.characteristicKey} />
              <span className={classes.nameBrand}>{storeProductDetail?.categories[ 0 ].title}</span>
            </p>
            <p className={classes.characteristicObject}>
              {t('delivery')} <div className={classes.characteristicKey} />
              <span className={classes.nameBrand}>{t(storeProductDetail?.delivery || '')}</span>
            </p>
          </div>
          <p className={classes.price}>{storeProductDetail?.price} сом</p>
          <div className={classes.contacts}>
            <a className={classes.callBlock} href={`tel:${storeProductDetail?.main_number}`}>
              <img src={phoneCallIcon.src} alt='phone' />
              <p className={classes.number}>
                {showPhoneNumber
                  ? storeProductDetail?.main_number
                  : storeProductDetail?.main_number.slice(0, -2) + '**'}
              </p>
            </a>
            <button className={classes.showButton} onClick={handleShowPhoneNumber}>
              {t('load')}
            </button>
          </div>
        </div>
      </div>
      <div className={classes.similarProducts}>
        <HTag level={4}>{t('similarProducts')}</HTag>
        <Swiper
          modules={[ Navigation ]}
          className={classes.slider}
          slidesPerView={6}
          navigation={similarProducts.length > 6 ? true : false}
        >
          {similarProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
};

export default ProductCardDetail;
