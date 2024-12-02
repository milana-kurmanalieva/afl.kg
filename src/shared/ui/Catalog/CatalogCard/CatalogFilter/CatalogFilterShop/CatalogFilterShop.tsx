import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Input } from '@/shared/ui/Input/Input';
import { getAreas, selectMyFields } from '@/entities/Profile/model/myFieldsSlice';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getAddressesWithFilters } from '@/entities/Field/model/FieldSlice';
import { Filter } from '@/shared/ui/Filter/Filter';
import classes from './catalogFilterShop.module.scss';


interface Props {
  onToggle?: () => void;
}


const CatalogFilterShop: FC<Props> = ({ onToggle }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { areas } = useAppSelector(selectMyFields);

  const [ category, setCategory ] =
    useState<FilterSelectOption | null>(null);
  const [ subcategory, setSubcategory ] =
    useState<FilterSelectOption | null>(null);
  const [ fieldsInput, setFieldsInput ] =
    useState({
      priceFrom: '',
      priceUp: '',
    });

  useEffect(() => {
    dispatch(getAreas());
  }, [ category ]);

  const handleFilter = () => {
    dispatch(getAddressesWithFilters({
      // category: category?.title ?? '',
      price_from: +fieldsInput.priceFrom || '',
      price_to: +fieldsInput.priceUp || '',
    }));
    if (onToggle) onToggle();
  };

  const handleClearFilter = () => {
    dispatch(getAddressesWithFilters());
    setCategory(null);
    setSubcategory(null);
    setFieldsInput({
      priceFrom: '',
      priceUp: '',
    });
    if (onToggle) onToggle();
  };

  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFieldsInput({ ...fieldsInput, [ name ]: value });
  };

  return (
    <>
      <Filter handleFilter={handleFilter} handleClearFilter={handleClearFilter}>
        <div className={classes.filter_box}>
          <div className={classes.title}>
            {t('category')}
          </div>
          <FIlterSelect
            secondary
            changeOption={(newArea) => setCategory(newArea)}
            options={areas}
            label={category?.title ?? t('selectACategory')}
            isCatalogFilter={true}
          />
        </div>
        <div className={classes.filter_box}>
          <div className={classes.title}>
            {t('subcategory')}
          </div>
          <FIlterSelect
            secondary
            options={areas}
            changeOption={(newFieldType) => setSubcategory(newFieldType)}
            label={subcategory?.title ?? t('selectASubcategory')}
            isCatalogFilter={true}
          />
        </div>
        <div className={classes.filter_box}>
          <Input
            name='priceFrom'
            label={<p className={classes.title}>{t('price')}</p>}
            value={fieldsInput.priceFrom}
            type="number"
            placeholder={t('from') as string}
            containerClassName={classes.inputFilter}
            onChange={changeInput}
          />
        </div>
        <div className={classes.filter_box}>
          <Input
            name='priceUp'
            value={fieldsInput.priceUp}
            type="number"
            placeholder={t('before') as string}
            containerClassName={classes.inputFilter}
            onChange={changeInput}
          />
        </div>
      </Filter>
    </>
  );
};

export default CatalogFilterShop;
