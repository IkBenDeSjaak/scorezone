import styles from './Poule.module.css'

import { querydb } from '../../../lib/db'
import Link from 'next/link'
import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import Message from '../../../components/Message'

export default function Poule ({ pouleInfo, poulePositions, isCreator, message }) {
  const router = useRouter()
  const { pid } = router.query

  return (
    <>
      <Layout>
        <p className={styles.backButton}>
          <Link href='/poules'>
            <a>← Back to poules</a>
          </Link>
        </p>
        <h1 className={styles.pouleName}>{pouleInfo.PouleName}</h1>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} />
        )}
        {isCreator && (
          <p className={styles.inviteText}>Invite people for this poule with the following link: <span>https://scorezone.nl/poules/{pid}?joincode={pouleInfo.JoinCode}</span></p>
        )}
        <h2>Positions</h2>
        <div className={styles.standings}>
          <table>
            <thead>
              <tr>
                <th className={styles.standingsPos} scope='col'>Pos</th>
                <th className={styles.standingsUser} scope='col'>User</th>
                <th className={styles.standingsName} scope='col'>Name</th>
                <th className={styles.standingsPoints} scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>
              {
                poulePositions.map((pos, index, array) => (
                  <tr key={pos.UserId.toString()}>
                    <td>{index + 1}</td>
                    <td>{pos.Username}</td>
                    <td className={styles.standingsName}>{`${pos.FirstName ? pos.FirstName : ''} ${pos.LastName ? pos.LastName : ''}`}</td>
                    <td>{pos.Points}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {isCreator && (
          <p className={styles.button}><Link href={`/poules/${pid}/settings`}><a>Settings</a></Link></p>
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  query,
  req,
  res
}) {
  const uid = req.session.user?.id
  const pid = params.pid
  const joincode = query.joincode
  const message = {
    type: '',
    message: ''
  }

  if (isNaN(pid)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  try {
    const pouleInfo = await querydb(
      `
      SELECT PouleName, JoinCode, Creator 
      FROM Poules
      WHERE PouleId = ?
      `,
      pid
    )

    if (joincode) {
      const participants = await querydb(
        `
        SELECT U.UserId
        FROM Users U
        INNER JOIN PouleParticipants PP ON U.UserId = PP.UserId
        WHERE PP.PouleId = ?
        `,
        pid
      )

      const participantIds = participants.map((p) => p.UserId)

      if (uid) {
        if (!participantIds.includes(uid) && pouleInfo[0].Creator !== uid) {
          if (joincode === pouleInfo[0].JoinCode) {
            await querydb(
              `
              INSERT INTO PouleParticipants (PouleId, UserId, Approved) 
              VALUES (?, ?, ?)
              `,
              [pid, uid, 0]
            )
          } else {
            message.type = 'danger'
            message.message = 'Joincode is not correct for this poule'
          }
        } else {
          message.type = 'danger'
          message.message = 'You have already joined this poule'
        }
      } else {
        message.type = 'danger'
        message.message = 'You have to be logged in to join this poule'
      }
    }

    const poulePositions = await querydb(
      `
      SELECT MP.UserId, U.Username, U.FirstName, U.LastName, SUM(CASE
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        ELSE 0
      END) AS Points
      FROM Users U
      INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
      INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
      INNER JOIN Poules P ON U.UserId = P.Creator
      INNER JOIN Matches M ON MP.MatchId = M.MatchId
      WHERE P.PouleId = ? AND P.PouleLeague = M.LeagueId AND P.PouleSeason = M.SeasonId
      UNION
      SELECT MP.UserId, U.Username, U.FirstName, U.LastName, SUM(CASE
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          ELSE 0
      END) AS Points
      FROM Users U
      INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
      INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
      INNER JOIN PouleParticipants PP ON U.UserId = PP.UserId
      INNER JOIN Poules P ON PP.PouleId = P.PouleId
      INNER JOIN Matches M ON MP.MatchId = M.MatchId
      WHERE P.PouleId = ? AND P.PouleLeague = M.LeagueId AND P.PouleSeason = M.SeasonId AND PP.Approved = 1
      ORDER BY Points DESC
      `,
      [pid, pid, pid, pid, pid, pid, pid, pid, pid, pid, pid, pid]
    )

    return {
      props: {
        pouleInfo: JSON.parse(JSON.stringify(pouleInfo[0])),
        poulePositions: JSON.parse(JSON.stringify(poulePositions)),
        isCreator: pouleInfo[0].Creator === uid,
        message: message
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = 'Something went wrong'

    return {
      props: {
        message: message
      }
    }
  }
}
)
