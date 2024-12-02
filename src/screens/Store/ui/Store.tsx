import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { Meta } from '@/shared/ui/seo/Meta';
import { BannerRow } from '@/entities/Banners';
import { BurgerFilter } from '@/widgets/FilterField/ui/BurgerFilter/BurgerFilter';
import { CATALOG_TABS, FilterSelectOption, PATHS, Product, REQUEST_STATUSES } from '@/shared/lib/constants/constants';
import StoreDetails from '@/widgets/StoreInfo/ui/StoreDetails/StoreDetails';
import {
  getCategories, getStore,
  getStoreProducts,
  getStoresBySearch, resetStoreProducts, selectStores,
} from '@/entities/Store/model/StoreSlice';
import ShopFilter from '@/shared/ui/ShopFilter/ShopFilter';
import ProductsList from '@/shared/ui/ProductsList/ProductsList';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import classes from './store.module.scss';


const LIMIT = 15;

const Store: NextPage = () => {
  const { t } = useTranslation();
  const { store, storesCategories, storeProducts, storeProductsStatus } = useSelector(selectStores);
  const router = useRouter();
  const id = (router.query.id as string);
  const pages = [
    {
      href: '',
      page: t('infoCenter'),
      disabled: true,
    },
    {
      href: PATHS.catalog,
      page: 'Справочник',
    },
    {
      href: '',
      page: store.title,
    },
  ];

  const dispatch = useAppDispatch();
  const [ isFilterOpen, setIsFilterOpen ] = useState(false);
  const [ category, setCategory ] = useState<FilterSelectOption | null>(null);
  const [ subCategory, setSubCategory ] = useState<FilterSelectOption | null>(null);
  const [ fieldsInput, setFieldsInput ] = useState({
    priceFrom: '',
    priceUp: '',
  });
  const [ allProducts, setAllProducts ] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(getStore({ id }));
  }, [ id, dispatch ]);

  useEffect(() => {
    dispatch(getCategories());
  }, [ store, dispatch ]);

  const handleFilter = () => {
    dispatch(getStoreProducts({
      id: store.id,
      search: store.title || '',
      category: category?.title || '',
      sub_category: subCategory?.title || '',
      price_from: +fieldsInput.priceFrom || '',
      price_to: +fieldsInput.priceUp || '',
      limit: LIMIT,
    })).unwrap().then(res => setAllProducts(res.results));
  };

  const handleLoadMore = async () => {
    if (storeProductsStatus === REQUEST_STATUSES.REQUESTED) return;
    const res = await dispatch(getStoreProducts({
      id: store.id,
      limit: LIMIT,
      offset: allProducts.length,
      search: store.title || '',
      category: category?.title || '',
      sub_category: subCategory?.title || '',
      price_from: +fieldsInput.priceFrom || '',
      price_to: +fieldsInput.priceUp || '',
    })).unwrap();
    setAllProducts((prev) => ([ ...prev, ...res.results ]));
  };

  useEffect(() => {
    if (store.id) {
      dispatch(getStoreProducts({ id: store?.id, limit: LIMIT })).unwrap().then(res => {
        setAllProducts(res.results);
      });
    }

    return () => {
      setAllProducts([]);
      dispatch(resetStoreProducts());
    };
  }, [ store, dispatch ]);

  const handleClearFilter = () => {
    dispatch(getStoresBySearch({ search: store.title }));
    setCategory(null);
    setSubCategory(null);
    setFieldsInput({ priceFrom: '', priceUp: '' });
  };


  return (
    <>
      <Meta title={t('catalog')} description="">
      </Meta>
      <Container variant="large">
        <TopContent
          title={t('catalog')}
          breadcrumbs={pages}
        >
        </TopContent>
        <BannerRow/>
        <div className={classes.withFilter}>
          <div className={`${isFilterOpen ? classes.burgerFilterOpen : classes.burgerFilterClose}`}>
            <div className={classes.burgerFilter}>
              <BurgerFilter
                tab={CATALOG_TABS.SHOPS}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(prev => !prev)}/>
            </div>
            <ShopFilter
              areas={storesCategories}
              handleFilter={handleFilter}
              handleClearFilter={handleClearFilter}
              setCategory={setCategory}
              setSubCategory={setSubCategory}
              category={category}
              subCategory={subCategory}
              fieldsInput={fieldsInput}
              setFieldsInput={setFieldsInput}
            />
          </div>
          <div className={classes.detailProducts}>
            <StoreDetails />
            <LoadMoreContainer
              hasMore={!!storeProducts.next}
              loadMore={handleLoadMore}
            >
              <ProductsList
                products={
                  (allProducts.length ? allProducts : storeProducts.results) ?? []
                }
              />
            </LoadMoreContainer>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Store;
