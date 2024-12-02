import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import soccerImage from '@/shared/assets/images/ballOnField.jpg';
import classes from '../modals.module.scss';


interface IModalCanClose {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setCanClose: Dispatch<SetStateAction<boolean>>;
}

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  marginBottom: '20px',
};

const ModalCanClose = ({ setModalOpen, setCanClose }: IModalCanClose) => {
  const { t } = useTranslation();

  const texts = {
    title: t('wannaClose'),
    description: t('pollsDescription'),
  };

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modal}>
        <div className={classes.top}>
          <div className={classes.titleBlock}>
            <div className={classes.title}>{texts.title}</div>
          </div>
          <div className={classes.topDescription}>
            {texts.description}
          </div>

          <Image
            src={soccerImage}
            alt='soccerImage'
            style={imageStyle}
          />
        </div>

        <div className={classes.bottom}>
          <div className={classes.buttons}>
            <Button onClick={() => setModalOpen(false)} variant={BUTTON_VARIANTS.OUTLINED}>{t('close')}</Button>
            <Button onClick={() => setCanClose(false)}>{t('return')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCanClose;
