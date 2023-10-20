import { useCallback, useEffect, useMemo, useState } from 'react';
import { client } from 'shared/config/blockchain';
import { Address, erc20ABI, useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';

type AllowanceResult = {
  allowance: bigint | undefined;
  loading: boolean;
  error: Error | undefined;
  fetch: () => Promise<void>;
};

export const useAllowance = (tokenAddress: string | undefined, spenderAddress: string | undefined): AllowanceResult => {
  const [loading, setLoading] = useState(false);
  const [allowance, setAllowance] = useState<bigint>();
  const [error, setError] = useState<Error>();
  const { address: account } = useAccount();

  const fetch = useCallback(async () => {
    if (!tokenAddress || !spenderAddress) return;
    client
      .readContract({
        address: tokenAddress as Address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [account, spenderAddress]
      })
      .then((result: any) => setAllowance(BigInt(result)))
      .catch(() => toast.error(errors.ERROR))
      .finally(() => setLoading(false));
  }, [account, spenderAddress]);

  useEffect(() => {
    fetch();
  }, [tokenAddress, spenderAddress, fetch]);

  useEffect(() => {
    const interval = setInterval(fetch, 2000);
    return () => clearInterval(interval);
  }, [fetch]);

  return useMemo(() => ({ allowance, loading, error, fetch }), [allowance, loading, error, fetch]);
};
