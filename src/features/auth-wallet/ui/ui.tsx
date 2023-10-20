import { useConnectModal } from '@rainbow-me/rainbowkit';
import { addressShort } from 'shared/lib/addressShort';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, ButtonType } from 'shared/ui/button';
import { button, text_mobile, text_pc } from './ui.module.scss';
import { useBalanceTokens } from 'entities/Faucets';
import { NAME_BDRIP } from 'shared/config/constants';

export const AuthWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const bdripUser = useBalanceTokens();

  const onClickWallet = () => {
    if (address) {
      return disconnect();
    }
    openConnectModal && openConnectModal();
  };

  return (
    <Button onClick={onClickWallet} className={button} theme={ButtonType.secondary}>
      <span className={text_pc}>
        {address ? `${bdripUser.balanceFormatted} ${NAME_BDRIP} | Disconnect ${addressShort(address)}` : 'Connect wallet'}
      </span>
      <span className={text_mobile}>{address ? 'Disconnect' : 'Connect wallet'}</span>
    </Button>
  );
};
