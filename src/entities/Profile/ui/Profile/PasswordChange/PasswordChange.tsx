// PasswordChange.jsx
import { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { HTag } from '@/shared/ui/HTag/HTag';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { passwordChange } from '@/entities/Auth/model/authSlice';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import { AlertVariants, STATUS_CODES } from '@/shared/lib/constants/constants';
import { ProfileChangeInfo } from '../ProfileChangeInfo/ProfileChangeInfo';


export const PasswordChange = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [ existingPassword, setExistingPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ confirmNewPassword, setConfirmNewPassword ] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!existingPassword || !newPassword || !confirmNewPassword) {
      customAlert(AlertVariants.error, t('fillAllPasswordFields'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      customAlert(AlertVariants.error, t('passwordMismatch'));
      return;
    }

    const response = await dispatch(passwordChange({
      current_password: existingPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    })).unwrap();

    if (STATUS_CODES[ response.statusCode ]) {
      customAlert(AlertVariants.error, STATUS_CODES[ response.statusCode ].message);
      return;
    }

    customAlert(AlertVariants.success, t('passwordChanged'));

  };

  return (
    <div>
      <HTag level={4}>{t('changePassword')}</HTag>
      <ProfileChangeInfo
        handleSubmit={handleSubmit}
        typeInput='password'
        existingInput={existingPassword}
        setExistingInput={setExistingPassword}
        existingInputLabel={t('enterYourExistingPassword')}
        newInfoInput={newPassword}
        setNewInfoInput={setNewPassword}
        newInfoInputLabel={t('enterANewPassword')}
        confirmPasswordInput={confirmNewPassword}
        setConfirmPasswordInput={setConfirmNewPassword}
        confirmPasswordInputLabel={t('repeatNewPassword')}
        textButton={t('changeAPassword')}
      />
    </div>
  );
};
