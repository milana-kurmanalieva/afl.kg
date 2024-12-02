import { useTranslation } from 'next-i18next';
import Loader from '@/shared/ui/loader/Loader';
import classes from './Loader.module.scss';


const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.main}>
      <Loader/>
      <h3>
        {t('loading')}...
      </h3>
    </div>
  );
};

export default Loading;
