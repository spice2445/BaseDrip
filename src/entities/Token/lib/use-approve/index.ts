import { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { Address, erc20ABI, writeContract } from '@wagmi/core';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';

type TokenApprovalResult = {
  loading: boolean;
  error: Error | undefined;
  approve: () => Promise<void>;
};

export const useApprove = (
  tokenAddress: Address | undefined,
  spenderAddress: Address,
  amount: bigint | undefined,
  onSuccess?: () => void
): TokenApprovalResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const { address: account } = useAccount();

  const approve = useCallback(async () => {
    if (loading || !tokenAddress || !amount) return;

    setError(undefined);
    setLoading(true);

    try {
      const { hash } = await writeContract({
        account,
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spenderAddress, amount]
      });

      await isStatusTX(hash, success.APPROVED);
    } catch (err) {
      console.error(err);
      toast.error(errors.TRANSACTION_FAILED);
    }
    setLoading(false);
  }, [loading, amount, spenderAddress, onSuccess]);

  return useMemo(() => ({ loading, error, approve }), [approve, error, loading]);
};
