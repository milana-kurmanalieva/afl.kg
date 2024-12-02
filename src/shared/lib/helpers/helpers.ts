import { FieldAddressById, Field_hour } from '@/entities/Field/type/fieldSchema';
import { REQUEST_STATUSES, THUNK_ANY, API_BASE } from '../constants/constants';


interface IQueryCases<T> {
  status: T,
  data: T,
  error: T,
  options?: { concat: boolean }
}

interface IPayloadInterface {
  payload: any,
}

interface Builder {
  addCase: (actionCreator: string, reducer: (...arg: any) => void) => Builder
}

const resultsKey = 'results';
const count = 'count';


export const addQueryCases = (
  builder: Builder,
  thunk: THUNK_ANY,
  { status, data, error, options = { concat: false } }: IQueryCases<string>,
) => {
  builder
    .addCase(thunk.pending, (state: any) => {
      state[ status ] = REQUEST_STATUSES.REQUESTED;
    })
    .addCase(thunk.fulfilled, (state: any, { payload }: IPayloadInterface) => {
      state[ status ] = REQUEST_STATUSES.SUCCEEDED;

      if (payload === undefined) return;

      if (options.concat) {
        const items = payload.results ?? payload;

        for (const key in payload) {
          if (key === resultsKey) {
            state[ data ].results = [ ...state[ data ].results, ...items ];
            continue;
          }
          if (key === count) {
            state[ data ][ key ] += payload[ key ];
            continue;
          }
          state[ data ][ key ] = payload[ key ];
        }
      } else {
        state[ data ] = payload;
      }
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      state[ status ] = REQUEST_STATUSES.FAILED;
      state[ error ] = action.error;
    });
};

//FIX_ME use it to display the images, only in DEV stage
export const makeSrfImage = ({ src }: {src: string}) => {
  return API_BASE + src;
};

export const getYoutubeVideoId = (url: string): string | null => {
  const match = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return match ? match[ 1 ] || match[ 2 ] : null;
};

export const truncateText = (text: string, limit: number): string => {
  if (text.length > limit) return `${text.slice(0, limit)}...`;
  return text;
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};


export const getWorkHours = (field: FieldAddressById, date: Date) => {
  if (!field.reservations || !field.free_hours) return [];

  const now = new Date();
  const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

  const output: Array<string | Field_hour> = [];

  [ ...field.free_hours, ...field.reservations ]?.forEach((item: any) => {
    if (isToday && +item.from_time.slice(0, 2) <= now.getHours()) return;
    if (item.id) return output.push(item);
    if (!output.includes(item.from_time)) output.push(item.from_time);
    if (!output.includes(item.till_time)) output.push(item.till_time);
  });

  return output.sort((a, b) => {
    const aNumber = +(((a as Field_hour)?.from_time ?? a).slice(0, 2));
    const bNumber = +(((b as Field_hour)?.from_time ?? b).slice(0, 2));

    return aNumber - bNumber;
  }).filter((item, idx, arr) => {
    if (typeof item === 'object') return true;
    return (!(typeof arr[ idx + 1 ] === 'object') && typeof item === 'string');
  });
};

export const declensionOfGoods = (number: number) => {
  const cases = [
    2,
    0,
    1,
    1,
    1,
    2,
  ];
  // FIX_ME
  const titles = [
    'товар ',
    'товара ',
    'товаров ',
  ];
  const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ (number % 10 < 5) ? number % 10 : 5 ];
  return `${number} ${titles[ index ]}`;
};
