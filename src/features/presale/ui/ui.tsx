import { Card, CardTheme } from 'shared/ui/card';
import {
  BodySwap,
  BodyToken,
  HeaderSwapItem,
  InputBody,
  InputCount,
  Purchase,
  SwapItem,
  body_content,
  container_presale,
  max_button,
  swapText
} from './ui.module.scss';
import { Title } from 'shared/ui/typogragphy';
import { Input } from 'shared/ui/form';
import * as Form from '@radix-ui/react-form';
import { NAME_BDRIP, NAME_ETH } from 'shared/config/constants';
import { Timer } from './timer';
import { Button } from 'shared/ui/button';
import { usePurchase } from '../model';
import { BDRIP_PRESALE_PRICE } from 'entities/Token';
import clsx from 'clsx';
import { ProgressSale } from './progress';

export const Presale = () => {
  const { token0, deadline, action, setMaxPresale, onChangeToken0 } = usePurchase();

  return (
    <Card theme={CardTheme.transparent} className={container_presale}>
      <Card className={body_content}>
        <Title>Presale</Title>

        <div className={BodySwap}>
          <Form.Root className="w_100">
            <div className={SwapItem}>
              <div className={HeaderSwapItem}>
                <h3 className={swapText}>Send</h3>
                <h3 className={swapText}>{NAME_ETH}</h3>
              </div>

              <div className={InputBody}>
                <Form.Field name="base">
                  <Input value={token0} type="number" onChange={onChangeToken0} className={InputCount} />
                </Form.Field>

                <Button onClick={setMaxPresale} className={clsx(BodyToken, max_button)}>
                  {/* <ImgToken src={eth} /> */}
                  MAX {NAME_ETH}
                </Button>
              </div>
            </div>

            <div className={SwapItem}>
              <div className={HeaderSwapItem}>
                <h3 className={swapText}>Receive</h3>
                <h3 className={swapText}>${NAME_BDRIP}</h3>
              </div>

              <div className={InputBody}>
                <Form.Field name="bdrip">
                  <Input value={(+token0 / BDRIP_PRESALE_PRICE).toFixed(0)} disabled className={InputCount} />
                </Form.Field>

                <div className={BodyToken}>
                  {/* <Image src={bDRIP} /> */}
                  <p className={swapText}>{NAME_BDRIP}</p>
                </div>
              </div>
            </div>
          </Form.Root>
        </div>

        <Timer deadline={deadline} />
        <ProgressSale />

        <Button onClick={action} className={Purchase}>
          Purchase
        </Button>
      </Card>
    </Card>
  );
};
