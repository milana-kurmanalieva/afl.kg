import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { ProfileChanges, changeProfile, selectAuth } from '@/entities/Auth/model/authSlice';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import { AlertVariants } from '@/shared/lib/constants/constants';
import profileClasses from '../profile.module.scss';
import { EmailChange } from '../EmailChange/EmailChange';
import { PasswordChange } from '../PasswordChange/PasswordChange';
import classes from './setting.module.scss';


const kyrgyzCountryCode = '996';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { user } = useAppSelector(selectAuth);
  const [ fullName, setFullName ] = useState(user?.full_name ?? '');
  const [ phone, setPhone ] = useState(`+${user?.phone ?? kyrgyzCountryCode}`);
  const [ login, setLogin ] = useState(user?.username ?? '');

  const handleSetPhone = (value: string) => {
    if (value.length === 14) return;
    if (value.length === 3) return;
    setPhone(value);
  };

  const handleSubmitChanges = async (e: FormEvent) => {
    e.preventDefault();
    const payload: ProfileChanges = {
      avatar: null,
      username: login,
      full_name: fullName,
      phone: phone.slice(1),
    };

    if (!user?.is_business_owner) delete payload.phone;

    await dispatch(changeProfile(payload));
    customAlert(AlertVariants.success, t('changedSuccessfully'));
  };

  const handleSetLogin = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9-_]+$/;

    if (!usernameRegex.test(value)) {
      customAlert(AlertVariants.error, 'поле логин не может быть пустым, содержать кириллицу спецсимволы');
      return;
    }

    setLogin(value);
  };

  return (
    <div>
      <div className={classes.settings}>
        <div>
          <HTag level={4}>{t('profileSettings')}</HTag>
          <p className={profileClasses.caption}>{t('changeYourDetails')}</p>

          <form id='settings' onSubmit={handleSubmitChanges} className={classes.form}>
            <div>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label={t('fullName')}
                placeholder={t('enterFullName') as string}
              />
            </div>
            <div>
              <Input
                value={login}
                onChange={(e) => handleSetLogin(e.target.value)}
                label={t('login')}
                placeholder={t('enterLogin') as string}
              />
            </div>
            {user?.is_business_owner && <div>
              <Input
                value={phone}
                onChange={(e) => handleSetPhone(e.target.value)}
                label={t('contacts')}
                placeholder='+996'
              />
            </div>}
            <Button>{t('saveData')}</Button>
          </form>
        </div>
        <PasswordChange />
        <EmailChange />
      </div>
    </div>
  );
};
