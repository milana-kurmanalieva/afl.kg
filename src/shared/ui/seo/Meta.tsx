import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import { BrowserTheme } from '@/shared/lib/constants/constants';


interface IMeta {
  children?: ReactNode,
  title: string,
  description?: string,
}

const getTitle = (title: string) => `${title} | Football.kg`;
export const Meta: FC<PropsWithChildren<IMeta>> = ({ children, title, description }) => {

  const [ theme, setTheme ] = useState<BrowserTheme>(BrowserTheme.LIGHT);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(prefersDark ? BrowserTheme.DARK : BrowserTheme.LIGHT);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [ theme ]);

  return (
    <>
      <Head>
        <title>{getTitle(title)}</title>
        <link rel="icon" href={`/favicon-${theme}.ico`} />
        <meta name="theme-color" content={theme === BrowserTheme.LIGHT ? '#ffffff' : '#000000'} />
        <meta name="google" content="notranslate"/>
        {description ? <>
          <meta name="description" content={description} />
          <meta name="og:title" content={getTitle(title)} />
          <meta name="og:description" content={description} />
        </> :
          <meta name='robots' content="noindex. nofollow" />
        }
        {children}
      </Head>
    </>
  );
};
