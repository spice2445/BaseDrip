import { useCreateFaucet } from '../model';
import { Card } from 'shared/ui/card';
import * as Form from '@radix-ui/react-form';
import { Input } from 'shared/ui/form';
// import { Checkbox } from 'shared/ui/form';
import {
  body_content,
  deposit_content,
  locked_amount_max,
  token_use,
  // use_token_content,
  content_submit,
  set_min
} from './ui.module.scss';
import { faucetCard } from 'entities/Faucets';
import open_faucet from './image/open-faucet.png';
import { Image } from 'shared/ui/image';
import { Button } from 'shared/ui/button';
import { text } from 'shared/ui/typogragphy';
import clsx from 'clsx';
import { formattedIntegers } from 'shared/lib/formatted-numbers';
import { NAME_BDRIP } from 'shared/config/constants';
import { memo } from 'react';

export const FaucetCreate = memo(() => {
  const { valueDeposit, isApprove, action, setValueDeposit, onChangeDeposit } = useCreateFaucet();

  return (
    <Card className={clsx(faucetCard.card_body, 'h_100')}>
      <Form.Root>
        <Image className={faucetCard.open_faucet_img} src={open_faucet} alt="open faucet" />

        <div className={body_content}>
          <div className="w_100">
            <div className={deposit_content}>
              <p className={text.text_sm}>Locked Amount:</p>
              <Button onClick={setValueDeposit('max')} className={locked_amount_max} type="button">
                Max
              </Button>
            </div>

            <div className={deposit_content}>
              <Form.Field name="Deposit" className="w_100">
                <Input placeholder="Deposit" value={valueDeposit} onChange={onChangeDeposit} type="number" />
              </Form.Field>

              <p className={token_use}>${NAME_BDRIP}</p>
            </div>
          </div>

          <div className={set_min} onClick={setValueDeposit('min')}>
            <p className={text.text_sm}>Current Minimum:</p>
            <p>10.0 ${NAME_BDRIP}</p>
          </div>

          <div>
            <p className={text.text_sm}>Daily Rewards:</p>
            <p>1.00%</p>
            <p>
              ({formattedIntegers(Number(valueDeposit) * 0.01)} ${NAME_BDRIP})
            </p>
          </div>
        </div>

        <Form.Submit className={clsx(content_submit, 'w_100')} asChild>
          <Button onClick={action} type="submit">
            {isApprove || Number(valueDeposit) <= 0 ? 'Open' : 'Approve'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </Card>
  );
});
