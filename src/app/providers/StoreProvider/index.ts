import { createReduxStore, wrapper } from './config/store';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import type { RootState } from './config/store';


export {
  createReduxStore,
  useAppDispatch,
  useAppSelector,
  RootState,
  wrapper,
};
