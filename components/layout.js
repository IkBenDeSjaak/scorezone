import Head from 'next/head'
// import Image from 'next/image'
import styles from './layout.module.css'
// import utilStyles from "../styles/utils.module.css";
import Link from 'next/link'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>ScoreZone</title>
        <meta name='description' content='ScoreZone maakt het mogelijk voetbalwedstrijden te voorspellen.' />
      </Head>
      <header className={styles.header}>
        THIS IS THE HEADER
      </header>
      <main>{children}</main>
      <footer className={styles.backToHome}>
        <Link href='/'>
          <a>← Back to home</a>
        </Link>
      </footer>
    </div>
  )
}
