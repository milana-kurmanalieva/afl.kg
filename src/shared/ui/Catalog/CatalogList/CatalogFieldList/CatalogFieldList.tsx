import { FC } from 'react';
import { AddressField, styleVariants } from '@/shared/lib/constants/constants';
import CardAddress from '@/shared/ui/Catalog/CatalogCard/CardVariants/CardAddress/CardAddress';
import Loader from '../../../loader/Loader';
import classes from './catalogFieldList.module.scss';


interface FieldListProps {
  listVariant?: styleVariants;
  list: AddressField[];
  isLoading?: boolean;
}

const FieldList:FC<FieldListProps> = ({
  list,
  isLoading,
}) => {

  return (
    <div className={classes.catalogListWrapper}>
      {(!list?.length && !isLoading) && <Loader center/>}

      <ul className={classes.list}>
        {!!list?.length && list.map(item => (
          <CardAddress field={item} key={item.id}/>
        ))}
      </ul>
    </div>
  );
};

export default FieldList;
