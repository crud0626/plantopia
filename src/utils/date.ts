import { Timestamp } from 'firebase/firestore';
import format from 'date-fns/format';

interface FirebaseDate {
  nanoseconds: number;
  seconds: number;
}

export const formatFullDate = (date: Date, sep = '-') => {
  return format(date, `yyyy${sep}MM${sep}dd`);
};

export const secondsToDateStr = (target: FirebaseDate | number) => {
  const sec = typeof target === 'number' ? target : target.seconds;
  const date = new Date(sec * 1000);

  return formatFullDate(date);
};

export const dateStrToTimestamp = (dateString: string) => {
  return Timestamp.fromDate(new Date(dateString));
};
