import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { AddressField, FieldInfo } from '@/shared/lib/constants/constants';
import { MyField } from '../MyField/MyField';
import classes from './myFields.module.scss';


interface MyFieldsListProps {
  list: AddressField[];
  onEdit?: (address: AddressField, item: FieldInfo) => void;
  onBook?: (address: AddressField, item: FieldInfo) => void;
  deleteButton?: boolean;
  onAddressDelete?: (item: AddressField) => void;
}

export const MyFieldsList: FC<MyFieldsListProps> = ({
  list,
  onEdit,
  onBook,
  deleteButton,
  onAddressDelete,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ul className={classes.fieldsHeader}>
        <li>№</li>
        <li>{t('name')}</li>
        <li>{t('address')}</li>
      </ul>
      <ul className={classes.fieldsBody}>
        {list.map((item, idx) => (
          <MyField
            key={item.id}
            address={item}
            idx={idx}
            onEdit={onEdit}
            onBook={onBook}
            deleteButton={deleteButton}
            onAddressDelete={onAddressDelete}
          />
        ))}
      </ul>
    </>
  );
};
