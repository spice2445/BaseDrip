import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { formatEther } from 'viem';

export const getMaxPayout = (depositedAmount: bigint) => formattedIntegers(+formatEther(depositedAmount) * 0.01 * 365);
