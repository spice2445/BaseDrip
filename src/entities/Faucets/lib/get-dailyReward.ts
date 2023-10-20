import { formatEther } from "viem";

export const getDailyReward = (depositedAmount: bigint) => {
    return +formatEther(depositedAmount) * 0.01;
}