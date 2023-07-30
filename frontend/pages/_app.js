import "../styles/globals.css";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { MyChattanoogaProvider } from "../components/MyChattanoogaProvider";

function MyChattanooga({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <MyChattanoogaProvider>
        <Component {...pageProps} />
      </MyChattanoogaProvider>
    </Provider>
  );
}

export default MyChattanooga;
