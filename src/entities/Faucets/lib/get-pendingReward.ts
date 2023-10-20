import { getDailyReward } from './get-dailyReward';

export const getPendingReward = (depositedAmount: bigint, lastClaimed: bigint) => {
  const dailyReward = getDailyReward(depositedAmount);

  return ((Date.now() / 1000 - Number(lastClaimed)) / 86400) * dailyReward;
};
