import { successPresale, errorsPresale, defaultPresaleConfig } from 'entities/Token';
import { useInput } from 'shared/lib/input';
import { useAccount, useBalance, useContractRead, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import { setStatusLoading } from 'shared/lib/isLoading';
import { errors } from 'shared/config/message-toast';
import { toast } from 'react-toastify';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { catchError } from 'shared/lib/catch-errors';
import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import { useCountSpendEth } from './columns';

export const usePurchase = () => {
  const [token0, setToken0, onChangeToken0] = useInput();
  const { address } = useAccount();
  const { data: balanceUser } = useBalance({
    address
  });
  const { data: endTime } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'endTime'
  });
  const { writeAsync: joinPresaleAsync } = useContractWrite({
    ...defaultPresaleConfig,
    functionName: 'joinPresale'
  });
  const limitMax = useCountSpendEth();
  const IsConnectedWallet = useIsConnectedWallet();

  const deadline = Number(new Date(Number(endTime) * 1000)) - Number(Date.now());

  const setMaxPresale = () => {
    const maxInput = +limitMax > +(balanceUser?.formatted ?? 0) ? balanceUser?.formatted : limitMax;
    setToken0(String(maxInput));
  };

  const action = async () => {
    if (IsConnectedWallet()) return;
    if (+token0 < 0 || !+token0) {
      return toast.error(errors.EMPTY_VALUE);
    }
    if (+token0 > Number(balanceUser?.formatted) || !+token0) {
      return toast.error(errors.INSUFFICIENT_BALANCE);
    }
    setStatusLoading(true);

    try {
      const joinPresaleSend = await joinPresaleAsync({
        value: parseEther(token0)
      });

      await isStatusTX(joinPresaleSend.hash, successPresale.PURCHASE);
    } catch (error) {
      console.log(error);
      catchError(String(error), errorsPresale);
    }

    setStatusLoading(false);
  };

  return {
    token0,
    deadline,
    action,
    setMaxPresale,
    onChangeToken0
  };
};
