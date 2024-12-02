import React from 'react';
import { useTranslation } from 'next-i18next';
import goalIcon from '@/icons/goal.svg';
import assistIcon from '@/icons/assist.svg';
import redCardIcon from '@/icons/redCard.svg';
import yellowCardIcon from '@/icons/yellowCard.svg';
import ownGoalIcon from '@/icons/ownGoal.svg';
import { HTag } from '../HTag/HTag';
import { MatchesType } from './MatchFinall';
import classes from './matches.module.scss';


// player elements
const cardsList = {
  '1': {
    title: 'Goal',
    icon: goalIcon.src,
  },
  '2': {
    title: 'Assist',
    icon: assistIcon.src,
  },
  '6': {
    title: 'RedCard',
    icon: redCardIcon.src,
  },
  '5': {
    title: 'YellowCard',
    icon: yellowCardIcon.src,
  },
  '7': {
    title: 'OwnGoal',
    icon: ownGoalIcon.src,
  },
};

export const MatchDetail = ({ match } : {match: MatchesType}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.matchDetail}>
      <p className={classes.matchDetailTitle}>{t('matchDetails')}</p>
      <hr className={classes.horizontalBorder}/>
      <div className={classes.elements}>
        <div className={classes.teamElements}>
          {match?.tm_one_players?.map((element) => (
            <div key={element.player} className={classes.matchGoals}>
              <>
                <p>{element.player}</p>
                <div className={classes.allElementsMatch} >
                  {element.elements_list.map((el) => (
                    <img
                      key={el.element}
                      alt='goal'
                      src={cardsList[ el.element as keyof typeof cardsList ]?.icon}
                    />
                  ))}
                </div>
              </>
            </div>
          ))}
        </div>
        <hr className={classes.verticalBorder}/>
        {<div className={classes.teamElements}>
          {match?.tm_two_players?.map((element) => (
            <div key={element.player} className={classes.matchGoals}>
              <>
                <div className={classes.allElementsMatch} >
                  {element.elements_list.map((el) => (
                    <img
                      key={el.element}
                      alt='goal'
                      src={cardsList[ el.element as keyof typeof cardsList ]?.icon}
                    />
                  ))}
                </div>
                <p className={classes.secondTeamPLayerNameItem}>{element.player}</p>
              </>
            </div>
          ))}
        </div>}
      </div>
      <hr className={classes.horizontalBorder}/>
      <HTag level={4}>{t('matchIconInfoTitle')}:</HTag>
      <ul className={classes.iconsInfo}>
        {Object.entries(cardsList).map((item) => (
          <li key={item[ 0 ]}>
            <img src={item[ 1 ].icon} alt={item[ 1 ].title} />
            {t(`matchIconLabel${item[ 1 ].title}`)}
          </li>
        ))}
      </ul>
    </div>
  );
};
