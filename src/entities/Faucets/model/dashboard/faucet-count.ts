import { useContractRead } from 'wagmi';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { FAUCET_MAX_COUNT } from '../../config';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { FAUCET_ADDRESS } from 'shared/config/blockchain';

export const useFaucetCount = (isNotString?: boolean) => {
  const { data: countFaucet } = useContractRead({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'faucetLastCreatedId',
    watch: true,
    cacheTime: 10_000
  });

  const NumberCountFaucet = Number(countFaucet);

  return isNotString ? NumberCountFaucet : `${formattedIntegers(NumberCountFaucet)} / ${FAUCET_MAX_COUNT}`;
};
