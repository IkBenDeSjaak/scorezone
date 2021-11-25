import styles from './Rankings.module.css'

import Link from 'next/link'
import Layout from '../../components/Layout'

export default function Rankings () {
  return (
    <>
      <Layout>
        <h1>Rankings</h1>
        <div className={styles.rankings}>
          <table>
            <thead>
              <tr>
                <th className={styles.rankingsLeague} scope='col'>League</th>
                <th className={styles.rankingsParticipants} scope='col'>Participants</th>
                <th className={styles.rankingsPosition} scope='col'>Position</th>
                <th className={styles.rankingsPoints} scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Link href='/rankings/123?page=1'><a className={styles.leagueText}>Eredivisie</a></Link></td>
                <td className={styles.rankingsParticipants}>1999</td>
                <td className={styles.rankingsPositionData}>21 <span>(10)</span></td>
                <td className={styles.rankingsPointsData}>243</td>
              </tr>
              <tr>
                <td><Link href='/rankings/43242423?page=1'><a className={styles.leagueText}>Champions League</a></Link></td>
                <td className={styles.rankingsParticipants}>5000</td>
                <td className={styles.rankingsPositionData}>- <span>(-)</span></td>
                <td className={styles.rankingsPointsData}>-</td>
              </tr>
              <tr>
                <td><Link href='/rankings/324?page=1'><a className={styles.leagueText}>Conference League</a></Link></td>
                <td className={styles.rankingsParticipants}>99</td>
                <td className={styles.rankingsPositionData}>1 <span>(3)</span></td>
                <td className={styles.rankingsPointsData}>243</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  )
}
