import moment from 'moment';

export const timeFromNowFormat = (date: string) => {
  const targetDate = moment(date);

  if (targetDate.isSame(moment().add(1, 'day'), 'day')) return 'Tomorrow';

  if (targetDate.isSame(moment(), 'day')) return 'Today';

  if (targetDate.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';

  if (targetDate.isSame(moment(), 'year'))
    return targetDate.format('dddd, DD/MM');

  return targetDate.format('dddd, DD/MM/YYYY');
};
