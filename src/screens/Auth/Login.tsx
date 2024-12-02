import { NextPage } from 'next';
import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Input } from '@/shared/ui/Input/Input';
import { STATUS_CODES, PATHS, BUTTON_VARIANTS, SUBMIT_TIMEOUT } from '@/shared/lib/constants/constants';
import { Button } from '@/shared/ui/Button/Button';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { getProfile, login } from '@/entities/Auth/model/authSlice';
import googleIcon from '@/icons/google.svg';
import generalClasses from './auth.module.scss';


const Login: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState<{code: string, text: {message: string, description: string}} | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    setError(null);
  }, [ password, email ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = await dispatch(
      login({
        login: email,
        password,
      }),
    ).unwrap();

    setTimeout(() => {
      setIsLoading(false);
    }, SUBMIT_TIMEOUT);

    const error = STATUS_CODES[ payload?.response?.data?.statusCode ];

    if (error) {
      setError({ code: payload.response.data.statusCode, text: error });
      return;
    }

    dispatch(getProfile());
    router.push(PATHS.home);
  };

  const handleSubmitGoogle = () => {
    router.push(PATHS.loginWithGoogle);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className={generalClasses.form} action="">
        <HTag level={4}>{t('loginToAccount')}</HTag>
        <div className={generalClasses.inputs}>

          <div>
            <Input
              label={t('login')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              label={t('password')}
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {!!error && <p className={generalClasses.error}>{error.text.description}</p>}
            <Link className={generalClasses.passwordIssue} href={PATHS.passwordReset}>{t('forgot')}</Link>
          </div>
        </div>

        <div className={generalClasses.bottom}>
          <Button
            disabled={isLoading}
          >{t('toComeIn')}</Button>
          <Button
            disabled={isLoading}
            onClick={handleSubmitGoogle}
            type='button' className={generalClasses.googleBtn}
            variant={BUTTON_VARIANTS.OUTLINED}
          >
            <img src={googleIcon.src} alt="google" />
            <p>{t('signInWithGoogle')}</p>
          </Button>
          <p>{t('noAccount')}? <Link href={PATHS.signup}>Зарегистрируйтесь</Link></p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
