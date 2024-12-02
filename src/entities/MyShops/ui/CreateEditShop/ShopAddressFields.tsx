import React, { ChangeEvent, FC } from 'react';
import { useTranslation } from 'next-i18next';
import { Input } from '@/shared/ui/Input/Input';
import { ShopAddress, ShopData, ShopDelivery } from '@/shared/lib/constants/constants';
import closeIcon from '@/icons/blackClose.svg';
import { RequiredMark } from '@/shared/ui/RequiredMark/RequiredMark';
import classes from './shopAddress.module.scss';
import shopClasses from './createShop.module.scss';


const COUNTRY_CODE_LENGTH = 4;
const PHONE_LENGTH = 13;

interface Props {
  addressItem: ShopAddress;
  addresses: ShopAddress[];
  index: number;
  setShopData: (key: keyof ShopData, value: string | File | ShopDelivery | ShopAddress[] | null) => void;
  error?: Record<keyof ShopAddress, string>;
  isPreview?: boolean;
}

export const ShopAddressFields: FC<Props> = ({ addressItem, addresses, index, setShopData, error, isPreview }) => {
  const { t } = useTranslation();

  const { address, link_2gis, main_number, secondary_number } = addressItem;

  const handleChangeShopAddress = (key: keyof ShopAddress, value: string) => {
    if (
      (key === 'main_number' || key === 'secondary_number') &&
      (value.length > PHONE_LENGTH || value.length < COUNTRY_CODE_LENGTH)
    ) return;

    setShopData('addresses', addresses.map((item, idx) => {
      if (idx === index) return { ...item, [ key ]: value };
      return item;
    }));
  };

  return (
    <div className={classes.address}>
      <div>
        <div>
          <Input
            label={<p className={isPreview ? shopClasses.caption : ''}>
              {t('address')}{!isPreview && <RequiredMark/>}
            </p>}
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeShopAddress('address', e.target.value)}
            isError={!!error?.address}
          />
          {!!error?.address && <p className={shopClasses.error}>{error?.address}</p>}
        </div>
        {isPreview && !link_2gis ? null : <div>
          <Input
            label={<p className={isPreview ? shopClasses.caption : ''}>{t('link2gis')}</p>}
            value={link_2gis}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeShopAddress('link_2gis', e.target.value)}
          />
        </div>}
      </div>
      <div>
        <div>
          <Input
            label={<p className={isPreview ? shopClasses.caption : ''}>
              {t('contacts')}{!isPreview && <RequiredMark/>}
            </p>}
            placeholder='+(996)'
            value={main_number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeShopAddress('main_number', e.target.value)}
            isError={!!error?.main_number}
          />
          {!!error?.main_number && <p className={shopClasses.error}>{error?.main_number}</p>}
        </div>
        {isPreview && secondary_number === '+996' ? null : <div>
          <Input
            label={<p className={isPreview ? shopClasses.caption : ''}>{t('contacts')}</p>}
            placeholder='+(996)'
            value={secondary_number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeShopAddress('secondary_number', e.target.value)}
          />
          {error?.secondary_number && <p className={shopClasses.error}>{error?.secondary_number}</p>}
        </div>}
      </div>
      {index > 0 && !isPreview && <div onClick={() => {
        setShopData('addresses', addresses.filter((_, idx) => idx !== index));
      }} className={classes.close}>
        <img alt='x' src={closeIcon.src}/>
      </div>}
    </div>
  );
};
