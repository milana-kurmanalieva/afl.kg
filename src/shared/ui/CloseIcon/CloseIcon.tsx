import React, { FC } from 'react';


type DivProps = JSX.IntrinsicElements['div'];

interface ICloseIcon extends DivProps {
  fill?: string;
}

export const CloseIcon:FC<ICloseIcon> = ({ fill = '#9E9E9E', ...props }) => {
  return (
    <div {...props}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* eslint-disable-next-line max-len */}
        <path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699987 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699987 11.9L5.59999 7.00005L0.699987 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699987 0.700048C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700048L6.99999 5.60005L11.9 0.700048C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700048C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill={fill}/>
      </svg>
    </div>
  );
};