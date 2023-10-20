import { Card, CardTheme } from 'shared/ui/card';
import {
  card_container,
  card_content,
  contract_img,
  header_token,
  token_img,
  my_info_container,
  margin_container,
  stake_header,
  my_container,
  buttons_container
} from './ui.module.scss';
import { Image } from 'shared/ui/image';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { text } from 'shared/ui/typogragphy';
import { Link } from 'atomic-router-react';
import { Button } from 'shared/ui/button';
import clsx from 'clsx';
import { Input } from 'shared/ui/form';
import { Root as FormRoot, Field as FormField } from '@radix-ui/react-form';
import { Address, useAccount, useBalance, useToken } from 'wagmi';
import { InputBigInt } from 'shared/ui/form/input-bigint';
import { useState } from 'react';
import { toDecimal } from 'shared/lib/to-decimal';
import { ActionButton } from '../ActionButton';
import { useGetData } from '../../model/get-data';
import { Column, Columns } from 'shared/ui/columns';
import { ClaimButton } from '../ClaimButton';
import { CompoundButton } from '../CompoundButton';

const GardenTemplateDefault = () => (
  <Card theme={CardTheme.transparent} className={card_container}>
    <Card className={card_content}>
      <div className="w_100">
        <div className={header_token}>
          <div className={token_img}>
            <Image src="https://www.pulsedrip.io/tokens/0x25D240831a9c0CB981506538E810d32487D291Af.png" />
          </div>
          <span className={text.text_xl}>Token-LP</span>
          <Link to="#" className={contract_img}>
            <ExternalLinkIcon />
          </Link>
        </div>

        <div className={clsx(margin_container)}>
          <div className={stake_header}>
            <h1>Stake</h1>
            <button>Max 0</button>
          </div>

          <FormRoot>
            <FormField name="token">
              <Input />
            </FormField>
          </FormRoot>
        </div>

        <Button disabled className={margin_container}>
          Please, connect wallet first
        </Button>

        <div className={clsx(my_info_container, margin_container)}>
          <div>
            <h3 className={text.text_sm}>Total Staked</h3>
            <p className={text.text_xl}>0.000 LP</p>
          </div>

          <div>
            <h3 className={text.text_sm}>Available</h3>
            <p className={text.text_xl}>0.000 LP</p>
          </div>
        </div>

        {/* <Collapsible trigger={<p>Referral</p>} className={margin_container}></Collapsible> */}
      </div>
    </Card>
  </Card>
);

type GardenModelProps = {
  balance: bigint;
  decimals: number;
  symbol: string;
  token: Address;
  gardenAddress: Address;
};
const GardenModel = ({ balance, decimals, symbol, token, gardenAddress }: GardenModelProps) => {
  const data = useGetData(gardenAddress);
  const [amount, setAmount] = useState<bigint>();

  const resetAmounts = () => setAmount(undefined);

  const setMax = () => setAmount(balance)

  return (
    <Card theme={CardTheme.transparent} className={card_container}>
      <Card className={card_content}>
        <div className="w_100">
          <div className={header_token}>
            <div className={token_img}>
              <Image src="https://www.pulsedrip.io/tokens/0x25D240831a9c0CB981506538E810d32487D291Af.png" />
            </div>
            <span className={text.text_xl}>{symbol}-LP</span>
            <Link to="#" className={contract_img}>
              <ExternalLinkIcon />
            </Link>
          </div>

          <div className={clsx(margin_container)}>
            <div className={stake_header}>
              <h1>Stake</h1>
              <button onClick={setMax}>
                Max{` `}
                {toDecimal(balance, decimals, 3)}
              </button>
            </div>

            <FormRoot>
              <FormField name="token">
                <InputBigInt max={balance} decimals={18} amount={amount} onChangeAmount={setAmount} />
              </FormField>
            </FormRoot>
          </div>

          <ActionButton onSuccess={resetAmounts} gardenAddress={gardenAddress} token={token} amount={amount} max={balance} />

          <div className={clsx(my_info_container, margin_container, my_container)}>
            <div>
              <h3 className={text.text_sm}>Total Staked</h3>
              <p className={text.text_xl}>{toDecimal(data.depositedAmount, 18, 3)} LP</p>
            </div>

            <div>
              <h3 className={text.text_sm}>Available</h3>
              <p className={text.text_xl}>{toDecimal(data.claimableAmount, 18, 3)} LP</p>
            </div>
          </div>

          <Columns>
            <Column title="Amount to compound" info={`${toDecimal(data.compoundableAmount, 18, 3)} LP`} />
            <Column title="Amount to claim" info={`${toDecimal(data.claimableAmount, 18, 3)} LP`} />
            <Column title="Total deposited" info={`${toDecimal(data.depositedAmount, 18, 3)} LP`} />
            <Column title="Total compounded" info={`${toDecimal(data.compoundAmount, 18, 3)} LP`} />
            <Column title="Total claimed" info={`${toDecimal(data.claimedAmount, 18, 3)} LP`} />
          </Columns>
          <div className={buttons_container}>
            <ClaimButton gardenAddress={gardenAddress} />
            <CompoundButton gardenAddress={gardenAddress} />
          </div>
        </div>
      </Card>
    </Card>
  );
};

type GardenCard = {
  tokenAddress: Address;
  gardenAddress: Address;
}
export const GardenCard = ({ tokenAddress, gardenAddress }: GardenCard) => {
  const { isConnected, address } = useAccount();
  const { data: token } = useToken({ address: tokenAddress });
  const { data } = useBalance({ address: address as Address, token: token?.address, watch: true });

  if (!isConnected || !address || !data || !token) return <GardenTemplateDefault />;

  return <GardenModel gardenAddress={gardenAddress} token={token.address} symbol={token.symbol} balance={data.value} decimals={token.decimals} />;
};
