import { useCallback, useMemo, useState } from 'react';
import { client, walletClient } from 'shared/config/blockchain';
import { Address, useAccount } from 'wagmi';
import GARDEN_ABI from 'shared/assets/abi/Garden.json';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';

export const useCompound = (gardenAddress: Address) => {
  const { address: account } = useAccount();

  const [loading, setLoading] = useState(false);

  const compound = useCallback(async () => {
    if (!account || loading) return;
    setLoading(true);
    const { request } = await client.simulateContract({
      account,
      address: gardenAddress,
      abi: GARDEN_ABI,
      functionName: 'compound'
    });
    walletClient
      .writeContract(request)
      .then(() => {
        toast.success(success.COMPOUNDED);
      })
      .catch(() => toast.error(errors.TRANSACTION_FAILED))
      .finally(() => setLoading(false));
  }, [account]);
  return useMemo(() => ({ loading, compound }), [loading, compound]);
};
