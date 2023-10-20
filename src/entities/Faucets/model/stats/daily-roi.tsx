import { useEffect, useState } from 'react';
import { FAUCET_ADDRESS, client } from 'shared/config/blockchain';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { getDailyReward } from 'entities/Faucets';
import { initialState } from '.';
import { getFaucets } from '../getFaucets';

export const useDailyROI = () => {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    async function fetchDailyROI() {
      let DailyROI = 0;
      const faucets = await getFaucets();

      for (const id of faucets) {
        const faucetInfo = (await client.readContract({
          address: FAUCET_ADDRESS,
          abi: FAUCET_ABI,
          functionName: 'faucets',
          args: [id]
        })) as bigint[];

        DailyROI += getDailyReward(faucetInfo[0]);
      }

      setData({
        tokens: formattedIntegers(DailyROI),
        usdc: formattedIntegers(DailyROI * 0)
      });
    }

    fetchDailyROI();
  }, []);

  return data;
};
