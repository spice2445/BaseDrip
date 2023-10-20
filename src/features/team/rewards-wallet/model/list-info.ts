import { TEAM_ADDRESS } from 'shared/config/blockchain';
import TEAM_ABI from 'shared/assets/abi/team.json';
import { useAccount, useContractRead } from 'wagmi';

export const useGetListInfo = () => {
  const { address } = useAccount();
  const { data } = useContractRead({
    abi: TEAM_ABI,
    address: TEAM_ADDRESS,
    functionName: 'referrals',
    args: [address]
  });
  console.log(data);
};
