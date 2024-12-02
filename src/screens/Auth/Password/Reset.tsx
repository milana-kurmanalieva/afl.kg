import { NextPage } from 'next';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Input } from '@/shared/ui/Input/Input';
import { PATHS, STATUS_CODES, SUBMIT_TIMEOUT } from '@/shared/lib/constants/constants';
import { Button } from '@/shared/ui/Button/Button';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { passwordResetLink, resetPassword } from '@/entities/Auth/model/authSlice';
import generalClasses from '../auth.module.scss';


const Reset: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const [ email, setEmail ] = useState('');
  const [ error, setError ] = useState<{code: string, text: {message: string, description: string}} | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ hasSent, setHasSent ] = useState(false);

  const [ password, setPassword ] = useState({
    value: '',
    confirmValue: '',
  });

  const hasEmailAndCode = useMemo(() => {
    return !!(router.query.code && router.query.email);
  }, [ router.query ]);

  const getResetPasswordResponse = async () => {
    if (hasEmailAndCode) return dispatch(resetPassword({
      email: router.query.email as string,
      code: router.query.code as string,
      new_password: password.value,
      confirm_new_password: password.confirmValue,
    })).unwrap();
    return dispatch(passwordResetLink({ email })).unwrap();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = await getResetPasswordResponse();

    setTimeout(() => {
      setIsLoading(false);
    }, SUBMIT_TIMEOUT);

    const error = STATUS_CODES[ payload?.response?.data?.statusCode ];

    if (error) {
      setError({ code: payload.response.data.statusCode, text: error });
      return;
    }

    if (payload?.response?.data?.email?.[ 0 ]) {
      setError(payload?.response?.data?.email?.[ 0 ]);
      return;
    }

    setHasSent(true);
    if (hasEmailAndCode) router.push(PATHS.home);
  };


  useEffect(() => {
    setError(null);
  }, [ email ]);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className={generalClasses.form} action="">
        <HTag level={4}>{hasSent ? t('confirmYourEmail') : t('passwordRecovery')}</HTag>

        {!hasEmailAndCode && !hasSent && <>
          <div className={generalClasses.inputs}>

            <div>
              <Input
                label={t('mail')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {!!error && <p className={generalClasses.error}>{error?.text?.description ?? error}</p>}
            </div>
          </div>

          <div className={generalClasses.bottom}>
            <Button disabled={isLoading}>{t('restore')}</Button>
          </div>
        </>}

        {!hasEmailAndCode && hasSent && <>
          <p className={generalClasses.caption}>
            {t('weHaveSentYouAnEmail')}
          </p>
        </>}

        {hasEmailAndCode && <>
          <div className={generalClasses.inputs}>

            <div>
              <Input
                type='password'
                label={t('enterANewPassword')}
                value={password.value}
                onChange={(e) => {
                  setPassword(prev => ({ ...prev, value: e.target.value }));
                }}
              />
            </div>

            <div>
              <Input
                type='password'
                label={t('repeatNewPassword')}
                value={password.confirmValue}
                onChange={(e) => {
                  setPassword(prev => ({ ...prev, confirmValue: e.target.value }));
                }}
              />
              {!!error && <p className={generalClasses.error}>{error?.text?.description ?? error}</p>}
            </div>
          </div>

          <div className={generalClasses.bottom}>
            <Button disabled={isLoading}>{t('restore')}</Button>
          </div>
        </>}
      </form>
    </AuthLayout>
  );
};

export default Reset;
