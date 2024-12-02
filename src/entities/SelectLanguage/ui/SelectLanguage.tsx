import React, { FC, useEffect, useState } from 'react';
import { Select } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import ruFlag from '@/shared/assets/icons/header/ruFlag.svg';
import kyFlag from '@/shared/assets/icons/header/kyFlag.svg';
import { LANG_NAME } from '@/shared/lib/constants/constants';
import { Arrow } from '@/shared/ui/Arrow/Arrow';
import classes from './SelectLanguage.module.scss';


const allLangs = [
  {
    value: 'ru',
    label: 'RU',
    flag: ruFlag,
  }, {
    value: 'ky',
    label: 'Ky',
    flag: kyFlag,
  },
];

type langType = string | undefined;
const DEFAULT_LANG = 'ru';

const SelectLanguage: FC = () => {
  const router = useRouter();
  const [ value, setValue ] = useState<langType>('');

  const handleChangeLang = async (value: string) => {
    await router.push(router.pathname, router.asPath, { locale: value });
    setCookie(LANG_NAME, value);
    setValue(value);
    if (typeof window !== 'undefined') window.location.reload();
  };

  const langWithCurrentLang = allLangs.map((lang) => ({
    value: lang.value,
    label: (
      <div key={lang.value} className={classes.langComp}>
        <Image src={lang.flag} alt="flag" />
        {lang.value}
      </div>
    ),
  }));

  useEffect(() => {
    setValue(router.locale ?? DEFAULT_LANG);
  }, []);

  return (
    <Select
      className={classes.langComp}
      value={value}
      bordered={false}
      onChange={handleChangeLang}
      options={langWithCurrentLang}
      suffixIcon={<Arrow/>}
    />
  );
};

export default SelectLanguage;
