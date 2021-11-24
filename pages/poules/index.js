import styles from './Poules.module.css'

import Link from 'next/link'
import Layout from '../../components/Layout'

export default function Poules () {
  return (
    <>
      <Layout>
        <div>
          <h1>Poules</h1>
          <h3 className={styles.fontWeightNormal}>Here you can see all the poules you participate in or create a new poule!</h3>
          <p className={styles.button}><Link href='/poules/create'><a>Create poule</a></Link></p>
          <div className={styles.poulesContainer}>
            <div className={`${styles.pouleRow} ${styles.poulesInfo}`}>
              <p>Poule name</p>
              <p>League</p>
              <p>Season</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowData}`}>
              <p className={styles.pouleName}><Link href='poules/1234'><a className={styles.pouleText}>Gekke poule</a></Link></p>
              <p>Eredivisie</p>
              <p>2020-2021</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowData}`}>
              <p className={styles.pouleName}><Link href='poules/12345'><a className={styles.pouleText}>Poule voor collegaasadassdaasdasdasdasdsasdsd's</a></Link></p>
              <p>Bundesliga</p>
              <p>2021-2022</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowData}`}>
              <p className={styles.pouleName}><Link href='poules/456'><a className={styles.pouleText}>Hele andere pouleeeee</a></Link></p>
              <p>Champions League</p>
              <p>2021-2022</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
