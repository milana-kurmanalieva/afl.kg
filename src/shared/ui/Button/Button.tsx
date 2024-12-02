import React, { ComponentProps, ReactNode, Ref, forwardRef } from 'react';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import classes from './button.module.scss';


interface ButtonProps {
  children: ReactNode;
  variant?: BUTTON_VARIANTS;
  padding?: string;
  width?: string;
  disabled?: boolean;
  fontSize?: string;
}

// eslint-disable-next-line react/display-name
export const Button = forwardRef(({
  children,
  variant = BUTTON_VARIANTS.PRIMARY,
  padding,
  width,
  disabled,
  className,
  fontSize,
  ...restProps
}:ButtonProps & ComponentProps<'button'>, ref: Ref<HTMLButtonElement>) => {
  return (
    <button
      ref={ref}
      className={`${classes[ variant + 'Button' ]} ${disabled ? classes.disabled : ''} ${className}`}
      style={{ padding: padding, width: width, fontSize: fontSize }}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
});
