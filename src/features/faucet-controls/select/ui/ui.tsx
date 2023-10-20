import { useState } from 'react';
import { Button } from 'shared/ui/button';

export const Select = () => {
  const [isSelect, setIsSelect] = useState(false);
  return (
    <>
      {isSelect && <Button>Copy Ids</Button>}
      <Button
        onClick={() => {
          setIsSelect(!isSelect);
        }}
      >
        Select
      </Button>
    </>
  );
};
