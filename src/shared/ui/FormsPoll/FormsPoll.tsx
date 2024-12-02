import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { AnswerItem } from '@/entities/Polls/type/pollsSchema';
import classes from './formsPoll.module.scss';


interface IFormsPoll {
  polls: AnswerItem[];
  isVoted: boolean;
  selectedOption: number | undefined;
  setSelectedOption: Dispatch<SetStateAction<number | undefined>>;
}

const FormsPoll = ({ polls, isVoted, selectedOption, setSelectedOption }: IFormsPoll) => {
  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>, id:number) => {
    setSelectedOption(id);
  };

  return (
    <form className={classes.form}>
      {polls?.map(poll =>
        <label
          key={poll.id}
          className={`${classes.label}
          ${selectedOption === poll.id && classes.checked}`}>
          <input
            className={classes.inputCheck}
            type="radio"
            value={poll.text}
            checked={selectedOption === poll.id}
            onChange={(e) => handleOptionChange(e, poll.id)}
          />
          <span className={classes.checkmark}></span>
          <span className={classes.text}>{poll.text}</span>
          {isVoted && <span className={classes.percentage}>{poll.percentage}</span>}
        </label>,
      )}

    </form>
  );
};

export default FormsPoll;
