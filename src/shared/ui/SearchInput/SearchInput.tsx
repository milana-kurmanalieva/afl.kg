import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { SearchResult } from '@/shared/lib/constants/constants';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { setSearchValue } from '@/entities/SearchHeader/model/searchHeaderSlice';
import { Input } from '../Input/Input';
import SearchIcon from '../SearchIcon/SearchIcon';
import { CloseIcon } from '../CloseIcon/CloseIcon';
import classes from './search.module.scss';


type searchFunction = (result?: SearchResult) => void;

interface ISearchInput extends InputHTMLAttributes<HTMLInputElement> {
  hints: Array<SearchResult>;
  searchKeys: Array<string>
  value: string;
  placeholder?: string;
  onFoundItemClick: (result?: SearchResult) => any | Promise<any>;
  onEnter: searchFunction;
  onClose: () => void;
}

export const SearchInput = ({
  hints,
  value,
  placeholder,
  searchKeys,
  onChange,
  onEnter,
  onFoundItemClick,
  onClose,
  ...props
}:ISearchInput) => {
  const { t } = useTranslation();
  const [ isSearching, setIsSearching ] = useState<boolean>(!!value);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
    setIsSearching(false);
    dispatch(setSearchValue(''));
  };

  const handleOnFoundItem = async (result: SearchResult) => {
    await onFoundItemClick(result);
    handleClose();
  };

  const handleLoadingComplete = useDebounce(() => {
    setIsLoading(false);
  }, 1000);

  const handleSetLoading = () => {
    setIsLoading(true);
    handleLoadingComplete();
  };

  useEffect(() => {
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (value.length !== 0) {
      setIsSearching(true);
      handleSetLoading();
    } else setIsSearching(false);
  }, [ value ]);

  useEffect(() => {
    setTimeout(() => setIsSearching(false));
  }, []);

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onEnter(hints[ 0 ]);
      }} className={classes.search}>
        <Input
          containerClassName={isSearching ? classes.searchedInput : ''}
          value={value}
          onFocus={() => setIsSearching(true)}
          onChange={(e) => {
            if (typeof onChange !== 'function') return;
            if (!e.target.value) onClose();
            onChange(e);
          }}
          onBlur={() => setTimeout(() => setIsSearching(false), 100)}
          placeholder={placeholder}
          startIcon={<SearchIcon onClick={() => onEnter()}/>}
          endIcon={
            (isSearching && !!value.length) &&
             <button className={classes.closeBtn} type='button' onClick={handleClose}>
               <CloseIcon/>
             </button>
          }
          {...props}
        />
        {isSearching && value.length > 2 && (
          <ul className={classes.searchList}>
            {hints.map(((result) => {

              const key = searchKeys.find(key => {
                return !!result[ key ] ;
              });

              if (!key) return '';

              let title = result[ key ].toString();

              if (title) title = title.toString().toLocaleLowerCase();

              const id = result.id;

              const matched = title.match(value.toLowerCase());
              const start = matched?.index;
              const string = matched?.input;

              if (!matched || !string || start === undefined) return '';

              const before = string.slice(0, start);
              const searched = string.slice(start, start + value.length);
              const after = string.slice(start + value.length);

              return (
                <li onClick={() => handleOnFoundItem({ title, id })} key={id}>
                  {before}
                  <span>{searched}</span>
                  {after}
                </li>
              );
            }))}
            {isSearching && !hints.length && !isLoading &&
            <li className={classes.noResults}>{t('noResultsFound')}</li>}
          </ul>
        )}
      </form>
    </div>
  );
};
