import { defaultPresaleConfig } from 'entities/Token/config';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import { useUserInfo } from './useInfoUser';

export const useCountSpendEth = () => {
  const userInfoData = useUserInfo();
  const totalEthSpent = formatEther(userInfoData?.[2] ?? 0);
  const isWhitelistedUser = Number(userInfoData?.[1]);

  const { data: limitData } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'limits',
    args: [isWhitelistedUser]
  });

  const limitMax = formatEther((limitData as bigint[])?.[1] ?? 0);
  const countSpendEth = +limitMax - +totalEthSpent;

  return (countSpendEth > 0 ? countSpendEth : 0).toString();
};
