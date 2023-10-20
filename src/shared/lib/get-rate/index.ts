import { ROUTER_ADDRESS } from 'shared/config/blockchain';
import ROUTER_ABI from 'shared/assets/abi/router.json';
import { Address, useContractRead } from 'wagmi';
import { parseUnits } from 'viem';

type UseGetRateProps = {
  token0: Address;
  token1: Address;
  value: number;
};

type UseGetRateReturnValue = {
  rate: bigint;
  error: Error | null;
  isLoading: boolean;
};
export const useGetRate = ({ token0, token1, value }: UseGetRateProps): UseGetRateReturnValue => {
  const { data, error, isLoading } = useContractRead({
    address: ROUTER_ADDRESS,
    abi: ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: [parseUnits(value.toString(), 18), [token0, token1]],
    watch: true,
    cacheTime: 10_000
  });

  const rate = Array.isArray(data) && data[1];

  return {
    rate,
    error,
    isLoading
  };
};
