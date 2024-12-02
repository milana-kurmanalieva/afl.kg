import { FC } from 'react';
import { Shop, styleVariants } from '@/shared/lib/constants/constants';
import CardShops from '@/shared/ui/Catalog/CatalogCard/CardVariants/CardShops/CardShops';
import classes from './catalogList.module.scss';


interface StoresProps {
  listVariant?: styleVariants;
  stores: Shop[];
}

const CatalogList:FC<StoresProps> = ({ stores }) => {

  return (
    <div className={classes.catalogListWrapper}>
      {/* {!stores.length && <EmptyState />} */}

      <ul className={classes.list}>
        {!!stores?.length && stores.map(store => (
          <CardShops store={store}
            key={store.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default CatalogList;
