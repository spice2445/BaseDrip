import { formattedIntegers } from 'shared/lib/formatted-numbers';

export const useCirculatingSupply = () => {
  const CirculatingSupply = formattedIntegers(100_000_000);

  return CirculatingSupply;
};
