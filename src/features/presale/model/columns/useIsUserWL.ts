import { useUserInfo } from './useInfoUser';

export const useIsUserWL = () => {
  const userInfoData = useUserInfo();
  const isWhitelistedUser = Boolean((userInfoData as bigint[])?.[1]);

  return isWhitelistedUser ? 'True' : 'False';
};
