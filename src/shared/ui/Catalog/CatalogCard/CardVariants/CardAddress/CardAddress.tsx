import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/shared/ui/Button/Button';
import { TimePaymentsItem } from '@/entities/Field/type/fieldSchema';
import { AddressField, PATHS } from '@/shared/lib/constants/constants';
import classes from './cardAddress.module.scss';


type CardProps = {
  field: AddressField;
}


const CardAddress: FC<CardProps> = ({ field }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigate = () => {
    router.push(`${PATHS.catalog}/${field.id}`);
  };
  const description = {
    fieldName: t('footballField'),
    address: t('address'),
    price: t('payment'),
  };


  const findFirstPhoto = (data: AddressField) => {
    let firstPhoto = null;

    const fieldWithPhotos = data.fields?.find((field) => field.field_photos && field.field_photos.length > 0);
    if (fieldWithPhotos) {
      firstPhoto = fieldWithPhotos.field_photos[ 0 ].photo;
    }
    return firstPhoto;
  };

  const firstPhoto = findFirstPhoto(field);

  const findMinMaxPriceFromAddress = (address: AddressField) => {
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    address.fields?.forEach((field) => {
      field.time_payments?.forEach((payment:TimePaymentsItem) => {
        if (minPrice === null) minPrice = payment.price;
        else minPrice = Math.min(minPrice, payment.price);
        maxPrice = Math.max(maxPrice as number, payment.price);
      });
    });

    if (minPrice === null && maxPrice === null) return null;
    if (minPrice === null && maxPrice !== null) return maxPrice as number;
    if (maxPrice === null && minPrice !== null) return minPrice as number;
    if (minPrice === maxPrice) return minPrice;
    return { minPrice, maxPrice };
  };


  const price: any = findMinMaxPriceFromAddress(field);

  return (
    <div className={classes.catalog_card}
      onClick={navigate}
    >
      <div className={classes.imageBox}>
        {firstPhoto && <img
          src={firstPhoto}
          alt={'catalog image'}/>}
      </div>
      <div className={classes.infoDescription}>
        <div className={classes.infoDescription_location}>
          <p>
            <span className={classes.infoDescription_location_name}> «{field?.name}»</span>
          </p>
          <p>{description.address}:
            <span className={classes.infoDescription_location_address}>  {field?.address}</span>
          </p>
        </div>
        <div className={classes.infoDescription_box}>
          <p>
            <span className={classes.infoDescription_box_price}>
              {typeof price === 'object' && price !== null ? `${price.minPrice} - ${price.maxPrice}` : price} KGS
            </span>
            <span className={classes.infoDescription_box_hour}> ({t('hour')})</span>
          </p>
          <Button
            type="button"
            onClick={navigate}
            className={classes.btnMore}
          >
            {t('moreDetails')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardAddress;
