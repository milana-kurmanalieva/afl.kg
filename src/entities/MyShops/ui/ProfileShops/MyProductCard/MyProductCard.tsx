import { FC, useRef, useState } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { SwiperOptions, Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/mousewheel';
import Link from 'next/link';
import optionsIcon from '@/icons/optionsIcon.svg';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import FixedPinIconBlack from '@/shared/assets/icons/pinIconBlack.svg';
import EditIcon from '@/icons/editIcon.svg';
import { PATHS } from '@/shared/lib/constants/constants';
import FixedPinIconWhite from '@/shared/assets/icons/fixedPinIcon.svg';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { editProductPin } from '@/entities/MyProducts/model/myProductsSlice';
import classes from './MyProductCard.module.scss';


interface ProductPhotos {
  id?: string
  photo?: string
  product?: string
}

interface MyProductCardProps {
  is_active?: boolean
  product_photos?: ProductPhotos[]
  title?: string
  price?: number
  id: string
  pin_product?: boolean
  updateProducts: () => void
}


const MyProductCard: FC<MyProductCardProps> = (props) => {
  const { title, product_photos, price, id, is_active, pin_product, updateProducts } = props;
  const dispatch = useAppDispatch();
  const [ openOptions, setOpenOptions ] = useState<boolean>(false);
  const [ active, setActive ] = useState<boolean | undefined>(is_active);
  const [ pined, setPined ] = useState<boolean | undefined>(pin_product);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  let swiperInstance: SwiperType | null = null;


  const swiperParams: SwiperOptions = {
    loop: true,
    initialSlide: 0,
    slidesPerView: 1,
  };

  const handleToggleOptions = () => {
    setOpenOptions(prev => !prev);
  };

  const handleToggleActive = () => {
    setActive(prev => !prev);
    dispatch(editProductPin({ product_id: id, data: { is_active: !active } }));
  };

  const handlePinProduct = async () => {
    setPined(prev => !prev);
    await dispatch(editProductPin({ product_id: id, data: { pin_product: !pined } }));
    await updateProducts();
  };

  useOutsideClick(optionsRef, handleToggleOptions, openOptions);
  return (
    <div className={classes.myProductCard}>
      {
        pined &&
        <div className={classes.pined}>
          <img src={FixedPinIconWhite.src} alt="pin icon" />
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
          product_photos && product_photos?.map((productPhoto, photoIndex) => (
            <SwiperSlide key={photoIndex}>
              <div className={classes.productImg}>
                <img src={productPhoto.photo} alt={title} />
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <p className={`${classes.productTitle, !active && classes.inactive}`}>{title ?? ''}</p>
      <div className={classes.options}>
        <p className={`${!active && classes.inactive}`}>{price} сом</p>
        <div className={classes.icon} onClick={handleToggleOptions}>
          <img src={optionsIcon.src} alt="options" />
        </div>
      </div>

      {
        openOptions &&
        <div className={classes.optionsBlock} ref={optionsRef}>
          <div className={classes.option} onClick={handleToggleActive}>
            <div className={`${classes.checkbox} ${active && classes.checkerActive}`}>
              <div className={`${classes.checker} ${active && classes.checkboxActive}`}/>
            </div>
            <p>{active ? 'Деактивировать' : 'Активировать'}</p>
          </div>
          <Link
            href={`${PATHS.profileEditProduct}&product_id=${id}`}
            className={classes.option}
          >
            <div className={classes.iconBlock}>
              <img src={EditIcon.src} alt="edit icon" />
            </div>
            <p>Изменить</p>
          </Link>
          <div className={classes.option} onClick={handlePinProduct}>
            <div className={classes.iconBlock}>
              <img src={FixedPinIconBlack.src } alt="pin icon" />
            </div>
            <p>{pined ? 'Открепить' : 'Закрепить'}</p>
          </div>
        </div>
      }
    </div>
  );
};

export default MyProductCard;
