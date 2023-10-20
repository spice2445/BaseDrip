import { Address, useAccount, useContractRead } from 'wagmi';
import GARDEN_ABI from 'shared/assets/abi/Garden.json';

export const useCanClaim = (gardenAddress: Address) => {
  const { address } = useAccount();

  const { data } = useContractRead({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'canClaim',
    args: [address],
    watch: true
  });

  return data as boolean;
};
