import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Dispatch, FormEvent, MouseEvent, SetStateAction, useRef, useState } from 'react';
import FormsPoll from '@/shared/ui/FormsPoll/FormsPoll';
import closeIcon from '@/shared/assets/icons/closeDark.svg';
import { Button } from '@/shared/ui/Button/Button';
import { BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import { IPollsItem } from '../../../type/pollsSchema';
import classes from '../modals.module.scss';


interface IModalPolls {
  setCanClose: Dispatch<SetStateAction<boolean>>;
  polls: { count: number; next: string | null; results: IPollsItem[]; };
  isVoted: boolean;
  selectedOption?: number;
  setSelectedOption: Dispatch<SetStateAction<number | undefined>>;
  handleSubmit: (event: FormEvent<HTMLButtonElement>) => null | undefined;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  isButtonDisabled: boolean;
}

const ModalPolls = ({
  setCanClose,
  polls,
  isVoted,
  selectedOption,
  setSelectedOption,
  handleSubmit,
  setModalOpen,
  isButtonDisabled,
}: IModalPolls) => {
  const { t } = useTranslation();

  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [ isAnswered, setIsAnswered ] = useState<boolean>(false);

  const handleVote = (e:FormEvent<HTMLButtonElement>) => {
    setIsAnswered(true);
    handleSubmit(e);
    localStorage.setItem('answered', 'true');
  };

  const handleVotedClose = () => {
    if (isAnswered) {
      setModalOpen(false);
      return;
    }
    setCanClose(true);
  };

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      handleVotedClose();
    }
  };

  return (
    <div onClick={handleClickOutside} className={classes.modalOverlay} ref={modalOverlayRef}>
      <div className={classes.modal} ref={modalContentRef}>
        <div className={classes.top}>
          <div className={classes.titleBlock}>
            <div className={classes.title}>{polls.results[ 0 ]?.title}</div>
            <button onClick={handleVotedClose} className={classes.closeBtn}>
              <Image
                className={classes.closeIcon}
                src={closeIcon}
                alt='close'
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className={classes.topDescription}>
            {polls.results[ 0 ]?.question}?
          </div>
          <FormsPoll
            polls={polls.results[ 0 ]?.answer_results}
            isVoted={isVoted}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>

        <div className={classes.bottom}>
          <div className={classes.buttons}>
            {!isVoted
              ?
              <>
                <Button onClick={handleVotedClose} variant={BUTTON_VARIANTS.OUTLINED}>{t('cancel')}</Button>
                <Button
                  onClick={handleVote}
                  disabled={isButtonDisabled}
                >{t('vote')}</Button>
              </>
              :
              <Button onClick={() => setModalOpen(false)}>{t('close')}</Button>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPolls;
