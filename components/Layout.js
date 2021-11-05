import styles from './Layout.module.css'

import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>ScoreZone</title>
        <meta name='description' content='ScoreZone maakt het mogelijk voetbalwedstrijden te voorspellen.' />
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
