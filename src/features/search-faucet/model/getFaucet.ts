import { getDailyReward, getMaxPayout, getPendingReward, useFaucetCount } from 'entities/Faucets';
import { useState } from 'react';
import { useInput } from 'shared/lib/input';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { toast } from 'react-toastify';
import { errors } from '../config';
import { FAUCET_ADDRESS } from 'shared/config/blockchain';

export const useGetfaucet = () => {
  const [id, _, onChangeId] = useInput();
  const [currentId, setCurrentId] = useState('0');
  const [faucet, setFaucet] = useState<any>(null);
  const { refetch } = useContractRead({
    address: FAUCET_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'faucets',
    args: [currentId],
    watch: true,
    cacheTime: 10_000
  });
  const countFaucet = useFaucetCount(true);

  const action = async () => {
    if (!id) {
      return toast.error(errors.ENTER_ID);
    }

    if (+id <= 0 || +id > +countFaucet) {
      return toast.error(errors.NO_SUCH_FAUCET);
    }

    setCurrentId(id);
    const faucetSearch = await refetch();
    const faucetData = faucetSearch.data as bigint[];

    setFaucet({
      id,
      LockedAmount: formattedIntegers(formatEther(faucetData?.[0])),
      Claimed: formattedIntegers(formatEther(faucetData?.[1])),
      MaxPayout: getMaxPayout(faucetData?.[0]),
      PendingRewards: formattedIntegers(getPendingReward(faucetData?.[0], faucetData?.[2])),
      DailyRewards: formattedIntegers(getDailyReward(faucetData?.[0]))
    });
  };

  return { id, faucet, onChangeId, action };
};
