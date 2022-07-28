import "../styles/globals.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { MyChattanoogaProvider } from "../components/MyChattanoogaProvider";

function MyApp({ Component, pageProps }) {
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
      <MyChattanoogaProvider>
        <Component {...pageProps} />
      </MyChattanoogaProvider>
    </Auth0Provider>
  );
}

export default MyApp;
