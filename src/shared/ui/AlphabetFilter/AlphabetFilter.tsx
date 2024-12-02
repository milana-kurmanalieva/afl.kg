import React, { FC } from 'react';
import classes from './filter.module.scss';


const alphabetList = [
  'А-Г',
  'Д-Ж',
  'З-К',
  'Л-О',
  'П-Т',
  'У-Ц',
  'Ч-Щ',
  'Ы-Я',
];

interface IAlphabetFilter {
  value: string;
  setValue: (prev: string) => void;
}

export const AlphabetFilter: FC<IAlphabetFilter> = ({ value, setValue }) => {
  const handleFilterByLetter = (letterValue: string) => {
    if (letterValue === value) return setValue('');
    setValue(letterValue);
  };

  return (
    <ul className={classes.letters}>
      {alphabetList.map((item, index) => (
        <li
          onClick={() => handleFilterByLetter(item)}
          key={item}
        >
          <p className={`${value === item ? classes.active : ''}`}>
            {item}
          </p>
          {alphabetList.length - 1 !== index && <span>,</span>}
        </li>
      ))}
    </ul>
  );
};
