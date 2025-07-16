import { format, addDays } from 'date-fns';

export const getDatetime = (pattern: string = 'yyyy-MM-dd', offsetDays: number = 0): string => {
  const target = addDays(new Date(), offsetDays);
  return format(target, pattern);
};
