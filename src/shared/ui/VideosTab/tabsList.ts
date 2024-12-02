import { t } from 'i18next';
import { Tab } from '@/entities/Tabs/type/TabsSchema';


type queryType = '1' | '2' | '3' | '4';
export const tabsList:Array<Tab<queryType>> =
[
  { value: '1', label: 'Поле №1' },
  { value: '2', label: 'Поле №2' },
  { value: '3', label: 'Поле №3' },
  { value: '4', label: 'Поле №4' },
];
