import numeral from 'numeral';

export const formattedIntegers = (value: string | number, format?: string): string => {
  if (+value < 0.00001 && +value !== 0) {
    return '0';
  }

  const result = numeral(value).format('0,0[.][000]' ?? format);

  return result;
};
