import '../styles/globals.css'
import { MyChattanoogaProvider } from '../components/MyChattanoogaProvider'

function MyApp({ Component, pageProps }) {
  return (
    <MyChattanoogaProvider>
      <Component {...pageProps} />
    </MyChattanoogaProvider>
  )
}

export default MyApp
