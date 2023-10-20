import { useCallback, useMemo, useState } from 'react';
import { client, walletClient } from 'shared/config/blockchain';
import { Address, useAccount } from 'wagmi';
import GARDEN_ABI from 'shared/assets/abi/Garden.json';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';

type DepositProps = {
  amount: bigint;
  onSuccess?: () => void;
  gardenAddress: Address;
};

export const useDeposit = ({ amount, onSuccess, gardenAddress }: DepositProps) => {
  const { address: account } = useAccount();

  const [loading, setLoading] = useState(false);

  const deposit = useCallback(async () => {
    if (!amount || !account || loading) return;
    setLoading(true);
    const { request } = await client.simulateContract({
      account,
      address: gardenAddress,
      abi: GARDEN_ABI,
      functionName: 'deposit',
      args: [amount]
    });
    walletClient
      .writeContract(request)
      .then(() => {
        onSuccess && onSuccess();
        toast.success(success.DEPOSITED);
      })
      .catch((error) => {
        console.log(error);
        toast.error(errors.TRANSACTION_FAILED);
      })
      .finally(() => setLoading(false));
  }, [account, onSuccess]);
  return useMemo(() => ({ loading, deposit }), [loading, deposit]);
};
