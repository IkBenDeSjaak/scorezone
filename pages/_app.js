import '../styles/globals.css'
import { SWRConfig } from 'swr'
import fetcher from '../lib/fetcher'

function MyApp ({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        onError: (err) => {
          console.error(err)
        }
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
