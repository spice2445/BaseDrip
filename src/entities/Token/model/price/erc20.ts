
import { BDRIP, USDC } from 'shared/config/blockchain';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { useGetRate } from 'shared/lib/get-rate';
import { formatEther } from 'viem';

export const useBdripPrice = (value: number = 1) => {
  const priceBdriptoUSDC = useGetRate({
    token0: BDRIP, // BDRIP
    token1: USDC, // USDC
    value
  });

  if (!priceBdriptoUSDC.rate) return '0';

  return formattedIntegers(formatEther(priceBdriptoUSDC.rate) ?? 0);
};
