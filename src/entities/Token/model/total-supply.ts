import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { BDRIP_COUNT } from '../config';

export const useTotalSupply = () => {
  return formattedIntegers(BDRIP_COUNT);
};
