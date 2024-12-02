import Image from 'next/image';
import { CSSProperties } from 'react';
import { ISponsor } from '@/entities/Team/type/teamSchema';
import classes from './SponsorCard.module.scss';


interface ISponsorCardProps {
  data: ISponsor,
}

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
};

const SponsorCard = ({ data }: ISponsorCardProps) => {

  return (
    <>
      <a
        className={classes.main}
        href={data.link}
        target='_blank'
        rel='nofollow'
      >
        <img
          style={imageStyle}
          src={data.logo}
          alt={data.name}
        />
      </a>
    </>

  );
};

export default SponsorCard;
