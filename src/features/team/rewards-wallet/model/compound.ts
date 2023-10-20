import { useRef } from 'react';
import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import TEAM_ABI from 'shared/assets/abi/team.json';
import { useAccount, useContractWrite } from 'wagmi';
import { TEAM_ADDRESS } from 'shared/config/blockchain';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';
import { setStatusLoading } from 'shared/lib/isLoading';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { catchError } from 'shared/lib/catch-errors';
import { errorsRewardsWallet } from '../config';

export const useCompound = () => {
  const idFaucetInput = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const { writeAsync: compoundAsync } = useContractWrite({
    abi: TEAM_ABI,
    address: TEAM_ADDRESS,
    functionName: 'compoundReferral'
  });
  const IsConnectedWallet = useIsConnectedWallet();

  const actionCompound = async () => {
    if (IsConnectedWallet()) return;
    if (!idFaucetInput?.current) return;
    const idFaucet = Number(idFaucetInput?.current.value as string);
    if (!idFaucet) {
      return toast.error(errors.WRONG_VALUE);
    }

    setStatusLoading(true);
    try {
      for (let indexFaucet = 0; indexFaucet <= idFaucet; indexFaucet++) {
        const sendAirDrop = await compoundAsync({
          args: [address, BigInt(idFaucet)]
        });

        await isStatusTX(sendAirDrop.hash, success.COMPOUNDED);
      }
      idFaucetInput.current.value = '';
    } catch (error) {
      catchError(String(error), errorsRewardsWallet);
    }
    setStatusLoading(false);
  };

  return { idFaucetInput, actionCompound };
};
