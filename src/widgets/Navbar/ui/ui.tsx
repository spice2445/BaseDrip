import { LinksUI } from 'shared/ui/link';
import { linksPage, linkDocs, externalLinks } from '../config';
import {
  logoStyle,
  mainInfo,
  navbar,
  externalLinksBody,
  externalLink,
  externalLinkImage,
  navbar_header
} from './ui.module.scss';
import logo from 'shared/assets/logo.png';
import { Link } from 'atomic-router-react';
import clsx from 'clsx';
import { routesList } from 'shared/config/router';

interface NavbarProps {
  isHeaderMenu: boolean;
}

export const Navbar = ({ isHeaderMenu }: NavbarProps) => {
  if (!isHeaderMenu && window.innerWidth < 900) return null;

  return (
    <section className={clsx(navbar, isHeaderMenu && navbar_header)}>
      <div className={mainInfo}>
        <Link to={routesList.dashboard} className={logoStyle}>
          <img src={logo} alt="logo" />
        </Link>
        {linksPage.map(({ to, text, query }) => (
          <LinksUI query={query} to={to} key={text}>
            {text}
          </LinksUI>
        ))}

        <LinksUI query={linkDocs.query} to={linkDocs.to}>
          {linkDocs.text}
        </LinksUI>
      </div>

      <div className={externalLinksBody}>
        {externalLinks.map((linkImage) => (
          <Link key={linkImage.alt} to={linkImage.to} className={externalLink}>
            <img src={linkImage.Image} className={externalLinkImage} alt={linkImage.alt} />
          </Link>
        ))}
      </div>
    </section>
  );
};
