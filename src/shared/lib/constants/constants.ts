import { AreaItem, TimePaymentsItem } from '@/entities/Field/type/fieldSchema';
import { Tour } from '@/entities/Matches/type/MatchSchema';


export const API_BASE = process.env.BASE_URL;

export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATE_FORMAT_FIELD = 'yyyy-MM-dd';

export const apiVersion = 'api/v1';

export enum ProfileTab {
  Fields = 'fields',
  Settings = 'settings',
  CreateField = 'create-field',
  EditField = 'edit-field',
  BookField = 'book-field',
  Shops = 'shops',
  CreateShop = 'create-shop',
  EditShop = 'edit-shop',
  CreateProduct = 'create-product',
  EditProduct = 'edit-product',
}

export const PATHS = {
  home: '/',
  news: '/news',
  worldNews: '/news?news=world',
  teams: '/teams',
  divisions: '/divisions',
  players: '/players',
  ourteam: '/ourteam',
  bombardier: '/bombardier',
  rating: '/players-rating',
  searchResults: '/search-results',
  videos: '/videos',
  documents: '/documents',
  referee: '/referee',
  sponsors: '/sponsors',
  gallery: '/photo-gallery',
  catalog: '/catalog',
  store: '/store',
  archive: '/archive',
  cup: '/cup',
  photoEssay: '/photoEssay/',
  matches: '/matches',
  aboutUs: '/about-us',
  cupBombardiers: '/cup-bombardiers',
  cupRating: '/cup-players-rating',
  signIn: '/auth/login',
  signup: '/auth/sign-up',
  verifyUser: '/verify/user',
  passwordChange: '/auth/password/change',
  passwordReset: '/auth/password/reset',
  loginWithGoogle: `/${apiVersion}/auth/google/login/`,
  callbackGoogle: 'auth/google/login/callback',
  callbackGoogleSucceed: 'auth/google/login/callback?status=success',
  profile: '/profile',
  profileFields: `/profile?tab=${ProfileTab.Fields}`,
  profileSettings: `/profile?tab=${ProfileTab.Settings}`,
  profileCreateFields: `/profile?tab=${ProfileTab.CreateField}`,
  profileEditFields: `/profile?tab=${ProfileTab.EditField}`,
  profileBookFields: `/profile?tab=${ProfileTab.BookField}`,
  profileShops: `/profile?tab=${ProfileTab.Shops}`,
  profileCreateShop: `/profile?tab=${ProfileTab.CreateShop}`,
  profileEditShop: `/profile?tab=${ProfileTab.EditShop}`,
  profileCreateProduct: `/profile?tab=${ProfileTab.CreateProduct}`,
  profileEditProduct: `/profile?tab=${ProfileTab.EditProduct}`,
  productDetail: '/productDetail',
  blackList: '/black-list',
};

export const AUTH_PATHS = [
  PATHS.signIn,
  PATHS.signup,
  PATHS.passwordChange,
  PATHS.passwordReset,
  PATHS.verifyUser,
  PATHS.callbackGoogle,
  PATHS.callbackGoogleSucceed,
];

export const STATUS_CODES: Record<
  string,
  { message: string; description: string }
> = {
  '111111': {
    message: 'Неизвестная ошибка',
    description: 'Произошла неизвестная ошибка',
  },
  '000001': { message: 'Уже удалено', description: 'Элемент уже удален' },
  '100104': {
    message: 'Пользователь уже существует',
    description: 'Пользователь уже существует в системе',
  },
  '100117': {
    message: 'Неправильный логин или пароль',
    description: 'Неправильный логин или пароль',
  },
  '100105': {
    message: 'Пользователь не найден',
    description: 'Пользователь не найден в системе',
  },
  '100109': {
    message: 'Срок действия ссылки истек',
    description: 'Срок действия ссылки истек',
  },
  '100110': {
    message: 'Пароль не действителен',
    description: 'Пароль не соответствует требованиям',
  },
  '100111': {
    message: 'Пароли не совпадают',
    description: 'Введенные пароли не совпадают',
  },
  '100113': {
    message: 'Старый пароль неверный',
    description: 'Введенный пароль неверен',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type THUNK_ANY = any;

export const backMedia = '/back_media';

export const DEFAULT_LEAGUE_ID = 3;

export const LEAGUE_ENDPOINT = '/leagues';

export const LEAGUES_KEY = 'leagues';

export const CHAMPIONSHIP_ENDPOINT = '/championships';

export const ARCHIVE_ENDPOINT = '/archive';

export const SHARE_BASE_URL = 'https://football.kg';

export const SUBMIT_TIMEOUT = 500;

export const IS_AUTHORIZED = 'is_authorized';

export const getLeagueId = (id: number, rest?: string) => {
  return `${LEAGUE_ENDPOINT}/${id}${rest ?? ''}`;
};

export const getChampionshipId = (id: number, rest?: string) => {
  return `${CHAMPIONSHIP_ENDPOINT}/${id}${rest ?? ''}`;
};

export enum BUTTON_VARIANTS {
  PRIMARY = 'primary',
  NEW_YORK_PRIMARY = 'newYorkPrimary',
  NEW_YORK_GHOST = 'newYorkGhost',
  OUTLINED = 'outlined',
  DELETE = 'delete',
}

export enum REQUEST_STATUSES {
  NOT_REQUESTED = 'notRequested',
  REQUESTED = 'requested',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export const LANG_NAME = 'lang';

export enum LOCALES {
  KY = 'ky',
  RU = 'ru',
}

export interface ILocale {
  locale: LOCALES;
}

export type Error = string | null;
export type Status = 'notRequested' | 'requested' | 'succeeded' | 'failed';
export enum styleVariants {
  small = 'small',
  big = 'big',
}

export enum StyleType {
  secondary = 'secondary',
  primary = 'primary',
}

export interface SearchResult {
  id: number;
  [name: string]: string | number;
}

export interface SearchResultGlobal {
  model: string;
  result: Array<SearchResult>;
}

export interface FilterSelectOption {
  id: number;
  logo?: string;
  title: string;
  titleFilter?: string;
  href?: string;
  value?: string;
  default?: boolean;
  slug?: string | undefined;
  children?: Categories[];
  championship_tour_archives?: [{ original_tour: number, title: string }];
  championship_division_archives?: [{ original_division_id: number, title: string }];
  is_super_cup?: boolean;
  cup_id?: number;
  super_cup_one_name?: string;
  super_cup_two_name?: string;
  name?: string;
  original_division_id?: number;
}

export interface ISuperCupResult {
  id: number;
  value: number;
  label: string;
}

interface IResponse {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ISuperCupResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ISuperCupResult[];
}

export interface TeamMatch {
  id: number;
  logo: string;
  name: string;
  division_id: number;
  captain: string
}

export interface IMatchesItem {
  id: number;
  team_one: TeamMatch;
  team_two: TeamMatch;
  result: string;
  status?: string;
  date: string;
  tour: Tour | string ;
}

export interface ITbaleTeam {
  id: number;
  conceded: number;
  defeats: number;
  draws: number;
  games: number;
  goals: number;
  name: string;
  points: number;
  wins_count: number;
  logo: string;
}

export interface ITbalePlayer {
  id: number;
  games?: number;
  first_name: string;
  last_name: string;
  team: string;
  goals: number;
  assists?: number;
  yel_cards?: number;
  red_cards?: number;
  points?: number;
  team_id: number;
  team_logo: string;
  avatar: string;
  best_player_count?: string;
  team_name: string;
}

export enum AlertVariants {
  info = 'info',
  success = 'success',
  error = 'error',
}

export enum Directions {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}
// FIX_ME change to keys for translates;

export enum TABLE_KEYS {
  GAMES = 'И',
  GOALS = 'Г',
  COMMAND = 'Команды',
  A = 'А',
  P = 'П',
  U = 'У',
}

export enum CardPersonVariant {
  PLAYERS = 'players',
  REFEREE = 'referee',
  OUR_TEAMS = 'our_teams',
}

export enum BrowserTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum BestPlayerVariant {
  ONE_PLAYER = 'onePlayer',
}

export enum SEARCH_MODELS {
  NEWS_WORLD = 'Новости футбола',
  NEWS_LEAGUE = 'Новости лиги',
  TEAMS = 'Команды',
  PLAYERS = 'Игроки',
}

export enum MATCH_TYPE {
  MATCH = 'match',
  CUP_MATCH = 'cupmatch',
}
export enum CATALOG_TABS {
  FIELDS = 'fields',
  SHOPS = 'shops',
}
export enum FIELD_TYPES {
  COVERED = 'covered',
  UNCOVERED = 'uncovered',
  HALL = 'hall',
}

export interface ErrorTexWithCode {
  code: string;
  text: { message: string; description: string };
}

export interface Field {
  id: number;
  name: string;
  is_active: boolean;
}

export interface PhotoItem {
  id: number;
  photo: string;
}
export interface FieldInfo extends Field {
  field_photos: PhotoItem[];
  time_payments: TimePaymentsItem[];
}

export interface AddressField {
  id: number;
  name: string;
  address: string;
  address_link: string;
  area: AreaItem;
  fields: FieldInfo[];
  area_data: AreaItem;
  fields_count: number;
}

export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEK_DAYS: Record<DayNumber, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};

export enum FieldAction {
  Edit = 'edit',
  Create = 'create',
}

export enum ShopAction {
  Edit = 'edit',
  Create = 'create',
}

export enum ShopDelivery {
  Free = 'FREE',
  Paid = 'PAID',
  No = 'NO',
}

export interface ShopAddress {
  address: string;
  main_number: string;
  secondary_number?: string;
  link_2gis: string;
}

export interface ShopData {
  title: string;
  description: string;
  category?: number | null;
  price?: string;
  brand?: string;
  store?: string;
  subCategory?: string;
  delivery?: ShopDelivery;
  addresses?: ShopAddress[];
}

export interface CatOptions {
  title: string;
  slug?: string | undefined;
  id: number;
  children?: Categories[];
}

export interface Categories {
  id: number;
  slug: string;
  title: string;
  children: Categories[];
}

export interface Shop {
  id: string;
  store_logo: { logo: string };
  title: string;
  description: string;
  delivery: ShopDelivery;
  is_confirmed: boolean;
  addresses: ShopAddress[];
  category?: number;
  brand?: string;
  price?: number;
  product_photos?: PhotoItem[];
  number_store?: number | null;
  product_limit: number;
  products_total: number;
  pin_product?: boolean;
}

export interface Product {
  id: string;
  title: string;
  store: string;
  description: string;
  category: number;
  brand: string;
  price: number;
  product_photos?: PhotoItem[];
  is_active?: boolean;
  pin_product?: boolean;
}

export interface StoreChildrenItem {
  id: number;
  slug: string;
  title: null | string;
  children: [];
}
export interface ProductDetails {
  id: string;
  store: string;
  title: string;
  description: string;
  category: number;
  categories: Array<{
    id: number;
    slug: string;
    title: string;
    parent: number | null;
  }>;
  delivery: string;
  brand: string;
  price: number;
  product_photos: Array<{
    id: number;
    photo: string;
    product: string;
  }>;
  main_number: string;
}
