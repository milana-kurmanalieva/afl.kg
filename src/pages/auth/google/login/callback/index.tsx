import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ILocale, PATHS } from '@/shared/lib/constants/constants';
import IsGoogleAuthModal from '@/shared/ui/IsGoogleAuthModal/IsGoogleAuthModal';
import { changeProfile, getProfile, selectAuth } from '@/entities/Auth/model/authSlice';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';


export const getStaticProps = async ({ locale }: ILocale) => {
  return { props: { ...(await serverSideTranslations(locale, [ 'common' ])), locale } };
};

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const [ showModal, setShowModal ] = useState(false);

  const handleSelect = (isOwner: boolean, phoneNumber?: string) => {
    dispatch(getProfile())
      .then((user: any) => {
        const dataUser = user.payload;
        dispatch(
          changeProfile({
            username: dataUser.username,
            avatar: dataUser.avatar,
            full_name: dataUser.full_name,
            confirm_is_business_owner: isOwner,
            phone: isOwner ? phoneNumber?.replaceAll('+', '') : '',
          }),
        ).then(() => router.push(PATHS.home));
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  };

  const handleRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'success') {
      dispatch(getProfile());
      router.push(PATHS.home);
    }
  };

  useEffect(() => {

    const hasLoggedInWithGoogle = localStorage.getItem('hasLoggedInWithGoogle');
    if (!user?.phone?.length && !hasLoggedInWithGoogle) {
      setShowModal(true);
    }

    if (hasLoggedInWithGoogle) {
      handleRedirect();
    }

  }, [ user ]);

  return (
    <>
      {showModal && <IsGoogleAuthModal onSelect={handleSelect} />}
    </>
  );
}
