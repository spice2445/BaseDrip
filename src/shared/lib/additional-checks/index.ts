import { toast } from 'react-toastify';
import { errors } from 'shared/config/message-toast';
import { useAccount, useBalance } from 'wagmi';

export const useBalanceChecks = () => {
  const { address } = useAccount();
  const { data: balanceNative } = useBalance({
    address
  });

  const checks = (): boolean => {
    if (Number(balanceNative?.formatted) === 0) {
      toast.error(errors.INSUFFICIENT_BALANCE);
      return true;
    }
    return false;
  };

  return checks;
};

export const useIsConnectedWallet = () => {
  const { address } = useAccount();

  const checks = (): boolean => {
    if (Boolean(!address)) {
      toast.error(errors.WALLET_CONNECT);
      return true;
    }
    return false;
  };

  return checks;
};
