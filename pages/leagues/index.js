import styles from './Leagues.module.css'

import Layout from '../../components/Layout'

export default function Predict () {
  return (
    <>
      <Layout>
        <div>
          <h1>Leagues</h1>
          <h3 className={styles.fontWeightNormal}>Select all leagues from which you want to predict matches!</h3>
          <div className={styles.leaguesContainer}>
            <div className={styles.leagueRows}>
              <div className={styles.leagueRow}>
                <label>Eredivisie</label>
                <div className={styles.divInput}>
                  <input type="checkbox" name="1" checked></input>
                </div>
              </div>
              <div className={styles.leagueRow}>
                <label>Conference League</label>
                <div className={styles.divInput}>
                  <input type="checkbox" name="2"></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}