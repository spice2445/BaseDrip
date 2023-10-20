import { wrapperBody, mainApp, page, page_content } from './AppWrapper.module.scss';
import { SharedProps } from 'shared/config/type';
import { Header } from 'widgets/Header';
import { Navbar } from 'widgets/Navbar';

export const BaseLayout = ({ children }: SharedProps) => {
  return (
    <div className={wrapperBody}>
      <main className={mainApp}>
        <Navbar isHeaderMenu={false} />
        <div className={page}>
          <Header />
          <div className={page_content}>{children}</div>
        </div>
      </main>
    </div>
  );
};
