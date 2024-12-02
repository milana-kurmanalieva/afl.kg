import { Error, Status, THUNK_ANY } from '@/shared/lib/constants/constants';


export interface AnswerItem {
  id: number,
  text: string,
  link: string,
  votes_count: number,
  percentage: string | number,
}

export interface IPollsItem {
  id: number,
  title: string,
  question: string,
  answered: boolean,
  total_votes: number,
  created_at: string,
  answer_results: Array<AnswerItem>,
}

export interface IPollsState {
  polls: {
    count: number,
    next: string | null,
    results: Array<IPollsItem>,
  },
  pollsError: Error,
  pollsStatus: Status,

  pollsVote: THUNK_ANY,
  pollsVoteError: Error,
  pollsVoteStatus: Status,
}
