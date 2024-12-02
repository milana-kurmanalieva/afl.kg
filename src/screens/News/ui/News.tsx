import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { ChangeEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { Meta } from '@/shared/ui/seo/Meta';
import { Container } from '@/shared/ui/Container/Container';
import { Tab } from '@/entities/Tabs/type/TabsSchema';
import { PATHS, SearchResult, styleVariants } from '@/shared/lib/constants/constants';
import { SearchInput } from '@/shared/ui/SearchInput/SearchInput';
import { getSearchNews, selectLeagueNews } from '@/entities/News/model/LeagueNewsSlice';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { LeagueNewsState, NewsItem } from '@/entities/News/type/newsSchema';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import NewsList from '@/shared/ui/News/NewsList/NewsList';
import { getSearchWorldsNews, selectWorldNews } from '@/entities/WorldNews/model/WorldNewsSlice';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { WorldList } from '@/entities/WorldNews';
import { TabsWrapper } from '@/entities/Tabs';
import { LeagueNewsList } from '@/entities/News';
import { BannerRow } from '@/entities/Banners';


const maxSearchItems = 15;

const query = 'news';
type queryType = 'league' | 'world'

const leagueQuery = 'league';
const worldQuery = 'world';

const searchDelay = 500;

const NewsPage:NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const tabsList:Array<Tab<queryType>> =
    [ { value: 'league', label: t('newsLeague') }, { value: 'world', label: t('newsWorld') } ];

  const pages = [
    {
      href: '',
      page: t('infoCenter'),
      disabled: true,
    }, {
      href: PATHS.news,
      page: t('news'),
    },
  ];

  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);
  const { searchNews }:LeagueNewsState = useSelector(selectLeagueNews);
  const { searchWorldNews } = useSelector(selectWorldNews);

  const currentTab:Tab<queryType> = useMemo(() => {
    const tab = tabsList.find(tab => tab.value === router.query[ query ]);
    const defaultTab = tabsList[ 0 ];

    if (tab) return tab;

    return defaultTab;
  }, [ router ]);

  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ isSearched, setIsSearched ] = useState<boolean>(false);

  const searchedItems = useMemo(() => {
    if (currentTab.value === leagueQuery) return searchNews;
    return searchWorldNews;
  }, [
    currentTab.value,
    searchNews,
    searchWorldNews,
  ]);

  const hintsForSearchedItems = useMemo(() => {
    return searchedItems.map((res: NewsItem) => ({ title: res.title, id: res.id }));
  }, [ searchedItems ]);

  const handleSearchRequest = useDebounce((value: string) => {
    const params = {
      search: value,
      leagueId: leagueId,
      limit: maxSearchItems,
    };
    if (currentTab.value === leagueQuery) dispatch(getSearchNews(params));
    else dispatch(getSearchWorldsNews(params));
  }, searchDelay);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!e.target.value) {
      setIsSearched(false);
      return;
    }

    handleSearchRequest(e.target.value);
  };

  const handleFoundItemClick = (result?: SearchResult) => {
    if (result?.id) router.push(`${PATHS.news}/${result.id}`);
  };

  const handleSubmit = () => {
    if (!!searchValue) setIsSearched(true);
  };

  const handleClose = () => {
    setIsSearched(false);
    setSearchValue('');
  };

  return (
    <>
      <Meta title={currentTab.label} description='New about football'>
      </Meta>
      <Container variant='large'>
        <TopContent
          title={t('news')}
          breadcrumbs={pages}
        >
          <SearchInput
            value={searchValue}
            searchKeys={[ 'title' ]}
            placeholder={t('search') as string}
            onChange={handleChange}
            onFoundItemClick={handleFoundItemClick}
            onEnter={handleSubmit}
            onClose={handleClose}
            hints={hintsForSearchedItems}
          />
          <TabsWrapper
            tabsList={tabsList}
            query={query}
          />
        </TopContent>

        <BannerRow/>
      </Container>


      {isSearched && <Container variant='large'>
        <NewsList
          title={searchedItems.length ?
            t('foundAccordingToYourRequest') as string : t('nothingFoundForYourRequest') as string}
          newsList={searchedItems}
          cardVariant={styleVariants.big}
          listVariant={styleVariants.big}
        />
      </Container>}

      {!isSearched && <Container
        variant='large'
      >
        {currentTab.value === leagueQuery && <LeagueNewsList
          listVariant={styleVariants.big}
          cardVariant={styleVariants.big}
        />}

        {currentTab.value === worldQuery && <WorldList/>}
      </Container>}
    </>);
};

export default NewsPage;
