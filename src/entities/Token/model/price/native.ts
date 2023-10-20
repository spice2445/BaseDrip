import { USDC, WBASE } from 'shared/config/blockchain';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { useGetRate } from 'shared/lib/get-rate';
import { formatEther } from 'viem';

export const useBasePrice = (value: number = 1) => {
  const priceBaseToUSDC = useGetRate({
    token0: WBASE, // wBASE,
    token1: USDC, // USDC,
    value
  });

  if (!priceBaseToUSDC.rate) return '0';

  return formattedIntegers(formatEther(priceBaseToUSDC.rate) ?? 0);
};
