import { formatEther } from 'viem';
import { useUserInfo } from './useInfoUser';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { NAME_BDRIP } from 'shared/config/constants';

export const useReceivedBDRIP = () => {
  const userInfoData = useUserInfo();
  const contributionETH = formattedIntegers(formatEther(userInfoData?.[3] ?? 0n));

  return `${contributionETH} $${NAME_BDRIP}`;
};
