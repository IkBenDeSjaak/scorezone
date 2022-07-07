import styles from './Poule.module.css'

import { querydb } from '../../../lib/db'
import Link from 'next/link'
import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import BackButton from '../../../components/BackButton'
import Layout from '../../../components/Layout'
import Message from '../../../components/Message'
import { getPouleInfoData } from '../../api/poules/[pid]'
import useUser from '../../../lib/useUser'
import { useState } from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import SweetAlert from 'react-bootstrap-sweetalert'

export default function Poule({ pouleInfo, poulePositions, isCreator, isParticipant, reqMessage }) {
  const router = useRouter()
  const { pid } = router.query

  const { user } = useUser()
  const [message, setMessage] = useState(reqMessage)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleCloseMessage = () => {
    setMessage({})
  }

  const onLeavePoule = async () => {
    const abortController = new AbortController()

    const response = await fetch(`/api/poules/${pid}/participants/${user.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal
    })

    if (response.status === 200) {
      router.push('/poules')
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }

    return () => abortController?.abort()
  }

  const onKickUser = async () => {
    const abortController = new AbortController()

    const response = await fetch(`/api/poules/${pid}/participants/${selectedUser}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal
    })

    if (response.status === 200) {
      router.push('/poules')
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }

    return () => abortController?.abort()
  }

  const showDialog = () => {
    setDialogVisible(true)
  }

  const closeDialog = () => {
    setDialogVisible(false)
  }

  return (
    <>
      <Layout>
        <BackButton href={`/poules`} backTo='poules' />
        <h1 className={styles.pouleName}>{pouleInfo.PouleName}</h1>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        {(dialogVisible) && (
          <SweetAlert
            custom
            title='Kick user'
            onCancel={closeDialog}
            onConfirm={onKickUser}
            closeOnClickOutside
            customButtons={
              <>
                <button className={`${styles.dialogButton}`} onClick={closeDialog}>Cancel</button>
                <button className={`${styles.dialogButton} ${styles.deleteConfirm}`} onClick={onKickUser}>Yes</button>
              </>
            }
          >
            Are you sure you want to kick this user from your poule?
          </SweetAlert>
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
                poulePositions.map((u, index) => (
                  <tr key={u.UserId.toString()}>
                    <td>{u.Points === poulePositions[index - 1]?.Points ? '' : index + 1}</td>
                    <td>{u.Username} {(isCreator && user.id !== u.UserId)
                      ? <FaRegTimesCircle
                        className={styles.deleteUserButton} onClick={() => {
                          setSelectedUser(u.UserId)
                          showDialog()
                        }}
                      />
                      : ''}
                    </td>
                    <td className={styles.standingsName}>{`${u.FirstName ? u.FirstName : ''} ${u.LastName ? u.LastName : ''}`}</td>
                    <td>{u.Points}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {isCreator && (
          <p className={styles.button}><Link href={`/poules/${pid}/settings`}><a>Settings</a></Link></p>
        )}
        {isParticipant && (
          <button className={styles.leaveButton} onClick={onLeavePoule}>Leave poule</button>
        )}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  query,
  req
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
    const pouleInfo = await getPouleInfoData(pid)

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

    if (joincode) {
      if (uid) {
        if (!participantIds.includes(uid) && pouleInfo[0].Creator !== uid) {
          if (joincode === pouleInfo[0].JoinCode) {
            await querydb(
              `
              INSERT INTO PouleParticipants (PouleId, UserId, Approved) 
              VALUES (?, ?, ?)
              `,
              [pid, uid, (pouleInfo[0].ApproveParticipants === 1) ? 0 : 1]
            )

            message.type = 'success'
            message.message = 'You have succesfully joined this poule! You might have to wait till the owner of the poule approves you.'
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

    // 1. User is creator
    // 2. All poule participants
    // 3. User didn't fill in predictions yet
    const poulePositions = await querydb(
      `
      SELECT U.UserId, U.Username, U.FirstName, U.LastName, COALESCE(SUM(CASE
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
        ELSE 0
      END), 0) AS Points
      FROM Users U
      INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
      INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
      INNER JOIN Poules P ON U.UserId = P.Creator
      INNER JOIN Matches M ON MP.MatchId = M.MatchId
      WHERE P.PouleId = ? AND P.PouleLeague = M.LeagueId AND P.PouleSeason = M.SeasonId
      UNION
      SELECT U.UserId, U.Username, U.FirstName, U.LastName, COALESCE(SUM(CASE
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = P.PointsStrategy AND P.PouleId = ?)
          ELSE 0
      END), 0) AS Points
      FROM Users U
      INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
      INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
      INNER JOIN PouleParticipants PP ON U.UserId = PP.UserId
      INNER JOIN Poules P ON PP.PouleId = P.PouleId
      INNER JOIN Matches M ON MP.MatchId = M.MatchId
      WHERE P.PouleId = ? AND P.PouleLeague = M.LeagueId AND P.PouleSeason = M.SeasonId AND PP.Approved = 1
      GROUP BY U.UserId
      UNION
      SELECT U.UserId, U.Username, U.FirstName, U.LastName, 0 AS Points
      FROM Users U
      INNER JOIN PouleParticipants PP ON U.UserId = PP.UserId
      INNER JOIN Poules P ON PP.PouleId = P.PouleId
      WHERE P.PouleId = ? AND PP.Approved = 1 AND PP.UserId NOT IN (SELECT MP.UserId FROM MatchPredictions MP INNER JOIN Matches M ON MP.MatchId = M.MatchId WHERE M.LeagueId = P.PouleLeague AND M.SeasonId = P.PouleSeason)
      GROUP BY U.UserId
      ORDER BY Points DESC, Username ASC
      `,
      [pid, pid, pid, pid, pid, pid, pid, pid, pid, pid, pid, pid, pid]
    )

    return {
      props: {
        pouleInfo: JSON.parse(JSON.stringify(pouleInfo[0])),
        poulePositions: JSON.parse(JSON.stringify(poulePositions)),
        isCreator: pouleInfo[0].Creator === uid,
        isParticipant: participantIds.includes(uid),
        reqMessage: message
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message
      }
    }
  }
}
)
