import { useContractRead } from 'wagmi';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { formatEther } from 'viem';
import { getDailyReward, getMaxPayout, getPendingReward } from '../lib';
import { FAUCET_ADDRESS } from 'shared/config/blockchain';

export const useInfoFaucet = (id: number) => {
  const { data } = useContractRead({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'faucets',
    args: [id],
    watch: true,
    cacheTime: 10_000
  });
  const faucetInfo = data as bigint[];

  if (!faucetInfo) {
    return {
      lockedAmount: '0',
      claimedAmount: '0',
      MaxPayout: '0',
      pendingReward: '0',
      realDeposits: '0',
      dailyReward: '0',
      lastClaimed: 0
    };
  }

  //    uint    depositedAmount;
  //    uint    claimedAmount;
  //    uint    lastClaimed;
  //    uint    createdAt;
  const dailyReward = getDailyReward(faucetInfo?.[0]);

  return {
    lockedAmount: formattedIntegers(formatEther(faucetInfo?.[0])),
    claimedAmount: formattedIntegers(formatEther(faucetInfo?.[1])),
    maxPayout: getMaxPayout(faucetInfo?.[0]),
    pendingReward: formattedIntegers(getPendingReward(faucetInfo?.[0], faucetInfo?.[2])),
    realDeposits: formattedIntegers(formatEther(faucetInfo?.[4])),
    dailyReward: formattedIntegers(dailyReward),
    lastClaimed: Number(faucetInfo?.[2])
  };
};
