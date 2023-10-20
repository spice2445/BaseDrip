import { useContractRead, useAccount } from 'wagmi';
import { getAccount } from '@wagmi/core';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { FAUCET_ADDRESS, client } from 'shared/config/blockchain';

export const useGetFaucets = () => {
  const { address } = useAccount();
  const { data: faucets } = useContractRead({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'getFaucetsOwnedByUser',
    args: [address],
    watch: true
  });
  console.log(faucets);

  if (!faucets) return [];

  return (faucets as BigInt[]).map((faucet) => Number(faucet)) as number[];
};

export const getFaucets = async () => {
  const { address } = getAccount();
  return (await client.readContract({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'getFaucetsOwnedByUser',
    args: [address]
  })) as bigint[];
};
