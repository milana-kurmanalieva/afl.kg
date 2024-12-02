import { FC, Ref } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import classes from './timePickerIos.module.scss';


interface TimePickerProps {
  times: FilterSelectOption[],
  sliderRef: Ref<SwiperRef>,
  handleChange: () => void
}

export const TimePickerIos: FC<TimePickerProps> = ({ times, sliderRef, handleChange }) => {

  return (
    <Swiper
      ref={sliderRef}
      direction='vertical'
      effect='coverflow'
      grabCursor={true}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={false}
      modules={[ EffectCoverflow, Pagination ]}
      className={classes.mySwiper}
      slidesPerView={3}
      onTransitionEnd={handleChange}
    >
      {times.map((time) => (
        <SwiperSlide key={time.id}>{time.title}</SwiperSlide>
      ))}
    </Swiper>
  );
};
