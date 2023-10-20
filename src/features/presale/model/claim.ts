import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import { setStatusLoading } from 'shared/lib/isLoading';
import { errorsClaim, defaultPresaleConfig, successPresale } from 'entities/Token';

import { useContractRead, useContractWrite } from 'wagmi';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { catchError } from 'shared/lib/catch-errors';
import { formatEther } from 'viem';

export const useClaimTokens = (deadline: number) => {
  const IsConnectedWallet = useIsConnectedWallet();
  const { writeAsync: claimTokensAsync } = useContractWrite({
    ...defaultPresaleConfig,
    functionName: 'claimTokens'
  });
  const { data: totalDepositData } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'totalEth'
  });
  const { data: softCapData } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'softCap'
  });

  const totalDeposit = +formatEther((totalDepositData as bigint) ?? 0n);
  const softCap = +formatEther((softCapData as bigint) ?? 0n);
  const isDisabledClaim = deadline > 0 && totalDeposit <= softCap;

  const claimAction = async () => {
    if (IsConnectedWallet()) return;
    setStatusLoading(true);

    try {
      const claimTokens = await claimTokensAsync();

      await isStatusTX(claimTokens.hash, successPresale.PURCHASE('Claim'));
    } catch (error) {
      console.log(error);
      catchError(String(error), errorsClaim);
    }
  };
  return { claimAction, isDisabledClaim };
};
