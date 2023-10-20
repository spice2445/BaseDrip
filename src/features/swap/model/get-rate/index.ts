import { Address, fetchToken } from '@wagmi/core';

import ROUTER_ABI from 'shared/assets/abi/router.json';
import { client } from 'shared/config/blockchain/wagmi';
import { ROUTER_ADDRESS } from 'shared/config/blockchain';
import { toDecimal } from 'shared/lib/to-decimal';
import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';

type Token = {
  address: Address;
  decimals: number;
};

const getTokens = async (tokens: string[]): Promise<Token[]> => {
  const { decimals: decimals1, address: address1 } = await fetchToken({ address: tokens[0] as Address });
  const { decimals: decimals2, address: address2 } = await fetchToken({ address: tokens[1] as Address });

  return [
    {
      address: address1,
      decimals: decimals1
    },
    {
      address: address2,
      decimals: decimals2
    }
  ];
};

const getRateAmount = async (tokens: Token[]) => {
  return (await client
    .readContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'getAmountsOut',
      args: [BigInt(10 ** tokens[0].decimals), [tokens[0].address, tokens[1].address]]
    })
    .catch(() => toast.error(errors.ERROR))) as Promise<string[]>;
};

export const getRate = async ([firstToken, secondToken]: string[]) => {
  const tokens = await getTokens([firstToken, secondToken]);

  const unformattedRate = await getRateAmount(tokens);

  const bigintRate =
    (BigInt(unformattedRate[1]) * BigInt(10 ** tokens[1].decimals) * BigInt(10 ** 4)) /
    (BigInt(unformattedRate[0]) * BigInt(10 ** tokens[0].decimals));

  return toDecimal(bigintRate || BigInt(0), 4, 3);
};
