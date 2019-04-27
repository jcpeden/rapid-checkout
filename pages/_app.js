import App from 'next/app';
import Head from 'next/head';
import { AppProvider, Frame } from '@shopify/polaris';
import '@shopify/polaris/styles.scss';
import Cookies from 'js-cookie';

class Wrapper extends React.Component {
  state = {
    shopOrigin: Cookies.get('shopOrigin')
  }
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>RapidCheckout App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <AppProvider shopOrigin="{this.state.shopOrigin}" apiKey={API_KEY} forceRedirect={true}>
          <Frame>
            {children}
          </Frame>
        </AppProvider>
      </React.Fragment>
    );
  }
}

class RapidCheckout extends App {
  render() {
   const { Component, pageProps } = this.props;
   return (
     <Wrapper>
       <Component {...pageProps} />
     </Wrapper>
   );
 }
}

export default RapidCheckout;
