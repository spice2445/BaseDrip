import { useEffect, useState } from 'react';
import FactoryAbi from 'shared/assets/abi/factory.json';
import { client, FACTORY_ADDRESS } from 'shared/config/blockchain';
import { useConnect } from 'wagmi';

const pairsAddresses: any = {};

export const usePair = (address0: string | undefined, address1: string | undefined): string | undefined => {
  const [pairAddress, setPairAddress] = useState<string>();
  const { data } = useConnect();

  useEffect(() => {
    if (!address0 || !address1) {
      return;
    }
    const key =
      address0.localeCompare(address1) < 0
        ? `${data?.chain.id}-${address0}-${address1}`
        : `${data?.chain.id}-${address1}-${address0}`;
    if (!pairsAddresses[key]) {
      client
        .readContract({
          address: FACTORY_ADDRESS,
          abi: FactoryAbi,
          functionName: 'getPair',
          args: [address0, address1]
        })
        .then((result: any) => {
          pairsAddresses[key] = result.toString();
          setPairAddress(result.toString());
        });
    } else {
      setPairAddress(pairsAddresses[key]);
    }
  }, [address0, address1]);

  return pairAddress;
};
