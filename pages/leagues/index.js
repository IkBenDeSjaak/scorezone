import styles from './Leagues.module.css'

import Layout from '../../components/Layout'

export default function Leagues () {
  return (
    <>
      <Layout>
        <div>
          <h1>Leagues</h1>
          <h3 className={styles.fontWeightNormal}>Select all leagues from which you want to predict matches!</h3>
          <div className={styles.leaguesContainer}>
            <div className={styles.leagueRows}>
              <div className={`${styles.leagueRow} ${styles.leagueRowBackground1}`}>
                <label>Eredivisie</label>
                <div className={styles.divInput}>
                  <input type='checkbox' name='1' checked />
                </div>
              </div>
              <div className={`${styles.leagueRow} ${styles.leagueRowBackground2}`}>
                <label>Conference League</label>
                <div className={styles.divInput}>
                  <input type='checkbox' name='2' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
