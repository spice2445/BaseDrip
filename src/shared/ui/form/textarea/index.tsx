import { content } from './ui.module.scss';

export interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  inputRef?: React.LegacyRef<HTMLTextAreaElement>;
}

export const TextArea = ({ placeholder, inputRef }: TextAreaProps) => (
  <textarea ref={inputRef} placeholder={placeholder} className={content} />
);
