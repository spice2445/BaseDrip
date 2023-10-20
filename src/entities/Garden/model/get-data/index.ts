import { Address, useAccount, useContractRead } from 'wagmi';
import GARDEN_ABI from 'shared/assets/abi/Garden.json';

type DataReturnValue = {
  depositedAmount: bigint;
  claimedAmount: bigint;
  compoundAmount: bigint;
  compoundCount: bigint;
  lastClaimed: bigint;
  claimableAmount: bigint;
  compoundableAmount: bigint;
  createdAt: bigint;
};
export const useGetData = (gardenAddress: Address): DataReturnValue => {
  const { address } = useAccount();
  const { data } = useContractRead({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'accounts',
    args: [address],
    watch: true
  });

  const { data: claimableAmount } = useContractRead({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'getClaimableAmount',
    args: [address],
    watch: true
  });

  const { data: compoundableAmount } = useContractRead({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'getCompoundableAmount',
    args: [address],
    watch: true
  });
  const result: any = data;

  return {
    depositedAmount: result && result[0],
    claimedAmount: result && result[1],
    compoundAmount: result && result[2],
    compoundCount: result && result[3],
    lastClaimed: result && result[4],
    claimableAmount: claimableAmount as bigint,
    compoundableAmount: compoundableAmount as bigint,
    createdAt: result && result[5]
  };
};
