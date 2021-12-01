import styles from './Rules.module.css'

import Layout from '../../components/Layout'

export default function Rules () {
  return (
    <>
      <Layout>
        <h1>Rules</h1>
        <h2>Predictions</h2>
        <p>You can predict matches till 1 second before a match starts.</p>
        <p>If a match gets a new playing date or time your prediction will not be removed.</p>
        <p>In case a match starts earlier than expected, the actual starting time counts as the closing time for the predictions.
          Predictions saved or adjusted after the starting time will not be eligible for points.
        </p>
        <p>Match weeks are calculated from Tuesday till Monday, because a lot of leagues play matches on Monday and those matches are usually part of the matches from the whole weekend.</p>
        <h2>Points system</h2>
        <p>This points system is used by default in poules. However you can customize the points used in your poule in your poule's settings.
          The system below is also used to calculate points in the ScoreZone rankings.
        </p>
        <div className={styles.pointsTable}>
          <table>
            <tbody>
              <tr>
                <th scope='row'>
                  Total score correct
                </th>
                <td>
                  10
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  Draw correct
                </th>
                <td>
                  7
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  Winner correct
                </th>
                <td>
                  5
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  Number of home goals correct
                </th>
                <td>
                  1
                </td>
              </tr>
              <tr>
                <th scope='row'>
                  Number of away goals correct
                </th>
                <td>
                  1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li>The result of the game is the result after 90 minutes (including injury time). Goals scored during extra time are not counted.</li>
          <li>If a match is suspended and continued or replayed on a later date the result of that game counts.</li>
          <li>If a match is suspended and the game won't continue or replayed on a later date points will not be awarded for that game.</li>
          <li>If a match has been played, but later gets an official result, the initial result will count.</li>
        </ul>
      </Layout>
    </>
  )
}
