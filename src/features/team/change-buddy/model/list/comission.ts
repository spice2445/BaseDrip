import GARDEN_ABI from 'shared/assets/abi/Garden.json';
import { useContractRead } from 'wagmi';
import { GARDEN_ADDRESS } from 'shared/config/blockchain';
import { NAME_BDRIP } from 'shared/config/constants';

export const useGetCommission = () => {
  const { data: commisionData } = useContractRead({
    abi: GARDEN_ABI,
    address: GARDEN_ADDRESS,
    functionName: 'depositFees',
    watch: true
  });

  const commision = commisionData as string[];

  // if (userReferrals) {
  //   return `${formattedIntegers(CHANGE_BUDDY_FEE)} ETH`;
  // }

  return `${Number(commision?.[1])} $${NAME_BDRIP}`;
};
