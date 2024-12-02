import React, { FC, ReactNode, useEffect, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/css';
// eslint-disable-next-line import/named
import { DefaultTFuncReturn } from 'i18next';
import { Autoplay, Mousewheel, Navigation } from 'swiper/modules';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { ShowAllLink } from '../ShowAllLink/ShowAllLink';
import { HTag } from '../HTag/HTag';
import classes from './slider.module.scss';


interface ISlider {
  slides: any[];
  renderSlide: (slide: any) => ReactNode;
  title?: string | DefaultTFuncReturn;
  pageHref?: string;
  autoplay?: boolean;
  reverseAutoPlay?: boolean;
  titleCenter?: boolean;
  titleClass?: string
}

const Slider:FC<ISlider> = (
  {
    slides,
    renderSlide,
    title,
    pageHref,
    autoplay,
    reverseAutoPlay,
    titleCenter = false,
    titleClass,
    ...rest
  }) => {
  const isMobile = useIsMobile();
  const level = isMobile ? 4 : 2;
  const sliderRef = useRef<SwiperRef>(null);

  const autoSlides = useMemo(() => {
    if (autoplay && slides.length > 4) return [ ...slides, ...slides ];
    return slides;
  }, [ autoplay ]);

  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current?.swiper?.activeIndex && autoplay && isMobile && slides.length > 4) {
        const nextSlide = sliderRef.current.swiper.activeIndex + (reverseAutoPlay ? -1 : 1);
        sliderRef.current.swiper.slideTo(nextSlide);
      }
    }, 1000);
  }, [ autoplay, isMobile ]);

  return (
    <div className={classes.sliderWrapper}>
      {!!title && <HTag
        center={titleCenter}
        level={level}
        myClass={titleClass}
      >{title}</HTag>}

      <Swiper
        ref={sliderRef}
        loop={autoplay}
        mousewheel={true}
        modules={[
          Autoplay,
          Navigation,
          Mousewheel,
        ]}
        spaceBetween={10}
        slidesPerView={isMobile ? 1.2 : 4}
        autoplay={autoplay && {
          delay: 1000,
          disableOnInteraction: false,
          reverseDirection: reverseAutoPlay,
        }}
        initialSlide={Math.floor(slides.length / 2)}
        centeredSlides
        navigation
        className={classes.slider}
        {...rest}
      >
        {autoSlides.map((slide, idx) => (
          <SwiperSlide className={classes.slide} key={idx}>
            {renderSlide(slide)}
          </SwiperSlide>
        ))}
      </Swiper>

      {!!pageHref && <ShowAllLink isSection href={pageHref}/>}
    </div>
  );
};

export default Slider;
