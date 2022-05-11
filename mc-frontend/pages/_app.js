import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { MyChattanoogaProvider } from '../components/MyChattanoogaProvider'

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain='dev-2a7k3lhm.us.auth0.com'
      clientId='4NgPjfGCvSDepKmHvjX3s28OY6QT69RP'
      redirectUri='http://localhost:3000'
    >
      <MyChattanoogaProvider>
        <Component {...pageProps} />
      </MyChattanoogaProvider>
    </Auth0Provider>
  )
}

export default MyApp
