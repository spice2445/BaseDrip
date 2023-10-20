import { ModalComponent } from './component';

export const modal = (component: () => React.ReactNode) => () => {
  return (
    <>
      {component()}

      <ModalComponent />
    </>
  );
};
