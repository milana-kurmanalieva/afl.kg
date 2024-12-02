import { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { HTag } from '@/shared/ui/HTag/HTag';
import { emailChange } from '@/entities/Auth/model/authSlice';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import { AlertVariants, STATUS_CODES } from '@/shared/lib/constants/constants';
import { ProfileChangeInfo } from '../ProfileChangeInfo/ProfileChangeInfo';


export const EmailChange = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [ existingEmail, setExistingEmail ] = useState('');
  const [ newEmail, setNewEmail ] = useState('');
  const [ existingPassword, setExistingPassword ] = useState('');

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(existingEmail)) {
      customAlert(AlertVariants.error, t('typeYourEmailError'));
      return;
    }

    if (!isEmailValid(newEmail)) {
      customAlert(AlertVariants.error, t('typeYourEmailError'));
      return;
    }

    if (existingPassword.length === 0 || existingPassword.length < 7) {
      customAlert(AlertVariants.error, t('passwordNullError'));
      return;
    }

    const response = await dispatch(emailChange({
      new_email: newEmail,
      password: existingPassword,
    })).unwrap();

    if (STATUS_CODES[ response.statusCode ]) {
      customAlert(AlertVariants.error, STATUS_CODES[ response.statusCode ].message);
      return;
    }

    if (response.status === 'passwordNotCorrect') {
      customAlert(AlertVariants.error, t('passwordError'));
      return;
    }
    customAlert(AlertVariants.success, t('mailHasBeenChanged'));
  };

  return (
    <div>
      <HTag level={4}>{t('changeMail')}</HTag>
      <ProfileChangeInfo
        handleSubmit={handleSubmit}
        typeInput='email'
        existingInput={existingEmail}
        setExistingInput={setExistingEmail}
        existingInputLabel={t('enterExistingEmail')}
        newInfoInput={newEmail}
        setNewInfoInput={setNewEmail}
        newInfoInputLabel={t('enterNewEmail')}
        confirmPasswordInput={existingPassword}
        setConfirmPasswordInput={setExistingPassword}
        confirmPasswordInputLabel={t('enterPassword')}
        textButton={t('changeEMail')}
      />
    </div>
  );
};
