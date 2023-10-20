import { useEffect, useState } from 'react';
import { getFaucets } from '../getFaucets';
import { FAUCET_ADDRESS, client } from 'shared/config/blockchain';
import FAUCET_ABI from 'shared/assets/abi/Faucet.json';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { formatEther } from 'viem';
import { initialState } from '.';

export const useTotalLocked = () => {
  const [data, setData] = useState(initialState);

  useEffect(() => {
    async function fetchTotalLocked() {
      let TotalLocked = 0;
      const faucets = await getFaucets();
      for (const id of faucets) {
        const faucetInfo = (await client.readContract({
          address: FAUCET_ADDRESS,
          abi: FAUCET_ABI,
          functionName: 'faucets',
          args: [id]
        })) as bigint[];

        TotalLocked += +formatEther(faucetInfo[0]);
      }

      setData({
        tokens: formattedIntegers(TotalLocked),
        usdc: formattedIntegers(TotalLocked * 0)
      });
    }

    fetchTotalLocked();
  }, []);

  return data;
};
