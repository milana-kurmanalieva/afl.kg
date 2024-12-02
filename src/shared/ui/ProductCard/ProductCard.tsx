import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { SwiperOptions, Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';
import { useRouter } from 'next/router';
import { PATHS, Product, Shop } from '@/shared/lib/constants/constants';
import FixedPinIconWhite from '@/shared/assets/icons/fixedPinIcon.svg';
import classes from './productCard.module.scss';


const swiperDelay = 1000;

interface ProductCardProps {
  product?: Product | Shop,
}

const ProductCard: FC<ProductCardProps> = (props) => {
  const { product } = props;
  let swiperInstance: SwiperType | null = null;
  let interval: NodeJS.Timer;
  const router = useRouter();
  const { id } = router.query;

  const handleMouseEnter = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      if (!swiperInstance?.destroyed) {
        swiperInstance?.slideNext();
      }
    }, swiperDelay);
  };

  const handleMouseLeave = () => {
    clearInterval(interval);
    swiperInstance?.slideTo(0, 500);
  };

  const navigate = () => {
    if (product) {
      if ('store' in product) {
        router.push(`${PATHS.productDetail}/${product.store || id}?productId=${product.id}`);
      } else {
        router.push(`${PATHS.productDetail}/${id}?productId=${product?.id}`);
      }
    }
  };


  const swiperParams: SwiperOptions = {
    loop: true,
    initialSlide: 0,
    slidesPerView: 1,
  };

  return (
    <div
      className={classes.cardMain}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={navigate}
    >
      {
        product?.pin_product &&
        <div className={classes.pinBlock}>
          <img src={FixedPinIconWhite.src} alt="pined" />
        </div>
      }
      <Swiper
        className={classes.swiper}
        modules={[ Autoplay ]}
        onSwiper={(swiper) => {
          swiperInstance = swiper;
        }}
        {...swiperParams}
      >
        {
          product?.product_photos && product?.product_photos?.map((productPhoto, photoIndex) => (
            <SwiperSlide key={photoIndex}>
              <div className={classes.productImg}>
                <img src={productPhoto.photo} alt={product.description} />
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <p className={classes.cardDescription}>{product?.title.slice(0, 20) ?? ''}</p>
      <p className={classes.cardPrice}>{product?.price ?? ''} сом</p>
    </div>
  );
};

export default ProductCard;
