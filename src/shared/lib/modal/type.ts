export interface ModalI<PropsGeneric> {
  ModalElement: (props: PropsGeneric) => JSX.Element;
  dataProps: PropsGeneric;
}
