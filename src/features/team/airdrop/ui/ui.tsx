import * as Form from '@radix-ui/react-form';
import { CardLayoutTeam } from 'entities/Team';
import { Button } from 'shared/ui/button';
import { Input, TextArea } from 'shared/ui/form';
import { container_input, container_button, button } from './ui.module.scss';

import { NAME_BDRIP } from 'shared/config/constants';
import { useAirDropTeam } from '../model';

export const AirdropTeam = () => {
  const { actionSend, textareaRef, amountRef } = useAirDropTeam();

  return (
    <CardLayoutTeam>
      <TextArea
        inputRef={textareaRef}
        placeholder={`0x0000...
0x0000...
...`}
      />

      <div className={container_input}>
        <Form.Field name="Abount">
          <Input inputRef={amountRef} type="number" label={`XXX ($${NAME_BDRIP})`} />
        </Form.Field>
      </div>

      <div className={container_button}>
        <Button onClick={actionSend} className={button}>
          Send
        </Button>
      </div>
    </CardLayoutTeam>
  );
};
