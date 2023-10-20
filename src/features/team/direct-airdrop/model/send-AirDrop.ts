import { useRef } from 'react';
import { erc20ABI, useAccount, useBalance, useContractWrite } from 'wagmi';
import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';
import { BDRIP, TEAM_ADDRESS } from 'shared/config/blockchain';
import { Address, isAddress, parseEther } from 'viem';
import { setStatusLoading } from 'shared/lib/isLoading';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import TEAM_ABI from 'shared/assets/abi/team.json';

export const useSendAirDrop = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address, token: BDRIP });
  const addressRef = useRef<HTMLInputElement>(null);
  const faucetIdRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const { writeAsync: airDropAsync } = useContractWrite({
    abi: TEAM_ABI,
    address: TEAM_ADDRESS,
    functionName: 'directAirDrop'
  });
  const IsConnectedWallet = useIsConnectedWallet();

  const action = async () => {
    if (IsConnectedWallet()) return;
    if (!addressRef?.current || !amountRef?.current || !faucetIdRef?.current) return;
    const addressSend = addressRef?.current.value as Address;
    const valueSend = amountRef?.current.value as string;
    const faucetId = faucetIdRef?.current.value as string;
    if (!isAddress(addressSend)) return toast.error(errors.INVALID_ADDRESS);
    if (!Number(faucetId)) return toast.error(errors.WRONG_VALUE);

    if (+(balance?.formatted ?? 0) < +valueSend) {
      return toast.error(errors.INSUFFICIENT_BALANCE);
    }

    setStatusLoading(true);

    try {
      const sendAirDrop = await airDropAsync({
        args: [addressSend, parseEther(valueSend), +faucetId]
      });

      await isStatusTX(sendAirDrop.hash, success.TRANSFER);
      amountRef.current.value = '';
      faucetIdRef.current.value = '';
      addressRef.current.value = '';
    } catch (error) {}

    setStatusLoading(false);
  };
  return { action, addressRef, faucetIdRef, amountRef };
};
