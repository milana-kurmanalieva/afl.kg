// IsGoogleAuthModal.jsx
import { createPortal } from 'react-dom';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PATHS } from '@/shared/lib/constants/constants';
import { HTag } from '../HTag/HTag';
import { Input } from '../Input/Input';
import radioIcon from '../../assets/icons/radioButton.svg';
import classes from './isGoogleAuthModal.module.scss';


interface IsGoogleAuthModalProps {
  onSelect: (isFieldOwner: boolean, phoneNumber?: string) => void;
}

const IsGoogleAuthModal: FC<IsGoogleAuthModalProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [ isMounted, setIsMounted ] = useState(false);
  const [ showPhoneNumberInput, setShowPhoneNumberInput ] = useState(false);
  const [ phoneNumber, setPhoneNumber ] = useState('996');
  const [ selectedAnswer, setSelectedAnswer ] = useState<null | boolean>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelect = (isFieldOwner: boolean) => {
    setSelectedAnswer(isFieldOwner);
    if (isFieldOwner) {
      setShowPhoneNumberInput(true);
    } else if (!isFieldOwner) {
      localStorage.setItem('hasLoggedInWithGoogle', 'true');
      router.push(PATHS.home);
    }
  };

  const handleSend = () => {
    localStorage.setItem('hasLoggedInWithGoogle', 'true');
    if (selectedAnswer === true && showPhoneNumberInput && phoneNumber) {
      onSelect(true, phoneNumber);
    } else if (!selectedAnswer || (selectedAnswer && !showPhoneNumberInput)) {
      setSelectedAnswer(null);
      setShowPhoneNumberInput(false);
    } else if (phoneNumber) {
      localStorage.setItem('hasLoggedInWithGoogle', 'true');
    }
    else {
      return;
    }
  };

  if (!isMounted) return <></>;

  return createPortal(
    <div className={classes.modalContainer}>
      <div ref={modalRef} className={classes.modalContent}>
        <HTag center={true} level={5}>{t('areYouTheOwnerOfTheField')}</HTag>
        <div>
          <div className={classes.modalInfo}>
            <div
              className={`${classes.selectAnswerModal} ${selectedAnswer === true ? classes.selected : ''}`}
              onClick={() => handleSelect(true)}
            >
              <img src={radioIcon.src} alt='radioIcon' />
              <p>{t('yes')}</p>
            </div>
            <div
              className={`${classes.selectAnswerModal} ${selectedAnswer === false ? classes.selected : ''}`}
              onClick={() => handleSelect(false)}
            >
              <img src={radioIcon.src} alt='radioIcon' />
              <p>{t('no')}</p>
            </div>
          </div>


          {showPhoneNumberInput && (
            <div className={classes.modalUserContacts}>
              <div className={classes.phoneNumberInput}>
                <Input
                  value={phoneNumber.startsWith('996') ? phoneNumber : `${phoneNumber}`}
                  onChange={(event) => {
                    const newPhoneNumber = event.target.value.replace(/\D/g, '');
                    if (newPhoneNumber.length <= 12) {
                      setPhoneNumber(newPhoneNumber);
                    }

                  }}
                  placeholder={t('enterYourPhoneNumber') as string}
                />
              </div>
              <button className={classes.sendButton} onClick={handleSend}>
                {t('save')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default IsGoogleAuthModal;
