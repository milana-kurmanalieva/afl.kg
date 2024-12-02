import React, { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import eyeIcon from '@/icons/eye.svg';
import closedEye from '@/icons/closedEye.svg';
import classes from './input.module.scss';


interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  containerClassName?: string;
  label?: ReactNode;
  isError?: boolean;
  onlyArrow?: boolean;
  readonly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInput>(({
  startIcon,
  endIcon,
  containerClassName,
  label,
  isError,
  onlyArrow = false,
  readOnly = false,
  ...props
}, ref) => {
  const [ isPasswordOpen, setIsPasswordOpen ] = useState(false);

  return (
    <>
      {label && <label className={classes.label}>{label}</label>}
      <div className={`
        ${classes.inputContainer}
        ${containerClassName}
        ${onlyArrow ? classes.arrow : ''}
        ${isError ? classes.errorContainer : ''}
      `}>
        <div className={classes.startIcon}>
          {startIcon}
        </div>
        <input
          ref={ref}
          className={`${classes.input} ${isError ? classes.error : ''}`}
          {...props}
          readOnly={readOnly}
          type={props.type === 'password' ? (isPasswordOpen ? 'text' : 'password') : props.type || 'text'}
        />
        <div className={classes.endIcon}>
          {props.type === 'password' ? (
            <div className={classes.eye}>
              {isPasswordOpen ?
                <img onClick={() => setIsPasswordOpen(false)} src={eyeIcon.src} alt="eye-open" />
                : <img onClick={() => setIsPasswordOpen(true)} src={closedEye.src} alt="eye-close" />
              }
            </div>
          ) : endIcon}
        </div>
      </div>
    </>
  );
});

Input.displayName = 'input';
