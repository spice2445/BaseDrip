import { lazy } from 'react';

export const namedLazy = <T extends Record<string, any>>(
  loader: () => Promise<T>,
  name: keyof T
): React.LazyExoticComponent<T[keyof T]> =>
  lazy(async () => {
    const module = await loader();
    return { default: module[name] };
  });
