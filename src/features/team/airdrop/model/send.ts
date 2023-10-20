import { useRef } from 'react';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';
import TeamAbi from 'shared/assets/abi/team.json';
import { BDRIP, MAX_UINT, TEAM_ADDRESS, ZERO_ADDRESS } from 'shared/config/blockchain';
import { useIsConnectedWallet } from 'shared/lib/additional-checks';
import { toast } from 'react-toastify';
import { errors, success } from 'shared/config/message-toast';
import { setStatusLoading } from 'shared/lib/isLoading';
import { formatEther, parseEther } from 'viem';
import { isStatusTX } from 'shared/lib/isSucceededTx';
import { getAidropAddresses } from '../lib';

export const useAirDropTeam = () => {
  const { address } = useAccount();
  const { writeAsync: airDropAsync } = useContractWrite({
    address: TEAM_ADDRESS,
    abi: TeamAbi,
    functionName: 'airdrop'
  });
  const { data: allowanceData } = useContractRead({
    address: BDRIP,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address ?? ZERO_ADDRESS, TEAM_ADDRESS],
    watch: true,
    cacheTime: 2_000
  });
  const { writeAsync: approveAsync } = useContractWrite({
    address: BDRIP,
    abi: erc20ABI,
    functionName: 'approve'
  });

  const IsConnectedWallet = useIsConnectedWallet();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const actionSend = async () => {
    if (!textareaRef?.current || !amountRef?.current) return;
    if (IsConnectedWallet()) return;
    const textareaValue = textareaRef.current.value;
    const amountValue = +amountRef.current.value;

    if (amountValue <= 0) {
      amountRef.current.value = '';
      return toast.error(errors.WRONG_VALUE);
    }

    const aidropAddresses = getAidropAddresses(textareaValue);
    if (!aidropAddresses[1]) {
      textareaRef.current.value = '';
      return toast.error(errors.WRONG_VALUE);
    }

    const allowance = +formatEther((allowanceData ?? 0n) as bigint);
    const isApprove = allowance > amountValue;

    if (!isApprove) {
      const approveSend = await approveAsync({
        args: [TEAM_ADDRESS, MAX_UINT]
      });

      await isStatusTX(approveSend.hash, success.APPROVED);
    }

    setStatusLoading(true);

    try {
      const valueSend = parseEther(amountValue.toString());

      const airDropSend = await airDropAsync({
        args: [aidropAddresses[0], valueSend]
      });

      await isStatusTX(airDropSend.hash, success.AIRDROP);
    } catch (error) {}
    amountRef.current.value = '';
    textareaRef.current.value = '';

    setStatusLoading(false);
  };

  return { actionSend, textareaRef, amountRef };
};
