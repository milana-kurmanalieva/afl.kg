/* eslint-disable max-len */
import React from 'react';
import { Directions } from '@/shared/lib/constants/constants';
import classes from './arrow.module.scss';


interface IArrow {
  direction?: Directions;
  className?: string;
}

export const Arrow = ({ direction = Directions.down, className = '' }:IArrow) => {
  return (
    <div className={`${classes[ direction ]} ${className}`}>
      <DesktopArrow/>
    </div>
  );
};

export function DesktopArrow () {
  return (
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.00005 6.97505C5.86672 6.97505 5.73755 6.95005 5.61255 6.90005C5.48755 6.85005 5.38338 6.78338 5.30005 6.70005L0.700049 2.10005C0.516715 1.91672 0.425049 1.68338 0.425049 1.40005C0.425049 1.11672 0.516715 0.883382 0.700049 0.700049C0.883382 0.516715 1.11672 0.425049 1.40005 0.425049C1.68338 0.425049 1.91672 0.516715 2.10005 0.700049L6.00005 4.60005L9.90005 0.700049C10.0834 0.516715 10.3167 0.425049 10.6 0.425049C10.8834 0.425049 11.1167 0.516715 11.3 0.700049C11.4834 0.883382 11.575 1.11672 11.575 1.40005C11.575 1.68338 11.4834 1.91672 11.3 2.10005L6.70005 6.70005C6.60005 6.80005 6.49172 6.87088 6.37505 6.91255C6.25838 6.95422 6.13338 6.97505 6.00005 6.97505Z" fill="#5F5F5F"/>
    </svg>
  );
}
