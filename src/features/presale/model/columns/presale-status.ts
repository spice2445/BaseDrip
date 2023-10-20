import { defaultPresaleConfig } from 'entities/Token';
import { useContractRead } from 'wagmi';

export const usePresaleStatus = () => {
  const { data: whitelistEnabled } = useContractRead({
    ...defaultPresaleConfig,
    functionName: 'whitelistEnabled'
  });
  console.log(whitelistEnabled);

  return whitelistEnabled ? 'Whitelist.' : `Public.`;
};
