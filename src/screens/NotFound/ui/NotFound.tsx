import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import NotFoundImg from '@/shared/assets/images/404.svg';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Button } from '@/shared/ui/Button/Button';
import { Meta } from '@/shared/ui/seo/Meta';

import { PATHS } from '@/shared/lib/constants/constants';
import classes from './NotFound.module.scss';


const NotFound = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const buttonProps = {
    width: 'fit-content',
    padding: '12px 24px',
    onClick: () => router.push(PATHS.home),
  };
  return (
    <div className={classes.main}>
      <Meta title={t('notFoundTitle')} description={`${t('notFoundDescription')}`}>
      </Meta>
      <Image
        src={NotFoundImg}
        width={555}
        height={211}
        alt='not found'
      />
      <div className={classes.content}>
        <HTag level={3}>{t('notFoundTitle')}</HTag>
        <p>
          {t('notFoundDescription')}
        </p>
        <p>{t('notFoundSubTitle2')}</p>
        <Button {...buttonProps} >{t('notFoundBackHome')}</Button>
      </div>
    </div>
  );
};

export default NotFound;
