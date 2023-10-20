import { Card, CardTheme } from 'shared/ui/card';
// import { ControlsFaucets } from './controls';
import { FaucetCard, useGetFaucets } from 'entities/Faucets';
import { container_faucets } from './ui.module.scss';
import { FaucetCreate } from 'features/faucet-create';

export const FaucetsProfile = () => {
  const faucets = useGetFaucets();

  return (
    <>
      {/* <ControlsFaucets /> */}

      <Card theme={CardTheme.transparent} className={container_faucets}>
        <FaucetCreate />

        {faucets && faucets.map((id) => <FaucetCard id={id} key={id} />)}
      </Card>
    </>
  );
};
