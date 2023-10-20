import { Card } from 'shared/ui/card';
import {
  card_body,
  container_content,
  title_id,
  list_info,
  block_content,
  body_actions,
  swap_locked_amount,
  swap_locked_amount_action,
  token_input
} from './ui.module.scss';
import * as Form from '@radix-ui/react-form';
import faucetGif from 'shared/assets/faucet.mp4';
import { useActionFaucet, useInfoFaucet } from '../../model';
import clsx from 'clsx';
import { text } from 'shared/ui/typogragphy';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/form';
import { NAME_BDRIP } from 'shared/config/constants';

interface FaucetCardProps {
  id: number;
}

export const FaucetCard = ({ id }: FaucetCardProps) => {
  const faucetInfo = useInfoFaucet(id);
  const {
    inputValue,
    isAction,
    isAllowanceEnoghtForDeposit,
    claimAction,
    depositAction,
    onChangeInput,
    onClickAction
  } = useActionFaucet();

  return (
    <Card className={card_body}>
      <div className={container_content}>
        <h1 className={title_id}>#{id}</h1>
        <video autoPlay src={faucetGif} muted />
        <div className={clsx(list_info, container_content)}>
          {/*           <div className={swap_locked_amount}>
            <div className={block_content}>
              <h1 className={text.text_sm}>Locked Amount</h1>
              {isAction ? (
                <Form.Root>
                  <Form.Field name="Token" className="w_100">
                    <Input value={inputValue} onChange={onChangeInput} type="number" className={token_input} />
                  </Form.Field>
                </Form.Root>
              ) : (
                <p>{faucetInfo.lockedAmount}</p>
              )}
            </div>

            <button onClick={onClickAction} className={swap_locked_amount_action}>
              {isAction ? '-' : '+'}
            </button>
          </div> */}

          <div className={block_content}>
            <h1 className={text.text_sm}>Compound Amount</h1>
            <Form.Root>
              <Form.Field name="Token" className="w_100">
                <Input value={inputValue} onChange={onChangeInput} type="number" className={token_input} />
              </Form.Field>
            </Form.Root>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Locked Amount</h1>
            <p>{faucetInfo.lockedAmount}</p>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Real Deposites</h1>
            <p>{faucetInfo.realDeposits}</p>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Claimed</h1>
            <p>{faucetInfo.claimedAmount}</p>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Max Payout</h1>
            <p>{faucetInfo.maxPayout}</p>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Pending Rewards</h1>
            <p>{faucetInfo.pendingReward}</p>
          </div>

          <div className={block_content}>
            <h1 className={text.text_sm}>Daily Rewards</h1>
            <p>1.00%</p>
            <p>
              ({faucetInfo.dailyReward} ${NAME_BDRIP})
            </p>
          </div>
        </div>

        <div className={body_actions}>
          <Button onClick={depositAction(id)}>Compound</Button>
          <Button onClick={claimAction(id, faucetInfo.lastClaimed)}>Claim</Button>
        </div>
      </div>
    </Card>
  );
};
