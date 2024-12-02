import { FC, ReactNode } from 'react';


export const UnCLickableWrapper: FC<{
  isDisabled?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ isDisabled = true, children, className }) => {
  return (
    <div
      className={className}
      data-id="wrapper"
      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
    >
      {children}
    </div>
  );
};
