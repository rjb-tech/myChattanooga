import "../styles/globals.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyChattanoogaProvider } from "../components/MyChattanoogaProvider";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: true,
        staleTime: 120 * 1000, // two minutes
      },
    },
  });
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
      <QueryClientProvider client={queryClient}>
        <MyChattanoogaProvider>
          <Component {...pageProps} />
        </MyChattanoogaProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

export default MyApp;
