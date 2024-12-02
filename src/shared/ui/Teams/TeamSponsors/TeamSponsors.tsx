import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import ImageBg from '@/shared/assets/images/TeamInfo.webp';
import { ISponsor } from '@/entities/Team/type/teamSchema';
import { Container } from '../../Container/Container';
import { HTag } from '../../HTag/HTag';
import SponsorCard from '../../SponsorCard/SponsorCard';
import classes from './TeamSponsors.module.scss';


interface ITeamSponsorsProps {
  data: ISponsor[]
}

const TeamSponsors = ({ data }: ITeamSponsorsProps) => {
  const { t } = useTranslation();
  return (
    <div className={classes.wrapper}>
      <Container variant='large'>
        <div className={classes.main}>
          <HTag level={3}>{t('teamSponsors')}</HTag>
          <Image
            src={ImageBg}
            fill
            quality={100}
            alt='bg'
            priority
          />
          <div className={classes.sponsors}>
            {data?.map(item => <SponsorCard key={item.name} data={item}/>)}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TeamSponsors;
