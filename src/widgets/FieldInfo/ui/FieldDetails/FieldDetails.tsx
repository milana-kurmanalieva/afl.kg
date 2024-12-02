import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button/Button';
import { AddressField, BUTTON_VARIANTS, DATE_FORMAT_FIELD, FieldInfo } from '@/shared/lib/constants/constants';
import { getField, selectFieldAddress } from '@/entities/Field/model/FieldSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import phone from '@/shared/assets/icons/phone.svg';
import { Modal } from '@/shared/ui/Modal/Modal';
import classes from './fieldDetails.module.scss';


interface Props {
  fieldAddress: AddressField;
  selectedFieldId: number | null;
  setSelectedFieldId: Dispatch<SetStateAction<number | null>>
}


const FieldDetails: FC<Props> = ({ fieldAddress, selectedFieldId, setSelectedFieldId }) => {
  const dispatch = useAppDispatch();
  const { field } = useSelector(selectFieldAddress);
  const [ isOpen, setIsOpen ] = useState(false);

  const { t } = useTranslation();

  const [ showPhones, setShowPhones ] = useState(false);

  const formatDateField = format(new Date(), DATE_FORMAT_FIELD);

  const handleChangeField = (field: FieldInfo) => {
    if (field.id === selectedFieldId) return;
    setSelectedFieldId(field.id);
    dispatch(getField({ id: field.id, date: formatDateField }));
  };

  useEffect(() => {
    if (fieldAddress?.fields?.[ 0 ]?.id) setSelectedFieldId(fieldAddress?.fields?.[ 0 ]?.id);
  }, [ fieldAddress?.fields ]);

  return (
    <div className={ classes.fieldDetails }>
      <p className={ `${classes.title} ${classes.type}` }>{ t('fieldType') }:
        <span className={ classes.info }> { t(`${field.field_type}`)} </span></p>
      <p className={ `${classes.title} ${classes.numberFields}` }>{t('numberOfFields')}:
        <span className={ classes.info }> {fieldAddress?.fields_count} </span></p>
      <div className={classes.fields}>
        {fieldAddress?.fields?.map((field) => (
          <Button
            key={field.id}
            variant={field.id === selectedFieldId ? BUTTON_VARIANTS.PRIMARY : BUTTON_VARIANTS.OUTLINED}
            onClick={() => handleChangeField(field)}
            className={classes.btnField}
          >
            {field.name}
          </Button>
        ))
        }
      </div>
      <p className={ `${classes.title} ${classes.address}` }>{ t('address') }:
        <Link href={fieldAddress?.address_link} target="_blank" rel="noreferrer">
          <span className={ classes.info }> {fieldAddress.address} </span>
        </Link>
      </p>
      <p className={ `${classes.title} ${classes.price}` }>{ t('payment') }: </p>
      <ul className={classes.prices}>
        {
          field?.time_payments?.slice()?.reverse()?.map((price) => (
            <li key={price.id} className={classes.priceInfo}>
              <p className={classes.hour}>{price.from_time} - {price.till_time}</p>
              <p className={classes.price}>{price.price} сом</p>
            </li>
          ))
        }
      </ul>
      <div className={classes.mobileBlock}>
        <Button className={classes.btnMobile} onClick={() => setIsOpen(!isOpen)}>{t('call')}</Button>
      </div>
      <div className={classes.desktopBlock}>
        <Button className={classes.btnDesktop} onClick={() => setShowPhones(!showPhones)}>{t('call')}</Button>
        {showPhones && <ul className={classes.showPhones}>
          {
            field?.field_contacts?.map(contact => (
              <li key={contact?.id}>
                <p>
                  <Image src={phone} alt="phone" className={classes.phone}/>
                  <a href={`tel:${contact?.number}`}>{contact?.number}</a>
                </p>
              </li>
            ))
          }
        </ul>}
      </div>
      <Modal
        className={classes.modal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        centered={false}
      >
        <ul className={classes.showPhones}>
          {
            field?.field_contacts?.map(contact => (
              <li key={contact?.id}>
                <p>
                  <Image src={phone} alt="phone" className={classes.phone}/>
                  <a href={`tel:${contact?.number}`}>{contact?.number}</a>
                </p>
              </li>
            ))
          }
        </ul>
      </Modal>
    </div>
  );
};

export default FieldDetails;
