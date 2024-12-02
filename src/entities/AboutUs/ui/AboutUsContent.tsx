import HTMLReactParser from 'html-react-parser';
import Image from 'next/image';
import { CSSProperties, useEffect } from 'react';
import { useSelector } from 'react-redux';
import grassFieldImage from '@/shared/assets/images/grassField.jpg';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { getAboutUs, selectAboutUs } from '../model/aboutUsSlice';
import { AboutUsState } from '../type/aboutUsScheme';
import classes from './aboutUsContent.module.scss';


export const AboutUsContent = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const { aboutUs }:AboutUsState = useSelector(selectAboutUs);


  const imageStyle: CSSProperties = {
    width: '100%',
    maxHeight: isMobile ? '190px' : '478px',
    objectFit: 'cover',
    borderRadius: '8px',
  };

  useEffect(() => {
    dispatch(getAboutUs());
  }, [ ]);

  return (
    <div className={classes.main}>
      <div className={classes.image}>
        <Image src={grassFieldImage} style={imageStyle} alt='grass'/>
      </div>
      <div className={classes.textBlock}>
        <h2 className={classes.title}>{aboutUs.title}</h2>
        <p className={classes.content}>
          {HTMLReactParser(aboutUs.content.replaceAll('h1', 'h2'))}
        </p>
      </div>
    </div>
  );
};
