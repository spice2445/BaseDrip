import { BDRIP_COUNT, defaultPresaleConfig } from 'entities/Token/config';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';

export const useGetDataPresale = () => {
  const { data: totalTokensBought } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'totalTokensBought'
  });
  const { data: totalETHBought } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'totalEth'
  });
  const percentProgress = 100 - ((BDRIP_COUNT - +formatEther((totalTokensBought ?? 0n) as bigint)) * 100) / BDRIP_COUNT;
  return {
    percentProgress,
    totalEth: formattedIntegers(formatEther((totalETHBought ?? 0n) as bigint))
  };
};
