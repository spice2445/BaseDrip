import * as Form from '@radix-ui/react-form';
import { CardLayoutTeam } from 'entities/Team';
import { ColumnsList } from 'shared/ui/columns';
import { Input } from 'shared/ui/form';
import { columns_info } from '../config';
import { columns_list, container_controls, single_control } from './ui.module.scss';
import { Button } from 'shared/ui/button';
import { text } from 'shared/ui/typogragphy';
import { useCompound, useGetListInfo } from '../model';

export const RewardsWallet = () => {
  const { idFaucetInput, actionCompound } = useCompound();
  useGetListInfo();
  return (
    <CardLayoutTeam>
      <Form.Field name="Ids">
        <Input inputRef={idFaucetInput} label="Compound into Faucets" placeholder="Faucet id:" />
      </Form.Field>

      {/* <ColumnsList columns={columns_info} className={columns_list} /> */}

      <div className={container_controls}>
        <div className={single_control}>
          <p className={text.text_sm}>0% tax</p>
          <Button onClick={actionCompound}>Compound</Button>
        </div>

        {/* <div className={single_control}>
          <p className={text.text_sm}>30% tax</p>
          <Button>Claim</Button>
        </div> */}
      </div>
    </CardLayoutTeam>
  );
};
