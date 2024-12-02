import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container } from '@/shared/ui/Container/Container';
import { selectStores } from '@/entities/Store/model/StoreSlice';
import classes from './storeDetails.module.scss';


const StoreDetails = () => {
  const { store } = useSelector(selectStores);
  const { t } = useTranslation();

  return (
    <Container>
      <div className={ classes.store }>
        <div className={ classes.store_details }>
          <div className={ classes.imageBox }>
            <img
              src={ store?.store_logo?.logo as string }
              alt="logo"
              className={ classes.img }
            />
          </div>
          <div className={ classes.description }>
            <div className={ classes.title }>
              {store?.title}
            </div>
            <div className={ classes.subTitle }>
              {store?.description}
            </div>
            <div className={ classes.info }>
              <p className={classes.info_text}>Доставка:</p><p className={classes.info_info}>
                {t(store?.delivery)}</p>
            </div>
          </div>
        </div>
        <ul className={ classes.store_contacts }>
          {
            store?.addresses?.map((address, index) => (
              <li className={classes.contact} key={store.id}>
                <div className={classes.info}>
                  <p className={classes.info_text}>{index === 0 ? 'Адрес:' : ''}</p>
                  <p className={classes.info_info}>{address?.address}</p>
                </div>
                <div className={classes.info}>
                  <p className={classes.info_text}>{index === 0 ? 'Контакты:' : ''}</p>
                  <p className={classes.info_info}>{address?.main_number}</p>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </Container>
  );
};

export default StoreDetails;
