import { Card } from 'shared/ui/card';
import { card_body, title_info, text_info } from './ui.module.scss';

interface CardInfoProps {
  title: string;
  useGetData: (() => string) | ((isNotString?: boolean) => string | number);
}

export const CardInfo = ({ title, useGetData }: CardInfoProps) => {
  const content = useGetData();

  return (
    <Card className={card_body}>
      <h1 className={title_info}>{title}</h1>
      <p className={text_info}>{content}</p>
    </Card>
  );
};
