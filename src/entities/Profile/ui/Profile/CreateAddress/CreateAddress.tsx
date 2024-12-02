import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddButton } from '@/shared/ui/AddButton/AddButton';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Input } from '@/shared/ui/Input/Input';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { createAddressField, getAreas, selectMyFields } from '@/entities/Profile/model/myFieldsSlice';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import classes from './createAddress.module.scss';


interface Props {
  onCreate: (newAddress: FilterSelectOption) => void;
}

export const CreateAddress:FC<Props> = ({ onCreate }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();


  const { areas } = useAppSelector(selectMyFields);

  const [ isOpen, setIsOpen ] = useState(false);
  const [ name, setName ] = useState('');
  const [ selectedArea, setSelectedArea ] = useState<FilterSelectOption | null>(areas[ 0 ] ?? null);
  const [ address, setAddress ] = useState('');
  const [ addressLink, setAddressLink ] = useState('');

  const handleSubmit = async () => {
    if (!selectedArea?.id || !address || !addressLink || !name) {
      alert(t('fillAllPasswordFields'));
      return;
    }
    const { payload } = await dispatch(createAddressField(
      { area: selectedArea.id, address, address_link: addressLink, name }),
    );

    onCreate({ id: payload.id, title: payload.address });

    setAddress('');
    setName('');
    setAddressLink('');
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getAreas());
  }, []);

  useEffect(() => {
    if (areas.length) setSelectedArea(areas[ 0 ]);
  }, [ areas ]);

  return (
    <div>
      <AddButton
        onClick={() => setIsOpen(true)}
      >{t('addFieldAddress')}</AddButton>

      <Modal
        title={t('createAddress') as string}
        className={classes.modal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cancelButton
        submitButton={t('save')}
        onSubmit={handleSubmit}
      >
        <div className={classes.input}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={t('locationName')}
            placeholder={t('enterLocation') as string}
          />
        </div>
        <div className={classes.input}>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label={t('fieldAddress')}
            placeholder={t('enterAddress') as string}
          />
        </div>
        <div className={classes.input}>
          <p>{t('area')}</p>
          <FIlterSelect
            className={classes.select}
            options={areas}
            label={selectedArea?.title ?? areas[ 0 ]?.title ?? ''}
            secondary
            changeOption={(newArea) => setSelectedArea(newArea)}
          />
        </div>
        <div className={classes.input}>
          <Input
            value={addressLink}
            onChange={(e) => setAddressLink(e.target.value)}
            label={t('linkTo2Gis')}
            placeholder={t('enterLink') as string}
          />
        </div>
      </Modal>
    </div>
  );
};
