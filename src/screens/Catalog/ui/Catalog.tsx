import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { TabsWrapper } from '@/entities/Tabs';
import { Tab } from '@/entities/Tabs/type/TabsSchema';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { CatalogState } from '@/entities/Catalog/type/catalogSchema';
import { getCatalogList, selectCatalog } from '@/entities/Catalog/model/CatalogSlice';
import LoadMoreContainer from '@/shared/ui/LoadMoreContainer/LoadMoreContainer';
import { Meta } from '@/shared/ui/seo/Meta';
import { BannerRow } from '@/entities/Banners';
import CatalogFilter from '@/shared/ui/Catalog/CatalogCard/CatalogFilter/CatalogFilter';
import { BurgerFilter } from '@/widgets/FilterField/ui/BurgerFilter/BurgerFilter';
import { CATALOG_TABS } from '@/shared/lib/constants/constants';
import { getAddresses, resetAddresses, selectFieldAddress } from '@/entities/Field/model/FieldSlice';
import CatalogFieldList from '@/shared/ui/Catalog/CatalogList/CatalogFieldList/CatalogFieldList';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import GlobalShopSearcher from '@/screens/GlobalShopSearcher/ui/GlobalShopSearcher';
import classes from './catalog.module.scss';


const query = 'catalog';
type queryType = 'fields' | 'shops'

const LIMIT = 10;

const Catalog: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile();

  const pages = [
    {
      href: '',
      page: t('infoCenter'),
      disabled: true,
    },
  ];

  const tabsList: Array<Tab<queryType>> =
    [
      { value: 'fields', label: t('fieldsInBishkek') }, {
        value: 'shops',
        label:
        !isMobile ? t('sportShops') : t('shops'),
      },
    ];

  const currentTab: Tab<queryType> = useMemo(() => {
    const tab = tabsList.find(tab => tab.value === router.query[ query ]);
    const defaultTab = tabsList[ 0 ];

    if (tab) return tab;

    return defaultTab;
  }, [ router ]);


  const dispatch = useAppDispatch();
  const { catalog }: CatalogState = useSelector(selectCatalog);
  const { addresses } = useSelector(selectFieldAddress);

  const [ isLoading, setIsLoading ] = useState(false);
  const [ page, setPage ] = useState(0);
  const [ theTab, setTheTab ] = useState(currentTab.value);
  const [ isFilterOpen, setIsFilterOpen ] = useState(false);
  const handleLoadMore = async() => {
    setIsLoading(true);
    const { results } = await dispatch(getCatalogList({ page: page + 1, type: CATALOG_TABS.SHOPS })).unwrap();
    if (!Array.isArray(results)) return;
    setIsLoading(false);
    setPage(prev => prev + 1);
  };

  const handleChangeTab = async() => {
    setPage(1);
    setTheTab(currentTab.value);
  };

  const handleLoadMoreFields = () => {
    dispatch(getAddresses({ limit: LIMIT, offset: addresses.results.length }));
  };

  useEffect(() => {
    if (currentTab.value !== theTab) {
      handleChangeTab();
    }
  }, [ currentTab ]);

  useEffect(() => {
    dispatch(getAddresses({ limit: LIMIT, offset: 0 }));

    return () => {
      dispatch(resetAddresses());
    };
  }, []);

  return (
    <>
      <Meta title={t('catalog')} description=''>
      </Meta>
      <Container variant="large">
        <TopContent
          title={t('catalog')}
          breadcrumbs={pages}
        >
          <TabsWrapper
            tabsList={tabsList}
            query={query}
          />
        </TopContent>
        <BannerRow/>
        <div className={classes.withFilter}>
          <div className={`${isFilterOpen ? classes.burgerFilterOpen : classes.burgerFilterClose}`}>
            <div className={classes.burgerFilter}>
              <BurgerFilter
                tab={currentTab.value}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(prev => !prev)}/>
            </div>
            <aside className={classes.aside}>
              {currentTab.value === CATALOG_TABS.FIELDS && <CatalogFilter/>}
            </aside>
          </div>
          <LoadMoreContainer
            loadMore={currentTab.value === CATALOG_TABS.FIELDS ? handleLoadMoreFields : handleLoadMore}
            hasMore={currentTab.value === CATALOG_TABS.FIELDS ? !!addresses.next : !!catalog.next}
            containerClassName={currentTab.value === CATALOG_TABS.FIELDS ? classes.catalogAddress : ''}
          >
            {
              currentTab.value === CATALOG_TABS.FIELDS &&
              (addresses?.results?.length === 0 ?
                <EmptyState/>
                :
                <CatalogFieldList isLoading={isLoading} list={addresses.results}/>
              )
            }
          </LoadMoreContainer>
        </div>
        {
          currentTab.value === CATALOG_TABS.SHOPS &&
              (addresses?.results?.length === 0 ?
                <EmptyState/>
                :
                <GlobalShopSearcher/>
              )
        }
      </Container>
    </>
  );
};

export default Catalog;
