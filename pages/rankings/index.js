import styles from './Rankings.module.css'

import { getAllSeasonsData } from '../api/seasons'
import { withSessionSsr } from '../../lib/withSession'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
import Message from '../../components/Message'
import { useRouter } from 'next/router'

export default function Rankings ({ seasons, reqMessage }) {
  const router = useRouter()
  const { season } = router.query

  const [message, setMessage] = useState(reqMessage)
  const [rankings, setRankings] = useState([])

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch(`/api/rankings?season=${season}`, {
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
        setRankings(responseJson)
      }
    }

    fetchData()

    return () => abortController?.abort()
  }, [season])

  const handleCloseMessage = () => {
    setMessage({})
  }

  const onChangeSeasonHandler = (e) => {
    const target = e.target
    const value = target.value

    router.push({
      pathname: '/rankings',
      query: { season: value }
    })
  }

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <h1>Rankings</h1>
        {
          seasons.length > 0
            ? (
              <select className={styles.selectSeason} name='SeasonId' id='Season' value={season} onChange={onChangeSeasonHandler}>
                {seasons?.map((s) => (
                  <option key={s.SeasonId.toString()} value={s.SeasonId}>{s.SeasonName}</option>
                ))}
              </select>
              )
            : ('')
        }
        <div className={styles.rankings}>
          {rankings.length > 0
            ? (
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
                  {
                    rankings.map((league) => (
                      <tr key={league.LeagueId.toString()}>
                        <td><Link href={`/rankings/${league.LeagueId}?page=1&season=${season}`}><a className={styles.leagueText}>{league.LeagueName}</a></Link></td>
                        <td className={styles.rankingsParticipants}>{league.Participants}</td>
                        <td className={styles.rankingsPositionData}>{league.Position}</td>
                        <td className={styles.rankingsPointsData}>{league.Points}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              )
            : <p>No leagues found.</p>}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  query
}) {
  const message = {
    type: '',
    message: ''
  }

  try {
    const { season } = query

    if (!season) {
      return {
        redirect: {
          destination: `/rankings?season=${1}`,
          permanent: false
        }
      }
    }

    const seasons = await getAllSeasonsData()

    return {
      props: {
        reqMessage: message,
        seasons: JSON.parse(JSON.stringify(seasons))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        seasons: []
      }
    }
  }
}
)
