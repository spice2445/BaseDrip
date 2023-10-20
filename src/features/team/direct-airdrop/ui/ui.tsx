import { CardLayoutTeam } from 'entities/Team';
import * as Form from '@radix-ui/react-form';
import { Input } from 'shared/ui/form';
import { Button } from 'shared/ui/button';
import { conainer_center } from './ui.module.scss';
import { NAME_BDRIP } from 'shared/config/constants';
import { useSendAirDrop } from '../model';

export const DirectAirDrop = () => {
  const { action, addressRef, faucetIdRef, amountRef } = useSendAirDrop();

  return (
    <CardLayoutTeam>
      <Form.Field name="Player">
        <Input inputRef={addressRef} label="Player" placeholder="0x000..." />
      </Form.Field>

      <Form.Field name="Faucet ID" className={conainer_center}>
        <Input inputRef={faucetIdRef} label={`Faucet ID`} placeholder="X" />
      </Form.Field>

      <Form.Field name="Amount" className={conainer_center}>
        <Input inputRef={amountRef} label={`Amount ($${NAME_BDRIP})`} placeholder="XXXX" />
      </Form.Field>

      <Button onClick={action}>Sent</Button>
    </CardLayoutTeam>
  );
};
