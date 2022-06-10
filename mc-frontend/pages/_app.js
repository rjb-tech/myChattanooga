import '../styles/globals.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { MyChattanoogaProvider } from '../components/MyChattanoogaProvider'

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain='mychattanooga.us.auth0.com'
      clientId='PDzkyuUA4Se6FhrH7tUmnSJkxL040S48'
      redirectUri={process.env.DEPLOYMENT_ENV==='prod' ? 'https://mychattanooga.app' : 'http://localhost:3000'}
    >
      <MyChattanoogaProvider>
        <Component {...pageProps} />
      </MyChattanoogaProvider>
    </Auth0Provider>
  )
}

export default MyApp
