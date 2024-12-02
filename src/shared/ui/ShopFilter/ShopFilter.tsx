import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import { Filter } from '@/shared/ui/Filter/Filter';
import { Input } from '@/shared/ui/Input/Input';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import FIlterSelect from '../FIlterSelect/FIlterSelect';
import classes from './ShopFilter.module.scss';


interface fieldsInput {
  priceFrom: string
  priceUp: string
}

interface ShopFilterProps {
  areas: any[];
  setFieldsInput: (value: fieldsInput) => void
  fieldsInput: fieldsInput
  category: FilterSelectOption | null
  subCategory: FilterSelectOption | null
  setCategory: Dispatch<SetStateAction<FilterSelectOption | null>>
  setSubCategory: Dispatch<SetStateAction<FilterSelectOption | null>>
  handleFilter: () => void
  handleClearFilter: () => void
}


const ShopFilter: FC<ShopFilterProps> = (props) => {
  const {
    areas,
    setFieldsInput,
    fieldsInput,
    category,
    subCategory,
    setCategory,
    setSubCategory,
    handleFilter,
    handleClearFilter,
  } = props;
  const { t } = useTranslation();

  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFieldsInput({ ...fieldsInput, [ name ]: value });
  };


  return (
    <aside className={classes.aside}>
      <Filter
        handleFilter={handleFilter}
        handleClearFilter={handleClearFilter}
      >
        <div className={classes.filterBlock}>
          <p className={classes.title}>
            {t('category')}
          </p>
          <FIlterSelect
            secondary
            changeOption={(newArea) => setCategory(newArea)}
            label={category?.title ?? t('selectACategory')}
            options={areas}
          />
        </div>
        {
          category?.children && category.children.length !== 0 &&
          <div className={classes.filterBlock}>
            <p className={classes.title}>
              {t('subcategory')}
            </p>
            <FIlterSelect
              secondary
              changeOption={(newArea) => setSubCategory(newArea)}
              label={subCategory?.title ?? t('selectASubcategory')}
              options={category?.children ?? []}
            />
          </div>
        }
        <div className={classes.filterBlock}>
          <Input
            name='priceFrom'
            label={<p className={classes.title}>{t('price')}</p>}
            value={fieldsInput.priceFrom}
            type="number"
            placeholder={t('priceFilterFrom') as string}
            containerClassName={classes.inputFilter}
            onChange={changeInput}
          />
        </div>
        <div className={classes.filterBlock}>
          <Input
            name='priceUp'
            value={fieldsInput.priceUp}
            type="number"
            placeholder={t('priceFilterBefore') as string}
            containerClassName={classes.inputFilter}
            onChange={changeInput}
          />
        </div>
      </Filter>
    </aside>
  );
};

export default ShopFilter;
