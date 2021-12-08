import styles from './Predict.module.css'

import { withSessionSsr } from '../../lib/withSession'
import { querydb } from '../../lib/db'
import { convertDateToShortDateString, convertDateToTimeString, convertDateToShortMonthString, convertDateToDayOfMonth, convertDateToYear, calculateFromDate, calculateTillDate } from '../../lib/dates'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import Message from '../../components/Message'
import Link from 'next/link'

export default function Predictions ({ weeks, reqSelectedWeek, reqMessage }) {
  const [message, setMessage] = useState(reqMessage)
  const [predictions, setPredictions] = useState({})
  const [selectedWeek, setSelectedWeek] = useState(reqSelectedWeek)

  useEffect(async () => {
    const abortController = new AbortController()

    const response = await fetch(`/api/user/predictions?fromDate=${selectedWeek}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal
    })

    if (response.status !== 200) {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    } else {
      const responseJson = await response.json()
      setPredictions(responseJson)
    }

    return () => abortController?.abort()
  }, [selectedWeek])

  const handleCloseMessage = () => {
    setMessage({})
  }

  const changeSelectedWeek = (e) => {
    setSelectedWeek(e.target.value)
  }

  const inputChangeHandler = async (league, matchId, teamIdentifier, goals) => {
    const leagueMatches = await Promise.all(predictions[league].map(async (p) => {
      if (p.MatchId === matchId && goals >= 0 && goals <= 20) {
        p[teamIdentifier] = goals
      }

      return p
    }))

    const newPredictions = {
      ...predictions,
      [league]: leagueMatches

    }

    setPredictions(newPredictions)

    for (const match of leagueMatches) {
      if (match.MatchId === matchId) {
        if ((match.GoalsHomeTeamPrediction !== null && match.GoalsAwayTeamPrediction !== null)) {
          const body = {
            goalsHomeTeam: match.GoalsHomeTeamPrediction,
            goalsAwayTeam: match.GoalsAwayTeamPrediction
          }

          const response = await fetch(`/api/user/predictions/matches/${matchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })

          if (response.status !== 200) {
            const responseJson = await response.json()
            const newMessage = {
              type: 'danger',
              message: responseJson.message
            }

            setMessage(newMessage)
          }
        }
      }
    }
  }

  return (
    <>
      <Layout>
        <div>
          {(message.type && message.message) && (
            <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
          )}
          {weeks.length > 0
            ? (
              <div className={styles.selectWeek}>
                <label className={styles.selectWeekLabel} htmlFor='week'>
                  Select a week:
                  <select className={styles.selectWeekSelect} id='week' name='week' value={selectedWeek} onChange={changeSelectedWeek}>
                    {weeks.map((week) => (
                      <option key={week.fromDate} value={week.fromDate}>{week.optionText}</option>
                    ))}
                  </select>
                </label>
              </div>
              )
            : <p className={styles.alignCenter}>You did not select any leagues to predict yet. Go to <Link href='/leagues'><a className={styles.inlineClickable}>leagues</a></Link> to select leagues you want to predict matches from.</p>}
          {
            Object.keys(predictions).length > 0
              ? (
                  Object.keys(predictions).map((league) => (
                    <div key={league}>
                      {predictions[league].length > 0
                        ? (
                          <>
                            <div className={styles.leagueContainer}>
                              <div className={styles.leagueName}>{league}</div>
                              {predictions[league].map((p) => (
                                <div key={p.MatchId} className={`${styles.gameRow}`}>
                                  <div className={styles.dateTime}>
                                    <p className={styles.day}>{convertDateToShortDateString(p.StartDateTime)}</p>
                                    <p className={styles.time}>{convertDateToTimeString(p.StartDateTime)}</p>
                                  </div>
                                  <div className={styles.teams}>
                                    <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignRight}`}>
                                      <img className={`${styles.teamImage} ${styles.teamImageLeft}`} src={p.HomeTeamImage ? p.HomeTeamImage : 'https://via.placeholder.com/150'} alt={`${p.HomeTeam} logo`} />
                                      <label className={`${styles.teamLabel} ${styles.teamLabelLeft}`}>{p.HomeTeam}</label>
                                    </div>
                                    <div className={styles.scoreBlock}>
                                      <div>
                                        {(p.GoalsHomeTeam && p.GoalsAwayTeam)
                                          ? <p className={styles.actualScoreText}>{`${p.GoalsHomeTeam} - ${p.GoalsAwayTeam}`}</p>
                                          : ''}
                                      </div>
                                      <div className={styles.scoreInputs}>
                                        {Date.now() > Date.parse(p.StartDateTime)
                                          ? (
                                            <>
                                              <p className={`${styles.scoreInput} ${styles.scoreInputDisabled}`}>{p.GoalsHomeTeamPrediction}</p>
                                              <p className={styles.teamDivider}>-</p>
                                              <p className={`${styles.scoreInput} ${styles.scoreInputDisabled}`}>{p.GoalsAwayTeamPrediction}</p>
                                            </>
                                            )
                                          : (
                                            <>
                                              <input className={styles.scoreInput} min='0' max='20' type='number' value={p.GoalsHomeTeamPrediction !== null ? p.GoalsHomeTeamPrediction : ''} onChange={(e) => inputChangeHandler(league, p.MatchId, 'GoalsHomeTeamPrediction', e.target.value)} />
                                              <p className={styles.teamDivider}>-</p>
                                              <input className={styles.scoreInput} min='0' max='20' type='number' value={p.GoalsAwayTeamPrediction !== null ? p.GoalsAwayTeamPrediction : ''} onChange={(e) => inputChangeHandler(league, p.MatchId, 'GoalsAwayTeamPrediction', e.target.value)} />
                                            </>
                                            )}
                                      </div>
                                    </div>
                                    <div className={`${styles.teamAndImage} ${styles.teamAndImageAlignLeft}`}>
                                      <img className={`${styles.teamImage} ${styles.teamImageRight}`} src={p.AwayTeamImage ? p.AwayTeamImage : 'https://via.placeholder.com/150'} alt={`${p.AwayTeam} logo`} />
                                      <label className={`${styles.teamLabel} ${styles.teamLabelRight}`}>{p.AwayTeam}</label>
                                    </div>
                                  </div>
                                  <div className={styles.score}>
                                    <p>{p.Points}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                          )
                        : ''}
                    </div>
                  ))
                )
              : ''
          }
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const uid = req.session.user?.id
  const message = {
    type: '',
    message: ''
  }

  if (!uid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  try {
    // Select all unique dates on which matches start
    const matchStartTimes = await querydb(
      `
      SELECT DISTINCT DATE(M.StartTime) AS StartTime
      FROM Matches M
      INNER JOIN UserLeagues UL ON M.LeagueId = UL.LeagueId
      WHERE UL.UserId = ?
      ORDER BY StartTime ASC
      `,
      uid
    )

    const weeks = []

    // Create week option for every match starting date
    for (const startTime of matchStartTimes) {
      const fromDate = calculateFromDate(startTime.StartTime)

      const tillDate = calculateTillDate(fromDate)

      const weekOption = {
        fromDate: fromDate,
        tillDate: tillDate,
        optionText: `${convertDateToYear(fromDate)} | ${convertDateToDayOfMonth(fromDate)} ${convertDateToShortMonthString(fromDate)} - ${convertDateToDayOfMonth(tillDate)} ${convertDateToShortMonthString(tillDate)}`
      }

      weeks.push(weekOption)
    }

    // Remove duplicate weeks from array
    const filteredWeeks = weeks.filter((week, index, array) => {
      return index === array.findIndex((t) => (
        t.optionText === week.optionText
      ))
    })

    return {
      props: {
        weeks: JSON.parse(JSON.stringify(filteredWeeks)),
        reqSelectedWeek: JSON.parse(JSON.stringify(filteredWeeks.length > 0 ? filteredWeeks[filteredWeeks.length - 1].fromDate : calculateFromDate(new Date()))),
        reqMessage: message
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        weeks: [],
        reqSelectedWeek: calculateFromDate(new Date()),
        reqMessage: message
      }
    }
  }
}
)
