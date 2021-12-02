import styles from '../styles/Home.module.css'

import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home () {
  return (
    <Layout>
      <h1 className={styles.title}>Welcome to ScoreZone!</h1>
      <h2 className={styles.subtitle}>The coolest website for predicting football matches!</h2>
      <p className={styles.description}>Compete with your friends and show them who's the best predictor!</p>
      <p className={styles.leagues}>Champions League, World Cup, Premier League, Primera Division, Primera División, Eredivisie and many more!</p>
      <p className={styles.center}>To get started <Link href='/signup'><a className={styles.inlineClickable}>create</a></Link> an account and after that go to <Link href='/leagues'><a className={styles.inlineClickable}>leagues</a></Link> and select all the leagues that you want to predict matches from!</p>
    </Layout>
  )
}
