import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import arrowDown from '@/shared/assets/icons/arrowDown.svg';
import { FilterSelectOption } from '@/shared/lib/constants/constants';
import { selectCurrentCup } from '@/entities/CurrentCup/model/currentCupSlice';
import { useAppSelector } from '@/app/providers/StoreProvider';
import { HTag } from '../HTag/HTag';
import MatchTeams from '../MatchTeams/MatchTeams';
import classes from './matches.module.scss';
import { MatchesList } from './MatchesList';
import { MatchesType } from './MatchFinall';


interface IMatchesBlock {
  title: string;
  matches: Array<MatchesType>;
  handlePaginate?: () => void;
  hasNext?: boolean;
  pagination?: boolean;
  showTour?: boolean;
  isAccordion?: boolean;
  isAccordionOpen?: boolean;
  tourList: FilterSelectOption[];
  activeKey?: string
}


const MatchesBlock = ({
  title,
  matches,
  handlePaginate,
  hasNext,
  pagination = false,
  showTour,
  isAccordion = false,
  isAccordionOpen = false,
  activeKey,
}:IMatchesBlock) => {
  const [ isOpen, setIsOpen ] = useState<boolean | undefined>(isAccordionOpen);
  const { currentStage } = useAppSelector(selectCurrentCup);


  // if (matches?.length === 1) {
  //   return (
  //     <>
  //       <MatchFinall match={matches[ 0 ] as MatchesType} />
  //     </>
  //   );
  // }


  if (matches?.length && activeKey === '2') {
    if (currentStage?.title === 'Финал' || currentStage?.title === '3 место') {
      return (
        <div className={classes.matchTeams}>
          <MatchTeams {...matches[ 0 ]} tour={''}/>
        </div>
      );
    }
  }
  if (!isAccordion) {
    return (
      <div className={classes.table}>
        <div className={classes.title}>
          <HTag level={5}>{title}</HTag>
        </div>
        <MatchesList
          matches={matches}
          handlePaginate={handlePaginate}
          hasNext={hasNext}
          pagination={pagination}
          showTour={showTour}
        />
      </div>
    );
  }

  return (
    <div className={classes.tableAccordion}>
      <div className={classes.title} onClick={() => setIsOpen(prev => !prev)}>
        <HTag level={5}>{title}</HTag>
        <Image
          className={`${classes.closeIcon} ${isOpen ? classes.open : classes.hide}`}
          src={arrowDown}
          alt='arrow down'
          width={24}
          height={24}
        />
      </div>
      <AnimatePresence>
        {(isOpen) && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: .2 }}
          >
            <MatchesList
              matches={matches}
              handlePaginate={handlePaginate}
              hasNext={hasNext}
              pagination={pagination}
              showTour={showTour}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default memo(MatchesBlock, (prevProps, nextProps) => {
  return prevProps.matches === nextProps.matches;
});
