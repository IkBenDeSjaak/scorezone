import Head from 'next/head'
import styles from './layout.module.css'
import Header from './header'
import Footer from './footer'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>ScoreZone</title>
        <meta name='description' content='ScoreZone maakt het mogelijk voetbalwedstrijden te voorspellen.' />
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
