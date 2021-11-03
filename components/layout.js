import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'
import Header from './header'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>ScoreZone</title>
        <meta name='description' content='ScoreZone maakt het mogelijk voetbalwedstrijden te voorspellen.' />
      </Head>
      <Header />
      <main>{children}</main>
      <footer className={styles.backToHome}>
        <Link href='/'>
          <a>← Back to home</a>
        </Link>
      </footer>
    </div>
  )
}
