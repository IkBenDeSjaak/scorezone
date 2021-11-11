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
              <p>Creation date</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowBackground1}`}>
              <p className={styles.pouleName}><Link href='poules/1234'><a className={styles.pouleText}>Gekke poule</a></Link></p>
              <p>19-11-1999</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowBackground2}`}>
              <p className={styles.pouleName}><Link href='poules/12345'><a className={styles.pouleText}>Poule voor collegaasadassdasd's</a></Link></p>
              <p>19-11-1999</p>
            </div>
            <div className={`${styles.pouleRow} ${styles.pouleRowBackground1}`}>
              <p className={styles.pouleName}><Link href='poules/456'><a className={styles.pouleText}>Hele andere poule</a></Link></p>
              <p>19-11-1999</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}