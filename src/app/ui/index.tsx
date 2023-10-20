import { NetworksSetDefault, providersApp } from '../providers';
import { ToastContainer } from 'react-toastify';
import { Pages } from 'pages';
import '../styles/index.scss';
import { BaseLayout } from './base-layout';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <NetworksSetDefault>
      <BaseLayout>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Pages />
      </BaseLayout>
    </NetworksSetDefault>
  );
};

export default providersApp(App);
