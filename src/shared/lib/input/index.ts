import { ChangeEvent, useState } from 'react';

type useInputReturn = [string, (_value: string) => void, (e: ChangeEvent<HTMLInputElement>) => void];

export const useInput = (): useInputReturn => {
  const [value, setValue] = useState<string>('');

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, setValue, onChangeInput];
};
