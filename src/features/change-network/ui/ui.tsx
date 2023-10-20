import { currentChain } from 'shared/config/blockchain';
import { Button } from 'shared/ui/button';
import { ModalElements } from 'shared/ui/modal';
import { title_error } from './ui.module.scss';
import { useChangeNetwork } from '../model';

export const ModalChangeNetwork = () => {
  const { onChangeNetwork, chainName } = useChangeNetwork();

  return (
    <ModalElements.Body>
      <ModalElements.Title className={title_error}>Please, change network!</ModalElements.Title>

      <ModalElements.Content>
        <Button onClick={onChangeNetwork}>
          Change the network from {chainName} to {currentChain.name}
        </Button>
      </ModalElements.Content>
    </ModalElements.Body>
  );
};
