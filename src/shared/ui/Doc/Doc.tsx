import Image from 'next/image';
import Download from '@/shared/assets/icons/documents/download.svg';
import File from '@/shared/assets/icons/documents/file.svg';
import classes from './Doc.module.scss';


interface IDoc {
  name: string,
  href: string
}

const maxTextLength = (text: string, maxLength = 27, limit = 20) => {
  if (text.length <= maxLength) return text;
  const slicedText = text.slice(0, limit);
  return `${slicedText}...`;
};

const Doc = ({ name, href }: IDoc) => {
  return (
    <a href={href} download className={classes.main}>
      <Image width={24} height={24} src={File} alt='file' />
      <span>{maxTextLength(name)}</span>
      <Image width={24} height={24} src={Download} alt='download' />
    </a>
  );
};

export default Doc;
