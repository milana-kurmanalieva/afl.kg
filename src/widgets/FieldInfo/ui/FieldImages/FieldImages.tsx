import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { useSelector } from 'react-redux';
import { selectFieldAddress } from '@/entities/Field/model/FieldSlice';
import classes from './fieldImages.module.scss';
import './fieldImages.scss';


const FieldImages = () => {

  const { field } = useSelector(selectFieldAddress);

  const [ selectedImag, setSelectedImag ] = useState('');


  useEffect(() => {
    setSelectedImag(field?.field_photos?.length > 0 ? field.field_photos[ 0 ].photo : '');
  }, [ field?.field_photos ]);

  if (!selectedImag) return <></>;

  return (
    <>
      <div>
        <div className={classes.mainImage}>
          <img src={selectedImag}
            alt="Field Image"
            className={classes.mainImage_img}
          />
        </div>
        <ul className={classes.fieldImages}>
          {
            field.field_photos?.map((img) => (
              <li key={img?.id} className={classes.image} onClick={() => setSelectedImag(img?.photo)}>
                <img src={img?.photo}
                  alt="Field Image"
                  className={classes.fieldImages_img}
                />
              </li>
            ))
          }
        </ul>
      </div>

      <div className='fieldSlider'>
        <Swiper
          key={field?.id}
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
          ]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, type: 'fraction' }}
          scrollbar={{ draggable: true }}
          className={classes.swiper}
          initialSlide={0}
        >
          {field.field_photos?.map((img, index) =>
            <SwiperSlide key={index}
              className={`
            ${classes.swiperSlide}
            ${index === 0 ? classes[ 'swiper-slide-active' ] : ''}
            ${classes[ 'swiper-pagination-fraction' ]}
            `}>
              <img
                src={img?.photo}
                alt="Field Image"
                className={classes.swiperSlide_img}
              />
            </SwiperSlide>,
          )
          }
        </Swiper>
      </div>
    </>
  );
};

export default FieldImages;
