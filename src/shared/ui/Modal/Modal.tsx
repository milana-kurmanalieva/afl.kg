import { AnimatePresence, motion } from 'framer-motion';
import React, { Dispatch, FC, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'next-i18next';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import close from '@/icons/closeDark.svg';
import { Button } from '../Button/Button';
import { HTag } from '../HTag/HTag';
import classes from './modal.module.scss';


interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  onClose?: () => void;
  centered?: boolean;
  className?: string;
  title?: ReactNode;
  cancelButton?: boolean;
  closeButton?: boolean;
  submitButton?: ReactNode;
  onSubmit?: () => void;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  children,
  onClose,
  centered = true,
  className,
  title,
  cancelButton,
  closeButton,
  submitButton,
  onSubmit,
}) => {
  const [ isMounted, setIsMounted ] = useState(false);
  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  useOutsideClick<HTMLDivElement | null>(modalRef, handleClose, isOpen);

  useEffect(() => {
    setIsMounted(true);

    const onEscapeClose = (e: any) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', onEscapeClose);

    return () => {
      window.removeEventListener('keydown', onEscapeClose);
    };
  }, [ ]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [ isOpen ]);

  if (!isMounted) return null;

  return (
    createPortal(
      <>
        {isOpen && (
          <div className={`${classes.modal} ${isOpen ? classes.modalActive : ''}`}/>
        )}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={modalRef}
              className={`
                ${classes.content}
                ${centered ? classes.centered : ''}
                ${className}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .5, type: 'tween' }}
            >
              <HTag level={5}>{title}</HTag>
              {!closeButton && <img onClick={handleClose} className={classes.close} src={close.src} alt='x'/>}
              {children}
              {(cancelButton || cancelButton) && <div className={classes.buttons}>
                {cancelButton &&
                  <Button onClick={handleClose} variant={BUTTON_VARIANTS.OUTLINED}>{t('cancel')}</Button>}
                {!!submitButton && <Button onClick={() => onSubmit && onSubmit()}>{submitButton}</Button>}
              </div>}
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body,
    )
  );
};
