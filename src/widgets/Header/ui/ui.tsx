import { header, logo_mob, content_container } from './ui.module.scss';
import { AuthWallet } from 'features/auth-wallet';
import logo from 'shared/assets/logo.png';
import { MenuMobile } from './mobile_menu/ui';
/* import { BdripPrice } from 'entities/Token'; */
import { Link } from 'atomic-router-react';
import { routesList } from 'shared/config/router';

export const Header = () => {
  return (
    <header className={header}>
      <div className={content_container}>
        <Link to={routesList.dashboard} className={logo_mob}>
          <img src={logo} />
        </Link>

        {/* <BdripPrice /> */}
      </div>

      <div className={content_container}>
        <AuthWallet />
        <MenuMobile />
      </div>
    </header>
  );
};
