import { useCallback, useEffect, useMemo, useState } from 'react';
import { client } from 'shared/config/blockchain';
import { Address, erc20ABI, useAccount } from 'wagmi';
import { errors } from 'shared/config/message-toast';
import { toast } from 'react-toastify';

type TokenBalanceResult = {
  fetchBalance: () => void;
  balance: bigint | undefined;
  loading: boolean;
  error: Error | undefined;
};

export const useBalance = (tokenAddress: Address | undefined): TokenBalanceResult => {
  const [balance, setBalance] = useState<bigint>();
  const [loading, setLoading] = useState(false);
  const { address: account } = useAccount();
  const [error, _] = useState<Error>();

  const fetch = useCallback(() => {
    if (!account || !tokenAddress) return;
    setLoading(true);
    client
      .readContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account]
      })
      .then((result: any) => setBalance(BigInt(result)))
      .catch(() => toast.error(errors.ERROR))
      .finally(() => setLoading(false));
  }, [tokenAddress, account]);

  useEffect(() => {
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [tokenAddress, fetch]);

  return useMemo(() => ({ fetchBalance: fetch, balance, loading, error }), [fetch, balance, loading, error]);
};
