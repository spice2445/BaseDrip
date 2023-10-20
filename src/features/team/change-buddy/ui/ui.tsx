import { CardLayoutTeam } from 'entities/Team';
import * as Form from '@radix-ui/react-form';
import { Input } from 'shared/ui/form';
import { ADDRESS_BUDDY_DEFAULT, column_info } from '../config';
import { Button } from 'shared/ui/button';
import { change_button } from './ui.module.scss';
import { ColumnsList } from 'shared/ui/columns';
import { useChangeBuddy } from '../model';

export const ChangeBuddy = () => {
  const { changeBuddy, inputRef } = useChangeBuddy();
  
  return (
    <CardLayoutTeam>
      <Form.Field name="address">
        <Input inputRef={inputRef} label="Your buddy" placeholder={ADDRESS_BUDDY_DEFAULT} />
      </Form.Field>

      <Form.Submit asChild>
        <Button onClick={changeBuddy} className={change_button}>
          Change
        </Button>
      </Form.Submit>

      <ColumnsList columns={column_info} />
    </CardLayoutTeam>
  );
};
