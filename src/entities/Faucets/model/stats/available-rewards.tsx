import { useEffect } from 'react';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { FAUCET_ADDRESS, client } from 'shared/config/blockchain';
import { getPendingReward } from 'entities/Faucets/lib';
import { useState } from 'react';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { initialState } from '.';
import { getFaucets } from '../getFaucets';

export const useAvailableRewards = () => {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    async function fetchAvailableRewards() {
      let availableRewards = 0;

      const faucets = await getFaucets();

      for (const id of faucets) {
        const faucetInfo = (await client.readContract({
          address: FAUCET_ADDRESS,
          abi: FAUCET_ABI,
          functionName: 'faucets',
          args: [id]
        })) as bigint[];

        const pendingReward = getPendingReward(faucetInfo?.[0], faucetInfo?.[2]);
        availableRewards += pendingReward;
      }

      setData({
        tokens: formattedIntegers(availableRewards),
        usdc: formattedIntegers(availableRewards * 0)
      });
    }

    fetchAvailableRewards();
  }, []);

  return data;
};
