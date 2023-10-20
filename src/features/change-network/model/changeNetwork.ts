import { toast } from 'react-toastify';
import { modalClose } from 'shared/lib/modal';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { currentChain } from 'shared/config/blockchain';

export const useChangeNetwork = () => {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const onChangeNetwork = async () => {
    if (chain?.nativeCurrency.name === currentChain.name) return;

    const newNetwork = switchNetworkAsync && (await switchNetworkAsync(currentChain.id));

    if (newNetwork?.id === currentChain.id) {
      toast.success('Successful!');
      modalClose()();
    }
  };

  return { onChangeNetwork, chainName: chain?.nativeCurrency.name };
};
