import { ModalChangeNetwork } from 'features/change-network';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { currentChain } from 'shared/config/blockchain';
import { SharedProps } from 'shared/config/type';
import { modalClose, modalStore } from 'shared/lib/modal';
import { useNetwork, useSwitchNetwork, useAccount } from 'wagmi';

export const NetworksSetDefault = ({ children }: SharedProps) => {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();

  useEffect(() => {
    const switchChain = async () => {
      if (chain?.id !== currentChain.id && Boolean(address)) {
        modalStore.createModal({
          ModalElement: ModalChangeNetwork,
          dataProps: { cannotRemove: true }
        });

        const newChain = await switchNetworkAsync?.(currentChain.id);
        if (newChain?.id === currentChain.id) {
          toast.success('Successful!');
          modalClose()();
        }
      }
    };

    switchChain();
  }, [chain, address]);

  return <>{children}</>;
};
