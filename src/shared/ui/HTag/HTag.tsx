import React, { ReactNode } from 'react';
import { Typography } from 'antd';
import { Ubuntu } from 'next/font/google';
import classes from './htag.module.scss';


const { Title } = Typography ;

export interface HTagProps {
  children?: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 ;
  myClass?: string;
  myStyle?: object;
  center?: boolean;
}

const ubuntu = Ubuntu({
  weight: [ '500' ],
  style: [ 'normal' ],
  subsets: [
    'latin',
    'latin-ext',
    'cyrillic',
    'cyrillic-ext',
  ],
});

const fontSizeBreakPoint = 2;

export const HTag = ({ children, level = 2, myStyle, myClass, center }:HTagProps) => {
  return (
    <Title
      style={{
        fontFamily: level <= fontSizeBreakPoint && ubuntu.style.fontFamily ? ubuntu.style.fontFamily : '',
        textAlign: center ? 'center' : 'start',
        ...myStyle,
      }}
      className={`${classes[ 'h' + level ]} ${myClass}`}
      level={level}
    >{children}</Title>
  );
};
