import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,

} from 'react-share';
import { useTranslation } from 'next-i18next';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import copyIcon from '@/icons/copy.svg';
import doneIcon from '@/icons/done.svg';
import { Button } from '../Button/Button';
import { CloseIcon } from '../CloseIcon/CloseIcon';
import { HTag } from '../HTag/HTag';
import classes from './share.module.scss';


interface IShareModal {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  shareUrl: string;
}


export const ShareModal: FC<IShareModal> = ({ isOpen, setIsOpen, shareUrl }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const [ isCopied, setIsCopied ] = useState(false);
  const { t } = useTranslation();

  const handleCloseModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleCopyShareUrlToClipBoard = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(shareUrl);
  };

  useOutsideClick<HTMLDivElement | null>(modalRef, handleCloseModal, isOpen);

  useEffect(() => {
    setIsCopied(false);
  }, [ isOpen ]);

  if (!isOpen) return null;

  return (
    createPortal(
      <div className={classes.modal}>
        <div className={classes.content} ref={modalRef}>
          <div className={classes.title}>
            <HTag level={5}>{t('share')}</HTag>
            <CloseIcon onClick={handleCloseModal} className={classes.close} color='#000'/>
          </div>

          <ul className={classes.icons}>
            <li>
              <FacebookShareButton url={shareUrl} >
                <FacebookIcon size={48} round={true} />
              </FacebookShareButton>
            </li>

            <li>
              <TelegramShareButton url={shareUrl} >
                <TelegramIcon size={48} round={true} />
              </TelegramShareButton>
            </li>

            <li>
              <WhatsappShareButton url={shareUrl} >
                <WhatsappIcon size={48} round={true} />
              </WhatsappShareButton>
            </li>

            <li>
              <TwitterShareButton url={shareUrl} >
                <TwitterIcon size={48} round={true} />
              </TwitterShareButton>
            </li>
          </ul>

          <div className={classes.link}>
            <p>{shareUrl}</p>
            <Button onClick={handleCopyShareUrlToClipBoard}>
              {isMobile ?
                <img src={isCopied ? doneIcon.src : copyIcon.src} alt={t('copy') as string} /> :
                (isCopied ? `${t('copied')} !` : t('copy'))
              }
            </Button>
          </div>
        </div>
      </div>, document.body,
    )
  );
};
