import "../styles/globals.css";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { MyChattanoogaProvider } from "../components/MyChattanoogaProvider";

function MyChattanooga({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain="mychattanooga.us.auth0.com"
      clientId="0CqipATVlTDNWLBOjJrCQqeQSFJvhKm5"
      redirectUri={
        process.env.DEPLOYMENT_ENV === "prod"
          ? "https://mychattanooga.app"
          : "http://localhost:3000"
      }
      cacheLocation="localstorage"
      audience="https://auth.mychattanooga.app"
      scope="create:brews"
    >
      <Provider store={store}>
        <MyChattanoogaProvider>
          <Component {...pageProps} />
        </MyChattanoogaProvider>
      </Provider>
    </Auth0Provider>
  );
}

export default MyChattanooga;
