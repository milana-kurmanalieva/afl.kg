import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getCategories, getStores, getStoresBySearch, selectStores } from '@/entities/Store/model/StoreSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { Input } from '@/shared/ui/Input/Input';
import SearchIcon from '@/shared/ui/SearchIcon/SearchIcon';
import CatalogList from '@/shared/ui/Catalog/CatalogList/CatalogList';
import { CloseIcon } from '@/shared/ui/CloseIcon/CloseIcon';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import ProductsList from '@/shared/ui/ProductsList/ProductsList';
import ShopFilter from '@/shared/ui/ShopFilter/ShopFilter';
import { FilterSelectOption, Product, Shop } from '@/shared/lib/constants/constants';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import classes from './GlobalShopSearcher.module.scss';


interface ApiResponse {
  results?: {
    stores?: Shop[];
    products?: Product[];
  };
  next: string | null;
  previous: string | null;
  count?: number;
}


const searchDelay = 800;
const SHOPS_LIMIT = 16;

const GlobalShopSearcher: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { stores, productsAndShops, storesCategories } = useSelector(selectStores);
  const [ search, setSearch ] = useState<string | undefined>('');
  const [ selectedResult, setSelectedResult ] = useState<string>('');
  const [ category, setCategory ] = useState<FilterSelectOption | null>(null);
  const [ subCategory, setSubCategory ] = useState<FilterSelectOption | null>(null);
  const [ fieldsInput, setFieldsInput ] = useState({
    priceFrom: '',
    priceUp: '',
  });
  const [ storesList, setStoresList ] = useState<Shop[]>([]);
  const [ allStoresAndProducts, setAllStoresAndProducts ] = useState<{
    stores: Shop[],
    products: Product[],
  }>({
    products: [],
    stores: [],
  });

  const debouncedSearch = useDebounce(async (value: string) => {
    const res = await dispatch(getStoresBySearch({ search: value, limit: SHOPS_LIMIT }))
      .unwrap();
    if (res.results) {
      setAllStoresAndProducts({
        stores: res.results.stores || [],
        products: res.results.products || res.results || [],
      });
    }
  }, searchDelay);

  const searchData = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(/^\s+/, '');
    setSelectedResult(inputValue ? 'search' : 'default');
    setSearch(inputValue);
    debouncedSearch(inputValue);
  };

  const clearSearch = () => {
    dispatch(getStores({ limit: SHOPS_LIMIT }));
    setSelectedResult('default');
    setSearch('');
    setAllStoresAndProducts({
      products: [],
      stores: [],
    });
  };

  const renderSearchResults = () => {
    const catalogStoresWithFilters = allStoresAndProducts.stores.length ? allStoresAndProducts.stores :
      productsAndShops?.results?.stores ?? [];

    const productsWithFilters = allStoresAndProducts.products.length ? allStoresAndProducts.products :
      productsAndShops?.results?.products ?? [];

    switch (selectedResult) {
    case 'search':
      return (
        <div>
          {catalogStoresWithFilters.length || productsWithFilters.length ? (
            <>
              <CatalogList stores={catalogStoresWithFilters} />
              <ProductsList products={productsWithFilters} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      );
    case 'default':
      return (
        <>
          <CatalogList stores={storesList.length ? storesList : stores.results ?? []} />
        </>
      );
    case 'filter':
      return (
        <div>
          {(!productsAndShops?.results?.length &&
              !productsAndShops?.results?.products?.length &&
              !allStoresAndProducts.products.length) ?
            <EmptyState /> :
            <ProductsList products={productsWithFilters} />
          }
        </div>
      );
    default:
      return (
        <div>
          <EmptyState />
        </div>
      );
    }
  };

  const handleFilter = async () => {
    setSelectedResult('filter');
    const res = await dispatch(getStoresBySearch({
      search: search || '',
      category: category?.title || '',
      sub_category: subCategory?.title || '',
      price_from: +fieldsInput.priceFrom || '',
      price_to: +fieldsInput.priceUp || '',
      limit: SHOPS_LIMIT,
    })).unwrap();

    if (res.results) {
      setAllStoresAndProducts(prev => ({
        ...prev,
        products: res.results || [],
      }));
    }
  };

  const handleClearFilter = () => {
    clearSearch();
    setCategory(null);
    setSubCategory(null);
    setFieldsInput({ priceFrom: '', priceUp: '' });
    setAllStoresAndProducts({
      products: [],
      stores: [],
    });
  };

  const handleLoadMore = async () => {
    try {
      if (selectedResult === 'default') {
        const res = await dispatch(getStores({ limit: SHOPS_LIMIT, offset: storesList.length })).unwrap();
        setStoresList((prev) => [ ...prev, ...(res.results ?? []) ]);
      } else {
        const res: ApiResponse = await dispatch(getStoresBySearch({
          search: search || '',
          category: category?.title || '',
          sub_category: subCategory?.title || '',
          price_from: Number(fieldsInput.priceFrom) || '',
          price_to: Number(fieldsInput.priceUp) || '',
          limit: SHOPS_LIMIT,
          offset: Math.max(productsAndShops.results?.products?.length ?? 0, allStoresAndProducts.products.length),
        })).unwrap();
        setAllStoresAndProducts((prev) => {
          if (Array.isArray(res.results)) {
            const isProducts = res.results[ 0 ]?.store;
            return {
              products: [ ...prev.products, ...(isProducts ? res.results : []) ],
              stores: [ ...prev.stores, ...(!isProducts ? res.results : []) ],
            };
          }
          return {
            products: [ ...prev.products, ...(res.results?.products ?? []) ],
            stores: [ ...prev.stores, ...(res.results?.stores ?? []) ],
          };
        });
      }
    } catch (error) {
      console.error('Error loading more results:', error);
    }
  };


  useEffect(() => {
    dispatch(getStores({ limit: SHOPS_LIMIT })).unwrap().then((res: any) => {
      setStoresList(res.results ?? []);
      setAllStoresAndProducts(prev => ({
        ...prev,
        stores: res.results,
      }));
    });
    setSelectedResult(!productsAndShops?.results?.stores ? 'default' : 'default');
    dispatch(getCategories());
  }, [ dispatch ]);

  return (
    <div className={classes.globalSearcher}>
      <Input
        onChange={(event) => searchData(event)}
        value={search}
        placeholder={t('search') as string}
        startIcon={<SearchIcon />}
        endIcon={
          search &&
          <CloseIcon
            className={classes.closeIcon}
            onClick={clearSearch}
          />
        }
      />
      <div className={classes.storeFilterBlock}>
        {
          (search && productsAndShops?.count > 0) &&
          <ShopFilter
            areas={storesCategories}
            category={category}
            setCategory={setCategory}
            setSubCategory={setSubCategory}
            subCategory={subCategory}
            fieldsInput={fieldsInput}
            setFieldsInput={setFieldsInput}
            handleClearFilter={handleClearFilter}
            handleFilter={handleFilter}
          />
        }
        <LoadMoreContainer
          hasMore={selectedResult === 'default' ? !!stores.next : !!productsAndShops.next}
          loadMore={handleLoadMore}
        >
          {renderSearchResults()}
        </LoadMoreContainer>
      </div>
    </div>
  );
};

export default GlobalShopSearcher;
