import { CHANGE_BUDDY_FEE, WrongETHForReferralFee, errosTeam, successTeam } from 'entities/Team';
import { useAccount, useBalance, useContractRead, useContractWrite } from 'wagmi';
import TeamAbi from 'shared/assets/abi/team.json';
import { setStatusLoading } from 'shared/lib/isLoading';
import { useRef } from 'react';
import { catchError } from 'shared/lib/catch-errors';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';
import { isAddress, parseEther } from 'viem';
import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import { TEAM_ADDRESS } from 'shared/config/blockchain';

export const useChangeBuddy = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: getCurrentReferral } = useContractRead({
    address: TEAM_ADDRESS,
    abi: TeamAbi,
    functionName: 'getCurrentReferral',
    args: [address]
  });
  const { writeAsync: setReferralAsync } = useContractWrite({
    address: TEAM_ADDRESS,
    abi: TeamAbi,
    functionName: 'setReferral'
  });
  const IsConnectedWallet = useIsConnectedWallet();

  const inputRef = useRef<HTMLInputElement>(null);

  const changeBuddy = async () => {
    if (!inputRef?.current) return;
    if (IsConnectedWallet()) return;
    const referralValue = inputRef.current.value;

    if (!isAddress(referralValue)) {
      return toast.error(errors.INVALID_ADDRESS);
    }

    if (getCurrentReferral && CHANGE_BUDDY_FEE > +(balance?.formatted ?? 0)) {
      return toast.error(WrongETHForReferralFee.message);
    }
    setStatusLoading(true);

    try {
      let valueSend = parseEther('0');
      if (getCurrentReferral) {
        valueSend = parseEther(CHANGE_BUDDY_FEE.toString());
      }

      const setReferralSend = await setReferralAsync({
        args: [referralValue],
        value: valueSend
      });

      await isStatusTX(setReferralSend.hash, successTeam.SET_BUDDY);
    } catch (error) {
      console.log(error);
      catchError(String(error), errosTeam);
    }
    inputRef.current.value = '';
    setStatusLoading(false);
  };

  return { changeBuddy, inputRef };
};
