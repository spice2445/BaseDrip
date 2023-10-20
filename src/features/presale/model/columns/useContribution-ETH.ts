import { formatEther } from 'viem';
import { useUserInfo } from './useInfoUser';
import { formattedIntegers } from 'shared/lib/formatted-numbers';

export const useContributionETH = () => {
  const userInfoData = useUserInfo();
  const contributionETH = formattedIntegers(formatEther(userInfoData?.[2] ?? 0n));

  return contributionETH;
};
