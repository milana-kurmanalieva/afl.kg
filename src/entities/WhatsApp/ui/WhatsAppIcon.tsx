import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { selectPolls } from '@/entities/Polls/model/pollsSlice';
import { IPollsState } from '@/entities/Polls/type/pollsSchema';
import { getSupport, selectSupport } from '../model/supporSlice';
import classes from './whatsapp.module.scss';


const WhatsAppIcon = () => {
  const dispatch = useAppDispatch();
  const [ isSurveyCompleted, setIsSurveyCompleted ] = useState(false);
  const [ isTop, setIsTop ] = useState(false);
  const { polls }:IPollsState = useAppSelector(selectPolls);
  const { techLink } = useAppSelector(selectSupport);

  useEffect(() => {
    dispatch(getSupport());
  }, [ ]);

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    setIsSurveyCompleted(!localStorage.getItem('answered') && !!polls.results.length);

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        if (window.scrollY === 0) setIsTop(true);
        else setIsTop(false);
      });
    }
  }, [ polls.results.length ]);

  return (
    <div
      className={`${classes.icon} ${isSurveyCompleted ? classes.withPolls : ''}`}
    >
      {!isTop && <button onClick={handleScrollToTop} className={classes.topScroll}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff" xmlns="http://www.w3.org/2000/svg">
          {/* eslint-disable-next-line max-len */}
          <path d="M0.705993 7.0874L7.30599 0.487402C7.40599 0.387402 7.51433 0.316569 7.63099 0.274902C7.74766 0.233235 7.87266 0.212402 8.00599 0.212402C8.13933 0.212402 8.26433 0.233235 8.38099 0.274902C8.49766 0.316569 8.60599 0.387402 8.70599 0.487402L15.306 7.0874C15.4893 7.27074 15.5852 7.4999 15.5935 7.7749C15.6018 8.0499 15.506 8.2874 15.306 8.4874C15.1227 8.6874 14.8935 8.79157 14.6185 8.7999C14.3435 8.80824 14.106 8.7124 13.906 8.5124L9.00599 3.6124L9.00599 14.7874C9.00599 15.0707 8.91016 15.3082 8.71849 15.4999C8.52683 15.6916 8.28933 15.7874 8.00599 15.7874C7.72266 15.7874 7.48516 15.6916 7.29349 15.4999C7.10183 15.3082 7.00599 15.0707 7.00599 14.7874L7.00599 3.6124L2.10599 8.5124C1.92266 8.69574 1.68933 8.79157 1.40599 8.7999C1.12266 8.80824 0.889327 8.7124 0.705993 8.5124C0.505993 8.32907 0.405993 8.09573 0.405993 7.8124C0.405993 7.52907 0.505994 7.2874 0.705993 7.0874Z" fill="#fff">
          </path>
        </svg>
      </button>}

      <a
        href={techLink?.url ?? ''}
        target='_blank'
      >
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="WhatsAppIcon">
          {/* eslint-disable-next-line max-len */}
          <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z"></path>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppIcon;
