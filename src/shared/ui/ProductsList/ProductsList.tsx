import { FC } from 'react';
import { Product, Shop } from '@/shared/lib/constants/constants';
import ProductCard from '../ProductCard/ProductCard';
import { EmptyState } from '../EmptyState/EmptyState';
import classes from './ProductsList.module.scss';


interface ProductsProps {
  products: Product[];
}

const ProductsList: FC<ProductsProps> = ({ products }) => {
  return (
    <div className={classes.productsList}>
      {!products.length && <EmptyState/>}
      {
        !!products?.length && products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))
      }
    </div>
  );
};

export default ProductsList;
