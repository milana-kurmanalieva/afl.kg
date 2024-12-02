import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HTag } from '@/shared/ui/HTag/HTag';
import { Button } from '@/shared/ui/Button/Button';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  deleteAddressField,
  getMyAddresses, selectMyFields,
} from '@/entities/Profile/model/myFieldsSlice';
import { MyFieldsList } from '@/shared/ui/MyFields/MyFieldsList/MyFieldsList';
import { AddressField, FieldInfo, PATHS } from '@/shared/lib/constants/constants';
import { Modal } from '@/shared/ui/Modal/Modal';
import profileClasses from '../profile.module.scss';
import classes from './fields.module.scss';


export const MyFields = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { myAddresses } = useAppSelector(selectMyFields);

  const [ deleteId, setDeleteInfo ] = useState<false | number>(false);

  useEffect(() => {
    if (!myAddresses.results.length) dispatch(getMyAddresses());
  }, []);

  const handleNavigateWithAddressAndField = (path: string, item: AddressField, field: FieldInfo) => {
    router.push(`${path}&address_id=${item.id}&field_id=${field.id}`);
  };


  const handleDelete = async (deleteId: number) => {
    await dispatch(deleteAddressField({ addressId: deleteId }));
    setDeleteInfo(false);
  };

  return (
    <div>
      <HTag level={4}>{t('listOfFields')}</HTag>
      <p className={profileClasses.caption}>
        {myAddresses.results.length ? t('changeFieldData') : t('createFieldData')}</p>
      {!!myAddresses.results.length &&
      <MyFieldsList
        onEdit={(address, field) => handleNavigateWithAddressAndField(PATHS.profileEditFields, address, field)}
        onBook={(address, field) => handleNavigateWithAddressAndField(PATHS.profileBookFields, address, field)}
        list={myAddresses.results}
        deleteButton
        onAddressDelete={(address: AddressField) => setDeleteInfo(address.id)}
      />}
      <Modal
        title={t('areYouSureDelete') as string}
        submitButton={t('delete')}
        onSubmit={() => deleteId && handleDelete(deleteId)}
        cancelButton
        isOpen={!!deleteId}
        setIsOpen={setDeleteInfo as Dispatch<SetStateAction<boolean>>}
      />
      <Button
        className={classes.createBtn}
        onClick={() => router.push(PATHS.profileCreateFields)}
      >{myAddresses.results.length ? t('addAField') : t('createField')}</Button>
    </div>
  );
};
