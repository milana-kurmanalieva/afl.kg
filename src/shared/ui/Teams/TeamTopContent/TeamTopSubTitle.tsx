import { ReactNode } from 'react';
import { HTag } from '../../HTag/HTag';
import { inter } from '../../seo/Layout/Layout';
import classes from './TeamTopContent.module.scss';


interface SubTitleProps {
  before?: string | null;
  children?: ReactNode;
  link?: string;
  myClassSubTittle?: string;
}

const findLink = (link: string) => {
  const domain = (link.replace('www', '').match(/\w+/g));
  const result = domain?.find(item => !(/https|http/.test(item)));

  if (result === 't') return 'Telegram';
  return result;
};

const SubTitle = ({ before, children, link, myClassSubTittle = '' }: SubTitleProps) => {
  if (!children && !link) return null;
  return (
    <HTag myClass={`${inter.className} ${classes.subTitle} ${myClassSubTittle}`} level={5}>
      {before} <span>{children}</span>
      {link && <a className={classes.link} target='_blank' rel='nofollow' href={link}>
        {findLink(link)}
      </a>}
    </HTag>
  );
};

export default SubTitle;
