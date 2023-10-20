import { clsx } from 'clsx';
import { ButtonHTMLAttributes, FC, memo } from 'react';
import style, { primary, loader_btn, skeleton_container, loader_content_container } from './ui.module.scss';
import { $isLoading } from 'shared/lib/isLoading';
import { useStore } from 'effector-react';
import { Skeleton } from '../Loading';

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonType;
}

export const Button: FC<ButtonProps> = memo(({ children, className, theme, onClick, disabled }) => {
  const isLoading = useStore($isLoading);

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    onClick && onClick(event);
  };

  return (
    <button
      disabled={disabled}
      className={clsx(primary, style[theme ?? 'primary'], isLoading && loader_btn, className, 'w_100')}
      onClick={!isLoading ? onClickHandler : undefined}
    >
      <div className={clsx(isLoading && loader_content_container)}>{children}</div>

      {isLoading && (
        <div className={skeleton_container}>
          <Skeleton />
        </div>
      )}
    </button>
  );
});
