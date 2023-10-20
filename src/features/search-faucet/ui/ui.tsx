import { Card, CardTheme } from 'shared/ui/card';
import * as Form from '@radix-ui/react-form';
import { lookUp_body, lookUp_form, form, field, title, submit, faucet_info, info_body } from './ui.module.scss';
import { Button } from 'shared/ui/button';
import faucetImg from 'shared/assets/faucet.mp4';
import { Info } from './info';
import { Input } from 'shared/ui/form';
import { useGetfaucet } from '../model';
import { NAME_BDRIP } from 'shared/config/constants';

export const FaucetInfo = () => {
  const { id, faucet, onChangeId, action } = useGetfaucet();

  return (
    <Card theme={CardTheme.transparent} className={lookUp_body}>
      <Card className={lookUp_form}>
        <Form.Root className={form}>
          <Form.Field name="id" className={field}>
            <Input value={id} onChange={onChangeId} label="Look up ID" type="number" placeholder="0" />
          </Form.Field>

          <Button onClick={action} type="submit" className={submit}>
            Look up
          </Button>
        </Form.Root>
      </Card>

      {faucet && (
        <Card className={faucet_info}>
          <h2 className={title}>#{faucet.id}</h2>
          <video autoPlay src={faucetImg} muted />

          <div className={info_body}>
            <Info title="Locked Amount:" text={faucet.LockedAmount} />
            <Info title="Real Deposits:" text={faucet.RealDeposits} />
            <Info title="Claimed:" text={faucet.Claimed} />
            <Info title="Max Payout:" text={faucet.MaxPayout} />
            <Info title="Pending Rewards:" text={faucet.PendingRewards} />
            <Info
              title="Daily Rewards:"
              text={`1.00%
                  (3.934 $${NAME_BDRIP})`}
            />
          </div>
        </Card>
      )}
    </Card>
  );
};
