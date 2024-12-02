import { NextPage } from 'next';
import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Input } from '@/shared/ui/Input/Input';
import {
  PATHS, ErrorTexWithCode,
  BUTTON_VARIANTS, AlertVariants, STATUS_CODES,
} from '@/shared/lib/constants/constants';
import { Button } from '@/shared/ui/Button/Button';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { SignUpCredentials, signUp } from '@/entities/Auth/model/authSlice';
import googleIcon from '@/icons/google.svg';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import generalClasses from './auth.module.scss';


const SignUp: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ isBusinessMan, setIsBusinessMan ] = useState<boolean | null>(null);
  const [ hasSent, setHasSent ] = useState(false);
  const [ error, setError ] = useState<ErrorTexWithCode | null | string>(null);
  const [ isContinueButtonDisabled, setIsContinueButtonDisabled ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ hasProfileTypeChoosen, setHasProfileTypeChoosen ] = useState(false);
  const [ showPhoneNumberModal, setShowPhoneNumberModal ] = useState(false);
  const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);
  const [ showUserAuth, setShowUserAuth ] = useState(false);
  const [ phoneNumberError, setPhoneNumberError ] = useState<string | null>(null);
  const [ phoneNumber, setPhoneNumber ] = useState('+996');
  const [ hasRedirectedToMain, setHasRedirectedToMain ] = useState(false);

  const isUsernameValid = (username: string) => {
    const usernameRegex = /[a-zA-Z]/;
    return usernameRegex.test(username);
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMain = () => {
    if (!hasRedirectedToMain) {
      setHasRedirectedToMain(true);
      router.push(PATHS.home);
    }
  };

  const handleSubmitGoogle = () => {
    router.push(PATHS.loginWithGoogle);
  };


  const continueSignup = async () => {
    setIsLoading(true);


    const hasLetters = /[a-zA-Z]/.test(password);
    const hasDigits = /\d/.test(password);

    if (!hasLetters || !hasDigits) {
      customAlert(AlertVariants.error, 'Пароль должен содержать как минимум одну букву и одну цифру');
      setIsLoading(false);
      return;
    }

    if (isBusinessMan) {
      const cleanedPhoneNumber = phoneNumber.replace(/[^+\d]/g, '');
      const formattedPhoneNumber = cleanedPhoneNumber.startsWith('+') ?
        cleanedPhoneNumber.slice(1) : cleanedPhoneNumber;

      if (!/^\+996\d{9}$/.test(cleanedPhoneNumber)) {
        setPhoneNumberError('Номер должен начинаться с +996 и содержать 12 цифр');
        setIsLoading(false);
        return;
      }

      const formData: SignUpCredentials = {
        email,
        password,
        confirm_password: confirmPassword,
        username,
        confirm_is_business_owner: isBusinessMan,
        phone: formattedPhoneNumber,
      };

      try {
        const payload = await dispatch(signUp(formData)).unwrap();
        if (payload.response.data.message === 'user_already_exist') {
          customAlert(AlertVariants.error, 'Пользователь с такой почтой уже существует');
          return;
        }
        if (payload.response.data.message === 'username_already_exist') {
          customAlert(AlertVariants.error, 'Пользователь с такой почтой уже существует');
          return;
        }
        if (STATUS_CODES[ payload.code ]) {
          customAlert(AlertVariants.error, STATUS_CODES[ payload.code ].message);
          return;
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      setShowUserAuth(false);
      setShowConfirmationModal(true);
      setHasSent(true);
    } else {
      const formData: SignUpCredentials = {
        email,
        password,
        confirm_password: confirmPassword,
        username,
        confirm_is_business_owner: isBusinessMan,
      };
      try {
        const payload = await dispatch(signUp(formData)).unwrap();
        if (payload.response.data.message === 'user_already_exist') {
          customAlert(AlertVariants.error, 'Пользователь с такой почтой уже существует');
          return;
        }
        if (payload.response.data.message === 'username_already_exist') {
          customAlert(AlertVariants.error, 'Пользователь с такой почтой уже существует');
          return;
        }
        if (STATUS_CODES[ payload.code ]) {
          customAlert(AlertVariants.error, STATUS_CODES[ payload.code ].message);
          return;
        }

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      setHasSent(true);
      setShowConfirmationModal(true);
      setShowUserAuth(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(email) || !isUsernameValid(username) || !password || !confirmPassword) {
      customAlert(AlertVariants.error, t('fillAllPasswordFields'));
      return;
    }

    if (!isEmailValid(email)) {
      customAlert(AlertVariants.error, 'Введите почту правильно');
      return;
    }

    if (!isUsernameValid(username)) {
      customAlert(AlertVariants.error, 'Логин должен содержать буквы');
      return;
    }

    if (password !== confirmPassword || password.length < 7) {
      customAlert(AlertVariants.error, t('passwordMustBeMore'));
      return;
    }

    setHasSent(true);
    setHasProfileTypeChoosen(true);
    continueSignup();
  };

  const handleContinue = async () => {
    if (isBusinessMan === null) {
      customAlert(AlertVariants.error, 'Выберите тип профиля');
      return;
    }
    if (isBusinessMan) {
      setShowPhoneNumberModal(true);
      setHasSent(true);
    } else {
      setHasProfileTypeChoosen(true);
      setShowPhoneNumberModal(false);
      setHasSent(true);
    }
  };


  const handleClick = () => {
    const cleanedPhoneNumber = phoneNumber.replace(/[^+\d]/g, '');

    if (!/^\+996\d{9}$/.test(cleanedPhoneNumber) || cleanedPhoneNumber.length === 4) {
      setPhoneNumberError('Номер должен начинаться с +996 и содержать 12 цифр');
      setIsContinueButtonDisabled(true);
      return;
    } else {
      setShowPhoneNumberModal(false);
      setShowConfirmationModal(false);
      setHasSent(true);
    }
  };


  useEffect(() => {
    setError(null);
  }, [
    password,
    email,
    confirmPassword,
  ]);


  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPhoneNumber = e.target.value;
    const newPhoneNumber = inputPhoneNumber.replace(/[^+\d]/g, '');

    if (!/^\+996\d{0,9}$/.test(newPhoneNumber) || newPhoneNumber.length === 3) {
      setPhoneNumberError('Номер должен начинаться с +996 и содержать 12 цифр');
      setIsContinueButtonDisabled(true);
    } else {
      setPhoneNumberError(null);
      setPhoneNumber(newPhoneNumber);
      setIsContinueButtonDisabled(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className={generalClasses.form} action="">
        <>
          {hasSent ? (
            <>
              <div className={generalClasses.inputs}>
                {showPhoneNumberModal ? (
                  <div>
                    <p className={generalClasses.businesPhoneTitle}>Укажите контактные данные</p>
                    <Input
                      type='text'
                      value={phoneNumber}
                      placeholder='+996'
                      onChange={handlePhoneNumberChange}
                      maxLength={13}
                    />
                    {!!phoneNumberError && <p className={generalClasses.error}>{phoneNumberError}</p>}
                    <button
                      className={generalClasses.contactButton}
                      onClick={handleClick}
                      disabled={isContinueButtonDisabled}
                    >
                      {t('continue')}
                    </button>
                  </div>
                ) : (
                  <div>
                    {showConfirmationModal ? (
                      !showUserAuth ? (
                        <div className={generalClasses.requestBlock}>
                          <div className={generalClasses.requestBlockDesc}>
                            <p>Ваш запрос на подтверждение бизнес-аккаунта находится на рассмотрении администратора.</p>
                          </div>
                          <button
                            className={generalClasses.mainButton}
                            onClick={handleMain}
                            disabled={hasRedirectedToMain}
                          >
                            На главную
                          </button>
                        </div>
                      ) : (
                        <div>
                          <HTag level={4}>{t('confirmYourEmail')}</HTag>
                          <p className={generalClasses.caption}>
                            {t('emailSentMessage')}
                          </p>
                        </div>
                      )
                    ) : (
                      <>
                        <div>
                          <Input
                            label={t('mail')}
                            type='email'
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <Input
                            label={t('login')}
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
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
                        </div>
                        <div>
                          <Input
                            label={t('repeatPassword')}
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <HTag level={4} myClass={generalClasses.hasSentTitle}>{t('chooseWhoAreYou')}</HTag>
              <div className={generalClasses.chooseModal}>
                <div className={generalClasses.chooseBlocks}>
                  <div className={generalClasses.chooseWhoBlock}>
                    <div
                      onClick={() => setIsBusinessMan(false)}
                      className={`${generalClasses.chooseWho} 
                          ${isBusinessMan === false ? generalClasses.selectedChooseWho : generalClasses.chooseWho}`}
                    >
                      <p className={generalClasses.multilineText}>{t('user')}</p>
                      <input
                        className={generalClasses.checkBoxChoose}
                        type='checkbox'
                        checked={isBusinessMan === false}
                        readOnly
                      />
                    </div>
                    <ul>
                      <li>{t('viewContent')}</li>
                      <li>{t('subscribeForum')}</li>
                    </ul>
                  </div>
                  <div className={generalClasses.chooseWhoBlock}>
                    <div
                      onClick={() => setIsBusinessMan(true)}
                      className={`${generalClasses.chooseWho} 
                          ${isBusinessMan === true ? generalClasses.selectedChooseWho : generalClasses.chooseWho}`}
                    >
                      <div className={generalClasses.multilineText}>
                        <p>{t('business')}</p>
                        <p>{t('owner')}</p>
                      </div>
                      <input
                        className={generalClasses.checkBoxChoose}
                        type='checkbox'
                        checked={isBusinessMan === true}
                        readOnly
                      />
                    </div>
                    <ul>
                      <li>{t('possibilityAddField')}</li>
                      <li>{t('possibilityAddSportswear')}</li>
                    </ul>
                  </div>
                </div>
                <button
                  className={generalClasses.chooseButton}
                  onClick={handleContinue}
                >
                  {t('continue')}
                </button>
              </div>
            </>
          )}

          {!!error && <p className={generalClasses.error}>
            {(error as ErrorTexWithCode)?.text?.description ?? error}
          </p>}

          {!showConfirmationModal && !showUserAuth && !showPhoneNumberModal &&
            <div className={generalClasses.bottom}>
              {hasSent && !showPhoneNumberModal && (
                <Button disabled={isLoading}>Зарегистрироваться</Button>
              )}
              <Button
                disabled={isLoading}
                onClick={handleSubmitGoogle}
                type='button'
                className={generalClasses.googleBtn}
                variant={BUTTON_VARIANTS.OUTLINED}
              >
                <img src={googleIcon.src} alt="google" />
                <p>{t('signInWithGoogle')}</p>
              </Button>
              <p>{t('doYouHaveAnAccount')} <Link href={PATHS.signIn}>{t('toComeIn')}</Link></p>
            </div>
          }
        </>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
