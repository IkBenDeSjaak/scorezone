import styles from './Layout.module.css'

import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>ScoreZone</title>
        <meta name='description' content='ScoreZone makes it possible to predict football matches.' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#2a8378' />
        <meta name='msapplication-TileColor' content='#00aba9' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
