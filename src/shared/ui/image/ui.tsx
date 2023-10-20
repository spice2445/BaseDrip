import { ImgHTMLAttributes } from 'react';
import { wrapper } from './ui.module.scss';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const Image = ({ src, className, alt }: ImageProps) => {
  return (
    <div className={wrapper}>
      <img src={src} className={className} alt={alt} />
    </div>
  );
};
