import styles from './Matches.module.css'

import { withSessionSsr } from '../../../../../../lib/withSession'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Message from '../../../../../../components/Message'
import Layout from '../../../../../../components/Layout'
import { getTeamsFromLeagueSeason } from '../../../../../api/leagues/[lid]/seasons/[sid]/teams'
import { convertDateTimeToLocalDateTime } from '../../../../../../lib/dates'

export default function AdminMatchesFromLeagueSeason({ reqMessage, teams }) {
  const router = useRouter()
  const { lid, sid } = router.query

  const [matches, setMatches] = useState([])
  const [inputFields, setInputFields] = useState({
    homeTeam: '',
    awayTeam: '',
    matchDay: 1,
    matchStartTime: ''
  })
  const [message, setMessage] = useState(reqMessage)

  const fetchMatches = async () => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch(`/api/leagues/${lid}/seasons/${sid}/matches`, {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setMatches(responseJson)
      } else {
        const responseJson = await response.json()
        const newMessage = {
          type: 'danger',
          message: responseJson.message
        }

        setMessage(newMessage)
      }
    }

    fetchData()

    return () => abortController?.abort()
  }

  useEffect(() => {
    fetchMatches()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseMessage = () => {
    setMessage({})
  }

  const inputsHandler = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setInputFields({ ...inputFields, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const abortController = new AbortController()

    const response = await fetch(`/api/leagues/${lid}/seasons/${sid}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      setInputFields({ ...inputFields, homeTeam: '', awayTeam: '' })

      fetchMatches()
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

  console.log(matches)

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <p className={styles.backButton}>
          <Link href={`/admin/leagues/${lid}`}>
            <a>← Back to season choice page</a>
          </Link>
        </p>
        <h1>Admin</h1>
        <h2>Available matches</h2>
        <div className={styles.rankings}>
          {matches.length > 0
            ? (
              <table>
                <thead>
                  <tr>
                    <th scope='col'>MatchDay</th>
                    <th scope='col'>Start time</th>
                    <th scope='col'>Home team</th>
                    <th scope='col'>Away team</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    matches.map((match) => (
                      <tr key={match.MatchId.toString()}>
                        <td>{match.MatchDay}</td>
                        <td>{convertDateTimeToLocalDateTime(match.StartTime)}</td>
                        <td>{match.HomeTeamName}</td>
                        <td>{match.AwayTeamName}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
            : <p>No matches found.</p>}
        </div>
        <h2 className={styles.h2}>Add new match</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='homeTeam'>
            Home Team
            <select className={styles.select} required name='homeTeam' id='homeTeam' value={inputFields.homeTeam} onChange={inputsHandler}>
              <option value='' disabled hidden>Choose a team...</option>
              {teams?.map((team) => (
                <option key={team.TeamId.toString()} value={team.TeamId}>{team.TeamName}</option>
              ))}
            </select>
          </label>
          <label className={styles.label} htmlFor='awayTeam'>
            Away Team
            <select className={styles.select} required name='awayTeam' id='awayTeam' value={inputFields.awayTeam} onChange={inputsHandler}>
              <option value='' disabled hidden>Choose a team...</option>
              {teams?.map((team) => (
                <option key={team.TeamId.toString()} value={team.TeamId}>{team.TeamName}</option>
              ))}
            </select>
          </label>
          <label className={styles.label} htmlFor='matchDay'>Matchday
            <input className={styles.input} required min='1' max='100' id='matchDay' name='matchDay' type='number' value={inputFields.matchDay} onChange={inputsHandler} />
          </label>
          <label className={styles.label} htmlFor='matchStartTime'>Start time
            <input className={styles.input} required id='matchStartTime' name='matchStartTime' type='datetime-local' value={inputFields.matchStartTime} onChange={inputsHandler} />
          </label>
          <label className={styles.label}>
            <input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Add' />
          </label>
        </form>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req, params
}) {
  const uid = req.session.user?.id
  const role = req.session.user?.role
  const { lid, sid } = params
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

  if (role !== 'Admin') {
    return {
      notFound: true
    }
  }

  try {
    const teams = await getTeamsFromLeagueSeason(lid, sid)

    return {
      props: {
        reqMessage: message,
        teams: JSON.parse(JSON.stringify(teams))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        teams: []
      }
    }
  }
}
)
