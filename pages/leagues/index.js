import styles from './Leagues.module.css'

import { withSessionSsr } from '../../lib/withSession'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import Message from '../../components/Message'

export default function Leagues ({ user }) {
  const [message, setMessage] = useState({})
  const [leagues, setLeagues] = useState([])
  const [userLeagues, setUserLeagues] = useState([])

  useEffect(async () => {
    if (user) {
      const abortController = new AbortController()

      const response = await fetch('/api/leagues', {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setLeagues(responseJson)
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
  }, [])

  useEffect(async () => {
    if (user) {
      const abortController = new AbortController()

      const response = await fetch('/api/user/leagues', {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setUserLeagues(responseJson)
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
  }, [])

  const handleCloseMessage = () => {
    setMessage({})
  }

  const handleSubmit = async (leagueId) => {
    const abortController = new AbortController()

    if (userLeagues.includes(leagueId)) {
      const response = await fetch(`api/user/leagues/${leagueId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify(leagueId)
      })

      if (response.status === 200) {
        const updatedUserLeagues = userLeagues.filter(league => league !== leagueId)

        setUserLeagues(updatedUserLeagues)
      } else {
        const responseJson = await response.json()
        const newMessage = {
          type: 'danger',
          message: responseJson.message
        }

        setMessage(newMessage)
      }
    } else {
      const response = await fetch('api/user/leagues/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify(leagueId)
      })

      if (response.status === 201) {
        const updatedUserLeagues = [...userLeagues, leagueId]

        setUserLeagues(updatedUserLeagues)
      } else {
        const responseJson = await response.json()
        const newMessage = {
          type: 'danger',
          message: responseJson.message
        }

        setMessage(newMessage)
      }
    }

    return () => abortController?.abort()
  }

  return (
    <>
      <Layout>
        <div>
          {(message.type && message.message) && (
            <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
          )}
          <h1>Leagues</h1>
          <h3 className={styles.fontWeightNormal}>Select all leagues from which you want to predict matches!</h3>
          {(user && leagues.length > 0)
            ? (
              <div className={styles.leaguesContainer}>
                <div className={styles.leagueRows}>
                  {leagues?.map((league) => (
                    <div key={league.LeagueId.toString()} className={`${styles.leagueRow}`}>
                      <label htmlFor={league.LeagueName}>{league.LeagueName}</label>
                      <div className={styles.divInput}>
                        <input type='checkbox' name={league.LeagueId} id={league.LeagueName} checked={userLeagues.includes(league.LeagueId)} value={league.LeagueId} onChange={() => handleSubmit(league.LeagueId)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )
            : (<p>You can select leagues to predict when you're logged in.</p>)}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res
}) {
  const user = req.session.user

  if (user) {
    return {
      props: {
        user: user.id
      }
    }
  }

  return {
    props: {}
  }
}
)
