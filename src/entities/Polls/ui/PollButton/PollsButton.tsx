import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import PollsModal from '../PollModal/PollsModal';
import { getPollsList, resetPolls, selectPolls } from '../../model/pollsSlice';
import { IPollsState } from '../../type/pollsSchema';
import classes from './pollsButton.module.scss';


const PollsButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { leagueId }:currentLeagueState = useAppSelector(selectCurrentLeague);
  const { polls }:IPollsState = useAppSelector(selectPolls);

  const [ isModalOpen, setModalOpen ] = useState<boolean>(false);
  const [ isModal, setIsModal ] = useState<boolean>(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const isSurveyCompleted = localStorage.getItem('answered');
    setIsModal(!isSurveyCompleted);
  }, [ isModalOpen ]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [ isModalOpen ]);

  useEffect(() => {
    dispatch(getPollsList({ id: leagueId, page: 1 }));

    return () => {
      dispatch(resetPolls());
    };
  }, [ ]);

  if (isModal && polls.results.length) {
    return (
      <>
        <button onClick={handleButtonClick} className={classes.pollBtn}>
          {t('askPoll')}
        </button>
        { isModalOpen
        &&
        <PollsModal setModalOpen={setModalOpen}/>}
      </>
    );
  }

  return <></>;
};

export default PollsButton;
