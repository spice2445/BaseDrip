import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { BDRIP, FAUCET_ADDRESS, MAX_UINT, ZERO_ADDRESS } from 'shared/config/blockchain';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { toast } from 'react-toastify';
import { useBalanceTokens } from 'entities/Faucets';
import { errors, success } from 'shared/config/message-toast';
import { setStatusLoading } from 'shared/lib/isLoading';
import { useBalanceChecks, useIsConnectedWallet } from 'shared/lib/additional-checks';
import { useInput } from 'shared/lib/input';
import { isStatusTX } from 'shared/lib/isSucceededTx';

export const useCreateFaucet = () => {
  const [valueDeposit, setDeposit, onChangeDeposit] = useInput();
  const { address } = useAccount();
  const bdripUser = useBalanceTokens();
  const { data: allowance } = useContractRead({
    address: BDRIP,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address ?? ZERO_ADDRESS, FAUCET_ADDRESS],
    watch: true,
    cacheTime: 2_000
  });

  const { writeAsync: approveAsync } = useContractWrite({
    address: BDRIP,
    abi: erc20ABI,
    functionName: 'approve'
  });
  const { writeAsync: depositAsync } = useContractWrite({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'deposit'
  });
  const checksBalance = useBalanceChecks();
  const IsConnectedWallet = useIsConnectedWallet();

  const isApprove = allowance ?? 0n >= parseEther(valueDeposit);

  const setValueDeposit = (type: 'max' | 'min') => () => {
    if (type === 'max') {
      setDeposit(formatEther((bdripUser.balance ?? 0) as bigint));
    } else {
      setDeposit('10');
    }
  };

  const action = async () => {
    if (Number(valueDeposit) <= 0) {
      return toast.error(errors.WRONG_VALUE);
    }

    if (+valueDeposit > +(bdripUser.balanceFormatted ?? 0)) {
      return toast.error(errors.INSUFFICIENT_BALANCE);
    }
    if (checksBalance()) return;
    if (IsConnectedWallet()) return;
    setStatusLoading(true);

    try {
      if (!isApprove) {
        const approveSend = await approveAsync({
          args: [FAUCET_ADDRESS, MAX_UINT]
        });

        await isStatusTX(approveSend.hash, success.APPROVED);
      }

      // deposit
      const valueSend = parseEther(valueDeposit);
      const depositSend = await depositAsync({
        args: [0, address, valueSend]
      });

      await isStatusTX(depositSend.hash, success.DEPOSITED);
    } catch (error: any) {
      console.log(error);
      toast.error(errors.ERROR);
    }

    setStatusLoading(false);
  };

  return {
    valueDeposit,
    allowance,
    isApprove,
    action,
    onChangeDeposit,
    setValueDeposit
  };
};
