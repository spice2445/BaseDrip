import { Card } from 'shared/ui/card';
import { card, text_xl, text_xs } from './ui.module.scss';

export interface InfoCardProps {
  title: string;
  useGetData: () => {
    tokens: string;
    usdc: string;
  };
}

export const InfoCard = ({ title, useGetData }: InfoCardProps) => {
  const { tokens, usdc } = useGetData();

  return (
    <Card className={card}>
      <h2 className={text_xs}>{title}</h2>
      <h1 className={text_xl}>{tokens} $BDRIP</h1>
      <h2 className={text_xs}>{usdc} $USDC</h2>
    </Card>
  );
};
