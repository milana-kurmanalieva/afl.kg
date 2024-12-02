export interface BlackListTypeProps {
  id: number;
  team: number;
  team_name: string;
  reason: string;
  period_start: string;
  period_end: string;
  player_name?: number;
}

export interface BlackListType {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlackListTypeProps[];
}

export type BlackListTableProps = {
  title: string;
  data: BlackListTypeProps[];
}
