import { ClaimAll } from 'features/faucet-controls/claim-all';
import { CompoundAll } from 'features/faucet-controls/compound-all';
import { HideInActive } from 'features/faucet-controls/hide-inActive';
import { Select } from 'features/faucet-controls/select';

import { container_controls, part_controls } from './ui.module.scss';

export const ControlsFaucets = () => {
  return (
    <div className={container_controls}>
      <div className={part_controls}>
        <ClaimAll />
        <CompoundAll />
      </div>

      <div className={part_controls}>
        <Select />
        <HideInActive />
      </div>
    </div>
  );
};
