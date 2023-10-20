import { info, info_title, info_text } from './info.module.scss';

export interface InfoProps {
  title: string;
  text: string;
}

export const Info = ({ title, text }: InfoProps) => {
  return (
    <div className={info}>
      <h1 className={info_title}>{title}</h1>
      <p className={info_text}>{text}</p>
    </div>
  );
};
