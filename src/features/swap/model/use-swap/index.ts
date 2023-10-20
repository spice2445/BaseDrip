import { Address, FetchTokenResult } from '@wagmi/core';
import { useCallback, useMemo, useState } from 'react';
import { client, walletClient } from 'shared/config/blockchain';
import { useAccount } from 'wagmi';
import ROUTER_ABI from 'shared/assets/abi/router.json';
import { errors, success } from 'shared/config/message-toast';
import { toast } from 'react-toastify';

type SwapResult = {
  loading: boolean;
  error: Error | undefined;
  swap: () => Promise<void>;
};

export const useSwap = (
  token0: FetchTokenResult,
  token1: FetchTokenResult,
  amount0: bigint,
  amount1: bigint,
  ROUTER_ADDRESS: Address,
  onSuccess?: () => void
): SwapResult => {
  const { address: account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, _] = useState<Error>();

  const swap = useCallback(async () => {
    if (!token0 || !token1 || !amount0 || !amount1 || loading) return;

    setLoading(true);
    const { request } = await client.simulateContract({
      account,
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [amount0, amount1, [token0.address, token1.address], account, Math.floor(Date.now() / 1000) + 60 * 20]
    });

    walletClient
      .writeContract(request)
      .then(() => {
        onSuccess && onSuccess();
        toast.success(success.SWAPPED);
      })
      .catch(() => toast.error(errors.TRANSACTION_FAILED))
      .finally(() => setLoading(false));
  }, [account, amount0, amount1, onSuccess, token0, token1]);

  return useMemo(() => ({ loading, error, swap }), [loading, error, swap]);
};
