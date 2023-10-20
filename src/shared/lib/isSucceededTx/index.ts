import { waitForTransaction } from '@wagmi/core';
import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';
import { Address, TransactionReceipt } from 'viem';

export const isStatusTX = async (hash: Address, successText: string) => {
  const waitApprove = await waitForTransaction({
    hash: hash
  });

  if (isSucceededTx(waitApprove)) {
    toast.success(successText);
  } else {
    toast.error(errors.TRANSACTION_FAILED);
  }
};

export const isSucceededTx = (waitTX: TransactionReceipt) => waitTX.status === 'success';
