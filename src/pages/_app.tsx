/* eslint-disable import/first */
/* eslint-disable import/order */
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '@/app/styles/nullstyles.scss';
import Layout from '@/shared/ui/seo/Layout/Layout';
import { wrapper } from '@/app/providers/StoreProvider';
import { appWithTranslation } from 'next-i18next';
import '../app/styles/index.scss';
import { SessionProvider } from 'next-auth/react';
import { PlayerDetailed } from '@/entities/PlayerDetailed';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyApp = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <SessionProvider session={props.pageProps.session}>
      <Provider store={store}>
        <Layout>
          <Component {...props.pageProps}/>
          <PlayerDetailed />
          <ToastContainer />
        </Layout>
      </Provider>
    </SessionProvider>
  );
};


export default appWithTranslation(MyApp);
