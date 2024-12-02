import { FormEvent, useState, Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { THUNK_ANY } from '@/shared/lib/constants/constants';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { currentLeagueState } from '@/entities/CurrentLeague/type/leagueSchema';
import { selectCurrentLeague } from '@/entities/CurrentLeague/model/CurrentLeague';
import { getPollsList, postPollsVote, selectPolls } from '../../model/pollsSlice';
import { IPollsState } from '../../type/pollsSchema';
import ModalPolls from '../Modals/ModalPolls/ModalPolls';
import ModalCanClose from '../Modals/ModalCanClose/ModalCanClose';


interface IPollsModal {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const PollsModal = ({ setModalOpen }:IPollsModal) => {
  const dispatch = useAppDispatch();

  const { polls }:IPollsState = useSelector(selectPolls);
  const { leagueId }:currentLeagueState = useSelector(selectCurrentLeague);

  const [ canClose, setCanClose ] = useState<boolean>(false);
  const [ selectedOption, setSelectedOption ] = useState<number | undefined>(undefined);
  const [ isVoted, setIsVoted ] = useState<boolean>(false);

  const isButtonDisabled = selectedOption === undefined && true;

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isButtonDisabled) return null;

    dispatch(postPollsVote({
      id: leagueId,
      poll_pk: polls.results[ 0 ].id,
      answer_id: selectedOption,
    }) as THUNK_ANY);
    dispatch(getPollsList({ id: leagueId, page: 1 }));

    setIsVoted(true);
  };

  return (
    !canClose
      ?
      <ModalPolls
        setCanClose={setCanClose}
        polls={polls}
        isVoted={isVoted}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        handleSubmit={handleSubmit}
        setModalOpen={setModalOpen}
        isButtonDisabled={isButtonDisabled}
      />
      :
      <ModalCanClose
        setModalOpen={setModalOpen}
        setCanClose={setCanClose}
      />
  );
};

export default PollsModal;
