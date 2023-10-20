import { BDRIP } from 'shared/config/blockchain/addresses';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { useAccount, useBalance } from 'wagmi';

export const useBalanceTokens = () => {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
    token: BDRIP,
    watch: true,
    cacheTime: 5_000
  });

  return {
    balance: data?.value,
    balanceFormatted: formattedIntegers(Number(data?.formatted))
  };
};
