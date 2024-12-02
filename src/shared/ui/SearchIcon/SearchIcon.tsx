import React from 'react';
import Image from 'next/image';
import classes from './searchIcon.module.scss';


type DivProps = JSX.IntrinsicElements['div'];
interface ISearchIcon extends DivProps {
  className?: string,
}

const SearchIcon = ({ className, ...props }: ISearchIcon) => {
  return (
    <div {...props} className={`${classes.icon} ${className}`}>
      <Image
        alt='loop'
        src='/icons/loop_icon.svg'
        width={20}
        height={20}
      />
    </div>
  );
};


export default SearchIcon;
