import styles from './Predict.module.css'

import Layout from '../../components/Layout'

export default function Predict () {
  return (
    <>
      <Layout>
        <div>
          <div className={styles.selectWeek}>
            <label className={styles.selectWeekLabel} htmlFor='week'>
              Selecteer een datum:
              <select className={styles.selectWeekSelect} id='week' name='week'>
                <option value='1'>8 nov - 15 nov</option>
                <option value='2'>16 nov - 23 nov</option>
                <option value='3'>23 nov - 30 nov</option>
                <option value='3'>30 nov - 7 dec</option>
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
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignRight}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageLeft}`} src='https://via.placeholder.com/150' alt='Ajax logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelLeft}`}>Ajax</label>
                </div>
                <div className={styles.scoreBlock}>
                  <div>
                    {/* <p className={styles.actualScoreText}>1 - 1</p> */}
                  </div>
                  <div className={styles.scoreInputs}>
                    <input className={styles.scoreInput} type='number' />
                    <p className={styles.teamDivider}>-</p>
                    <input className={styles.scoreInput} type='number' />
                  </div>
                </div>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignLeft}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageRight}`} src='https://via.placeholder.com/150' alt='Heracles logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelRight}`}>Heracles</label>
                </div>
              </div>
              <div className={styles.score}>
                <p>10</p>
              </div>
            </div>
            <div className={`${styles.gameRow} ${styles.gameRowBackground2}`}>
              <div className={styles.dateTime}>
                <p className={styles.day}>Su</p>
                <p className={styles.time}>17:00</p>
              </div>
              <div className={styles.teams}>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignRight}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageLeft}`} src='https://via.placeholder.com/150' alt='Fc Twente logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelLeft}`}>FC Twente</label>
                </div>
                <div className={styles.scoreBlock}>
                  <div>
                    {/* <p className={styles.actualScoreText}>1 - 1</p> */}
                  </div>
                  <div className={styles.scoreInputs}>
                    <input className={styles.scoreInput} type='number' />
                    <p className={styles.teamDivider}>-</p>
                    <input className={styles.scoreInput} type='number' />
                  </div>
                </div>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignLeft}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageRight}`} src='https://via.placeholder.com/150' alt='Fc Groningen logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelRight}`}>FC Gronsdasssdingen</label>
                </div>
              </div>
              <div className={styles.score}>
                <p />
              </div>
            </div>
            <div className={`${styles.gameRow} ${styles.gameRowBackground1}`}>
              <div className={styles.dateTime}>
                <p className={styles.day}>Su</p>
                <p className={styles.time}>17:00</p>
              </div>
              <div className={styles.teams}>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignRight}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageLeft}`} src='https://via.placeholder.com/150' alt='FC Team logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelLeft}`}>FC Team</label>
                </div>
                <div className={styles.scoreBlock}>
                  <div>
                    <p className={styles.actualScoreText}>1 - 1</p>
                  </div>
                  <div className={styles.scoreInputs}>
                    <p className={`${styles.scoreInput} ${styles.scoreInputDisabled}`}>1</p>
                    <p className={styles.teamDivider}>-</p>
                    <p className={`${styles.scoreInput} ${styles.scoreInputDisabled}`}>1</p>
                  </div>
                </div>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignLeft}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageRight}`} src='https://via.placeholder.com/150' alt='Manchester United logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelRight}`}>Manchester United</label>
                </div>
              </div>
              <div className={styles.score}>
                <p>7</p>
              </div>
            </div>
            <div className={`${styles.gameRow} ${styles.gameRowBackground2}`}>
              <div className={styles.dateTime}>
                <p className={styles.day}>Su</p>
                <p className={styles.time}>17:00</p>
              </div>
              <div className={styles.teams}>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignRight}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageLeft}`} src='https://via.placeholder.com/150' alt='Fc Meer logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelLeft}`}>FC Meer Team</label>
                </div>
                <div className={styles.scoreBlock}>
                  <div>
                    <p className={styles.actualScoreText}>1 - 1</p>
                  </div>
                  <div className={styles.scoreInputs}>
                    <input className={styles.scoreInput} type='number' />
                    <p className={styles.teamDivider}>-</p>
                    <input className={styles.scoreInput} type='number' />
                  </div>
                </div>
                <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignLeft}`}>
                  <img className={`${styles.teamImage} ${styles.teamImageRight}`} src='https://via.placeholder.com/150' alt='Manchester City logo' />
                  <label className={`${styles.teamLabel} ${styles.teamLabelRight}`}>Manchester City</label>
                </div>
              </div>
              <div className={styles.score}>
                <p>1</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
