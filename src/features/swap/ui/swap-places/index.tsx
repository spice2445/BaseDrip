import { swap_places } from './ui.module.scss';
import { UpdateIcon } from '@radix-ui/react-icons';
import { swap } from '../../model/swap-amounts';
import { useAccount } from 'wagmi';

export const SwapPlaces = () => {
  const { isConnected } = useAccount();
  return (
    <button disabled={!isConnected} type="button" onClick={swap} className={swap_places}>
      <UpdateIcon />
    </button>
  );
};
