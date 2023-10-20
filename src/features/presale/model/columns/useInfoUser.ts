import { defaultPresaleConfig } from 'entities/Token';
import { useAccount, useContractRead } from 'wagmi';

export const useUserInfo = () => {
  const { address } = useAccount();
  const { data: userInfoData } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'userInfo',
    args: [address]
  });

  return userInfoData as bigint[];
};
