import styles from './Predict.module.css'

import Layout from '../../components/Layout'

export default function Predict () {
  return (
    <>
      <Layout>
        <div>
          <div className={styles.selectWeek}>
            <label className={styles.selectWeekLabel} htmlFor="week">
              Selecteer een datum:
              <select className={styles.selectWeekSelect} id="week" name="week">
                <option value="1">8 nov - 15 nov</option>
                <option value="2">16 nov - 23 nov</option>
                <option value="3">23 nov - 30 nov</option>
                <option value="3">30 nov - 7 dec</option>
              </select>
            </label>
          </div>

          <div className={styles.leagueContainer}>
            <div className={styles.leagueName}>Eredivisie</div>
            <div className={`${styles.gameRow} ${styles.gameRowBackground1}`}>
              <div className={styles.dateTime}>
                <p className={styles.day}>Fr</p>
                <p className={styles.time}>20:00</p>
              </div>
              <div className={styles.teams}>
                <div className={styles.teamAndImage}>
                  <img className={styles.teamImage} src="https://via.placeholder.com/150"/>
                  <label className={styles.teamLabel}>Ajax</label>
                </div>
                  <input className={styles.scoreInput} type="number"></input>
                  <p className={styles.teamDivider}>-</p>
                  <input className={styles.scoreInput} type="number"></input>
                <div className={styles.teamAndImage}>
                  <img className={styles.teamImage} src="https://via.placeholder.com/150"/>
                  <label className={styles.teamLabel}>Heracles</label>
                </div>
              </div>
            </div>
            <div className={`${styles.gameRow} ${styles.gameRowBackground2}`}>
              <div className={styles.dateTime}>
                <p className={styles.day}>Su</p>
                <p className={styles.time}>17:00</p>
              </div>
              <div className={styles.teams}>
                <div className={styles.teamAndImage}>
                  <img className={styles.teamImage} src="https://via.placeholder.com/150"/>
                  <label className={styles.teamLabel}>FC Twente</label>
                </div>
                  <input className={styles.scoreInput} type="number"></input>
                  <p className={styles.teamDivider}>-</p>
                  <input className={styles.scoreInput} type="number"></input>
                <div className={styles.teamAndImage}>
                  <img className={styles.teamImage} src="https://via.placeholder.com/150"/>
                  <label className={styles.teamLabel}>FC Gronsdasssdingen</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}