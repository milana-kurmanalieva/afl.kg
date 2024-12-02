import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FIELD_TYPES, FilterSelectOption } from '@/shared/lib/constants/constants';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Input } from '@/shared/ui/Input/Input';
import { getAreas, selectMyFields } from '@/entities/Profile/model/myFieldsSlice';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getAddressesWithFilters } from '@/entities/Field/model/FieldSlice';
import { Filter } from '@/shared/ui/Filter/Filter';
import classes from './catalogFilter.module.scss';


interface ISelectOption {
  label: string;
  labelIcon?: string;
  id?: string | number;
  options: FilterSelectOption[];
  isInitialOpen?: boolean;
}

interface Props {
  onToggle?: () => void;
}

const CatalogFilter: FC<Props> = ({ onToggle }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const inputArrowRef = useRef<HTMLInputElement>(null);

  const { areas } = useAppSelector(selectMyFields);

  const selectTypeFieldsOptions: ISelectOption = {
    label: t('fieldType'),
    options: [
      {
        titleFilter: FIELD_TYPES.COVERED,
        title: t(FIELD_TYPES.COVERED),
        id: 1,
      },
      {
        titleFilter: FIELD_TYPES.UNCOVERED,
        title: t(FIELD_TYPES.UNCOVERED),
        id: 2,
      },
      {
        titleFilter: FIELD_TYPES.HALL,
        title: t(FIELD_TYPES.HALL),
        id: 3,
      },
    ],
  };

  const [ area, setArea ] = useState<FilterSelectOption | null>(null);
  const [ fieldType, setFieldType ] = useState<FilterSelectOption | null>(null);
  const [ fieldsInput, setFieldsInput ] = useState({
    numberFields: '',
    priceFrom: '',
    priceUp: '',
  });

  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFieldsInput({ ...fieldsInput, [ name ]: value });
  };

  useEffect(() => {
    dispatch(getAreas());
  }, [ area, dispatch ]);

  const handleFilter = () => {
    dispatch(getAddressesWithFilters({
      field_type: (fieldType?.titleFilter || '') as FIELD_TYPES,
      area: area?.title ?? '',
      fields_count: +fieldsInput.numberFields || '',
      price_from: +fieldsInput.priceFrom || '',
      price_to: +fieldsInput.priceUp || '',
    }));
    if (onToggle) onToggle();
  };

  const handleClearFilter = () => {
    dispatch(getAddressesWithFilters());
    setArea(null);
    setFieldType(null);
    setFieldsInput({
      numberFields: '',
      priceFrom: '',
      priceUp: '',
    });
    if (onToggle) onToggle();
  };

  useEffect(() => {
    const input = inputArrowRef.current;

    if (input) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          if (event.key === 'ArrowUp') {
            input.stepUp();
          } else if (event.key === 'ArrowDown') {
            input.stepDown();
          }
        }
      };

      const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        target.value = target.value.replace(/[^0-9]/g, '');
      };

      const handleFocus = (event: FocusEvent) => {
        const target = event.target as HTMLInputElement;
        target.blur();
      };

      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('input', handleInput);
      input.addEventListener('focus', handleFocus);

      return () => {
        input.removeEventListener('keydown', handleKeyDown);
        input.removeEventListener('input', handleInput);
        input.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  return (
    <Filter handleFilter={handleFilter} handleClearFilter={handleClearFilter}>
      <div className={classes.filter_box}>
        <div className={classes.title}>
          {t('area')}
        </div>
        <FIlterSelect
          secondary
          changeOption={(newArea) => setArea(newArea)}
          options={areas}
          label={area?.title ?? t('selectArea')}
          isCatalogFilter={true}
        />
      </div>
      <div className={classes.filter_box}>
        <div className={classes.title}>
          {t('fieldType')}
        </div>
        <FIlterSelect
          secondary
          options={selectTypeFieldsOptions.options}
          changeOption={(newFieldType) => setFieldType(newFieldType)}
          label={fieldType?.title ?? t('selectFieldType')}
          isCatalogFilter={true}
        />
      </div>
      <div className={classes.filter_box}>
        <Input
          ref={inputArrowRef}
          name='numberFields'
          label={<p className={classes.title}>{t('numberFields')}</p>}
          value={fieldsInput.numberFields}
          type="number"
          onlyArrow={true}
          placeholder={t('selectQuantity') as string}
          containerClassName={classes.inputFilter}
          min="0"
          defaultValue="0"
          onChange={changeInput}
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
  );
};

export default CatalogFilter;
