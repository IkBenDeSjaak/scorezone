import styles from './Leagues.module.css'

import { withSessionSsr } from '../../lib/withSession'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'

export default function Leagues ({ user }) {
  const [leagues, setLeagues] = useState([])
  const [userLeagues, setUserLeagues] = useState([])

  useEffect(async () => {
    if (user) {
      const leagues = await fetch('/api/leagues', {
        method: 'GET'
      }).then((res) => res.json())

      const userLeagues = await fetch('/api/user/leagues', {
        method: 'GET'
      }).then(res => res.json())

      setLeagues(leagues)
      setUserLeagues(userLeagues)
    }
  }, [])

  const handleSubmit = (leagueId) => {
    let updatedUserLeagues = []

    if (userLeagues.includes(leagueId)) {
      updatedUserLeagues = userLeagues.filter(league => league !== leagueId)
      fetch(`api/user/leagues/${leagueId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueId)
      })
    } else {
      updatedUserLeagues = [...userLeagues, leagueId]
      fetch('api/user/leagues/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueId)
      })
    }

    setUserLeagues(updatedUserLeagues)
  }

  return (
    <>
      <Layout>
        <div>
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
