import { LinkProps, LinkImageProps } from 'shared/config/type';
import Twitter from '../ui/image/twitter.svg';
import Telegram from '../ui/image/telegramm.svg';
import { querySwap, routesList } from 'shared/config/router';

export const linksPage: LinkProps[] = [
  { text: 'Dashboard', to: routesList.dashboard, query: undefined },
  { text: 'Presale', to: routesList.presale, query: undefined },
  { text: 'Faucets', to: routesList.faucets, query: undefined },
  { text: 'Team', to: routesList.team, query: undefined },
  { text: 'Swap', to: routesList.swap, query: querySwap },
  { text: 'Garden', to: routesList.garden, query: undefined }
];

export const linkDocs: LinkProps = {
  text: 'Whitepaper',
  to: 'https://whitepaper.basedrip.io/',
  query: undefined
};

export const externalLinks: LinkImageProps[] = [
  { Image: Twitter, to: 'https://x.com/base_drip', alt: 'Twitter' },
  { Image: Telegram, to: 'https://t.me/BASE_DRIP', alt: 'Telegram' }
];
