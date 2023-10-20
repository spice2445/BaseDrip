import { useCallback, useState, useMemo } from 'react';
import { useInput } from 'shared/lib/input';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { useAccount, useContractWrite } from 'wagmi';
/* import { TIME_CLAIM } from '../config'; */
import { useBalanceChecks, useIsConnectedWallet } from 'shared/lib/additional-checks';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { useAllowance /* , useApprove */ } from 'entities/Token';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';
import { setStatusLoading } from 'shared/lib/isLoading';
import { parseEther } from 'viem';
import { FAUCET_ADDRESS, BDRIP } from 'shared/config/blockchain';

export const useActionFaucet = () => {
  const [value, _, onChangeInput] = useInput();
  const [isAction, setIsAction] = useState(false);
  const { allowance: depositAllowance } = useAllowance(BDRIP, FAUCET_ADDRESS);

  const isAllowanceEnoghtForDeposit = useMemo(() => {
    if (depositAllowance) {
      return BigInt(value) <= depositAllowance;
    }

    return false;
  }, [value, depositAllowance]);

  /*  const { approve } = useApprove(BDRIP, FAUCET_ADDRESS, amount); */
  const { address } = useAccount();
  const { writeAsync: claimAsync } = useContractWrite({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'claim'
  });
  const { writeAsync: depositAsync } = useContractWrite({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'deposit'
  });
  const checksBalance = useBalanceChecks();
  const IsConnectedWallet = useIsConnectedWallet();

  const onClickAction = () => {
    setIsAction(!isAction);
  };

  const claimAction = useCallback(
    (id: number, lastClaimed: number) => async () => {
      if (checksBalance()) return;
      if (IsConnectedWallet()) return;

      /*       if (Date.now() / 1000 - lastClaimed < 86400) {
        return toast.error(TIME_CLAIM);
      } */

      setStatusLoading(true);

      try {
        const claimSend = await claimAsync({
          args: [id.toString()]
        });

        await isStatusTX(claimSend.hash, success.CLAIMED);
      } catch (error: any) {
        toast.error(errors.ERROR);
      }

      setStatusLoading(false);
    },
    [claimAsync]
  );

  const depositAction = useCallback(
    (id: number) => async () => {
      if (+value === 0) {
        return toast.error(errors.EMPTY_VALUE);
      }
      if (IsConnectedWallet()) return;
      if (checksBalance()) return;
      setStatusLoading(true);

      try {
        const despoitSend = await depositAsync({
          args: [id.toString(), address, parseEther(value)]
        });
        await isStatusTX(despoitSend.hash, success.DEPOSITED);
      } catch (error: any) {
        toast.error(errors.ERROR);
      }

      setIsAction(false);
      setStatusLoading(false);
    },
    [depositAsync, value]
  );

  return {
    inputValue: value,
    isAction,
    isAllowanceEnoghtForDeposit,
    claimAction,
    depositAction,
    onChangeInput,
    onClickAction
  };
};
