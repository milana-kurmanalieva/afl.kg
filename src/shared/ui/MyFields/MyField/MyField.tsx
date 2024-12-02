import React, { FC, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { AddressField, BUTTON_VARIANTS, FieldInfo } from '@/shared/lib/constants/constants';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { truncateText } from '@/shared/lib/helpers/helpers';
import { Button } from '../../Button/Button';
import { Accordion } from '../../Accordion/Accordion';
import classes from './myField.module.scss';


interface Props {
  address: AddressField;
  idx: number;
  onEdit?: (address: AddressField, item: FieldInfo) => void;
  onBook?: (address: AddressField, item: FieldInfo) => void;
  deleteButton?: boolean;
  onAddressDelete?: (item: AddressField) => void;
}

const LIMIT_TEXT_LENGTH = 20;

export const MyField: FC<Props> = ({
  address,
  idx,
  onEdit,
  onBook,
  deleteButton,
  onAddressDelete,
}) => {
  const isMobile = useIsMobile();
  const deleteAddressBtnRef = useRef<HTMLButtonElement | null>(null);
  const { t } = useTranslation();

  return (
    <li className={classes.address}>
      <Accordion
        buttonsRefs={[ deleteAddressBtnRef ]}
        rightTitle={deleteButton && (
          <Button
            ref={deleteAddressBtnRef}
            variant={BUTTON_VARIANTS.DELETE}
            onClick={() => onAddressDelete && onAddressDelete(address)}
          >{t('delete')}</Button>
        )}
        title={
          <div className={classes.title}>
            <div className={classes.addressTitle}>
              <p className={classes.number}>{idx + 1}</p>
              <div className={classes.addressInfo}>
                <p className={classes.name}>
                  {isMobile ? truncateText(address.name, LIMIT_TEXT_LENGTH) : address.name}
                </p>
                <p className={classes.addressName}>
                  {address.address_link ? (
                    <a href={address.address_link} target='_blank'>
                      {isMobile ? truncateText(address.address, LIMIT_TEXT_LENGTH) : address.address}
                    </a>
                  ) : isMobile ? truncateText(address.address, LIMIT_TEXT_LENGTH) : address.address}
                </p>
              </div>
            </div>
          </div>}>
        {address.fields.length && <ul className={classes.fields}>
          {address.fields.map((item) => (
            <li key={item.id} className={classes.fieldInfo}>
              <div className={classes.fieldTitle}>
                <p className={classes.addressName}>
                  {isMobile ? truncateText(item.name, LIMIT_TEXT_LENGTH) : item.name}
                </p>
              </div>
              <div className={classes.buttons}>
                {item.is_active ? (
                  <>
                    <Button
                      variant={BUTTON_VARIANTS.OUTLINED}
                      onClick={() => onEdit && onEdit(address, item)}
                    > Изменить</Button>
                    <Button
                      className={classes.changeButton}
                      onClick={() => onBook && onBook(address, item)}
                    >Забронировать</Button>
                  </>
                ) : <p> На рассмотрении</p>}
              </div>
            </li>))}
        </ul>}
      </Accordion>
    </li>
  );
};
