import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ILocale, PATHS } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { getProfile, verifyResend, verifyUser } from '@/entities/Auth/model/authSlice';
import AuthLayout from '@/shared/ui/AuthLayout/AuthLayout';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Button } from '@/shared/ui/Button/Button';


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};
export default function VerifyUser () {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queries = router.query;
  const [ shouldResend, setShouldResend ] = useState(false);

  useEffect(() => {
    if (queries.email && queries.code) {
      dispatch(verifyUser({ email: queries.email as string, code: +queries.code })).then((response: any) => {
        if (response.error) {
          setShouldResend(true);
        } else {
          dispatch(getProfile());
          router.push(PATHS.home);
        }
      }).catch(() => {
        setShouldResend(true);
      });
    }
  }, [ queries.email, queries.code ]);

  const handleResendVerification = () => {
    if (queries.email) dispatch(verifyResend({ email: queries.email as string }));
  };

  return (
    <div>
      {shouldResend && (
        <AuthLayout isError={shouldResend}>
          <HTag level={4}>{t('confirmYourEmail')}</HTag>
          <p
            style={{ color: '#F41414', marginTop: '20px', fontSize: '18px', lineHeight: '120%' }}>
            {t('theLinkHasExpired')}
          </p>
          <Button
            onClick={handleResendVerification}
            style={{ width: '100%', marginTop: '20px' }}
          >{t('sendAgain')}</Button>
        </AuthLayout>
      )}
    </div>
  );
}
