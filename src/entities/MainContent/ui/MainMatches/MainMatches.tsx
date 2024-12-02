import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { getAllMatches, getTransferredMatches, selectDivisions } from '@/entities/Divisions/model/DivisionSlice';
import MatchesBlock from '@/shared/ui/Matches/MatchesBlock';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import classes from './matches.module.scss';


const MainMatches = () => {
  const dispatch = useAppDispatch();

  const { divisions, allDivisionsMatches } = useAppSelector(selectDivisions);
  const { leagues } = useAppSelector(selectCurrentLeague);

  useEffect(() => {
    if (!allDivisionsMatches.length) {
      Promise.all([ dispatch(getAllMatches(divisions)), dispatch(getTransferredMatches(leagues)) ]);
    }

  }, [
    allDivisionsMatches.length,
    leagues,
    dispatch,
    divisions,
  ]);

  return (
    <ul className={classes.matches}>
      {allDivisionsMatches && allDivisionsMatches.map((data, idx) => (
        !!data.result.data.data.length && (
          <li key={data.division.id}>
            <MatchesBlock
              isAccordionOpen={idx === 0}
              isAccordion
              matches={data.result.data.data}
              title={`${data.division.title} - ${data.division.tour.number} тур`}
              tourList={[]}
            />
          </li>
        )
      ))}
      {/* {!!transferredMatches.length && <li>
        {transferredMatches.map((data, idx) => (
          !!data.result.data.data.length && (
            <MatchesBlock
              key={idx}
              isAccordion
              matches={data.result.data.data}
              title='Перенесенные матчи'
            />
          )
        ))}
      </li>} */}
    </ul>
  );
};

export default MainMatches;
