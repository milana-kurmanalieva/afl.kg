import React, { FC, useRef } from 'react';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick';
import SearchIcon from '@/shared/ui/SearchIcon/SearchIcon';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import classes from './search.module.scss';
import { SearchInputWithResults } from './SearchInputWithResults';


interface ISearchInput {
  isInputActive: boolean;
  onToggleInput: () => void;
  onClose: () => void;
}

type searcherRefType = HTMLDivElement | null;

const SearchHeader: FC<ISearchInput> = ({ isInputActive, onToggleInput, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 820px)');
  const searcherRef = useRef<searcherRefType>(null);

  useOutsideClick<searcherRefType>(searcherRef, onClose, isInputActive && isMobile);

  return (
    <div ref={searcherRef} className={classes.searcher}>
      {!isInputActive && isMobile && (
        <div className={classes.searchIcon} onClick={onToggleInput}>
          <SearchIcon />
        </div>
      )}

      <SearchInputWithResults isInputActive={isInputActive} onClose={onClose}/>
    </div>
  );
};
export default SearchHeader;
