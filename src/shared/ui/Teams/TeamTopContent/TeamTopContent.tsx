import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { ITeam } from '@/entities/Team/type/teamSchema';
import ImageBg from '@/shared/assets/images/TeamInfo.webp';
import { Container } from '../../Container/Container';
import { HTag } from '../../HTag/HTag';
import classes from './TeamTopContent.module.scss';
import SubTitle from './TeamTopSubTitle';


interface ITeamTopContentProps {
  data: ITeam;
}


const TeamTopContent = ({ data }: ITeamTopContentProps) => {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className={classes.main}>
      <Image
        src={ImageBg}
        fill
        sizes='100%'
        quality={100}
        alt='bg'
        priority
      />
      <Container>
        <div className={classes.content}>
          <div className={classes.img}>
            <img
              src={data.logo}
              width={348}
              height={348}
              alt={data.name}
            />
          </div>
          <div className={classes.info}>
            <HTag level={1}>{data.name}</HTag>
            <SubTitle before={t('yearOfFoundation')}>{data.year_of_found}</SubTitle>
            <SubTitle before={t('president')}>{data.president}</SubTitle>
            <SubTitle before={t('headCoach')}>{data.trainer}</SubTitle>
            <SubTitle before={t('captain')}>{data.captain}</SubTitle>
            <SubTitle myClassSubTittle={classes.whiteSpace} before={t('teamAchievements')} >
              {data.achievements?.map(item => item.title).join(',')}
            </SubTitle>
            <SubTitle myClassSubTittle={classes.whiteSpace} before={t('socialMedia')} link={data.link}/>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TeamTopContent;
