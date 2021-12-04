import styles from './LeagueRanking.module.css'

import { getLeagueSeasonsData } from '../api/leagues/[lid]/seasons'
import { getLeagueData } from '../api/leagues/[lid]'
import Link from 'next/link'
import { withSessionSsr } from '../../lib/withSession'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Pagination from '../../components/Pagination'
import { useEffect, useState } from 'react'
import Message from '../../components/Message'

export default function LeagueRanking ({ reqMessage, amountOfPages, leagueName, leagueSeasons }) {
  const router = useRouter()
  const { lid, page } = router.query

  const [season, setSeason] = useState(leagueSeasons[0]?.SeasonId ? leagueSeasons[0]?.SeasonId : '')
  const [message, setMessage] = useState(reqMessage)
  const [rankings, setRankings] = useState([])

  useEffect(async () => {
    const abortController = new AbortController()

    const response = await fetch(`/api/leagues/${lid}/ranking?page=${page}&season=${season}`, {
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

    return () => abortController?.abort()
  }, [page, season])

  const onChangeSeasonHandler = (e) => {
    const target = e.target
    const value = target.value

    setSeason(value)
  }

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} />
        )}
        <p className={styles.backButton}>
          <Link href='/rankings'>
            <a>← Back to ranking overview</a>
          </Link>
        </p>
        <h1>Ranking</h1>
        <div className={styles.rankingInfo}>
          <h2>{leagueName}</h2>
          {
            leagueSeasons.length > 0
              ? (
                <select className={styles.selectSeason} name='SeasonId' id='Season' value={season} onChange={onChangeSeasonHandler}>
                  {leagueSeasons?.map((season) => (
                    <option key={season.SeasonId.toString()} value={season.SeasonId}>{season.SeasonName}</option>
                  ))}
                </select>
                )
              : ('')
          }
        </div>
        <div className={styles.rankings}>
          <table>
            <thead>
              <tr>
                <th className={styles.rankingsPosition} scope='col'>Pos</th>
                <th scope='col'>User</th>
                <th scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((user, index) => (
                <tr key={user.UserId}>
                  <td className={styles.rankingsPosition}>{user.Points === rankings[index - 1]?.Points ? '' : index + 1}</td>
                  <td>{user.Username}</td>
                  <td className={styles.rankingsPointsData}>{user.Points ? user.Points : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} amountOfPages={amountOfPages} />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  query,
  params,
  req,
  res
}) {
  const lid = params.lid
  const page = Number(query.page)
  let leagueName = ''
  const message = {
    type: '',
    message: ''
  }

  try {
    const leagueSeasons = await getLeagueSeasonsData(lid)

    const leagueInfo = await getLeagueData(lid)

    if (!leagueInfo) {
      message.type = 'danger'
      message.message = 'There is no league with this id'
    } else {
      leagueName = leagueInfo.LeagueName
    }

    const itemsPerPage = 25
    const amountOfPages = Math.ceil(leagueInfo.Participants / itemsPerPage)

    if (amountOfPages > 0) {
      if (page > amountOfPages) {
        return {
          redirect: {
            permanent: false,
            destination: `?page=${amountOfPages}`
          }
        }
      } else if (page < 1 || isNaN(page)) {
        return {
          redirect: {
            permanent: false,
            destination: `?page=${1}`
          }
        }
      }
    }

    return {
      props: {
        reqMessage: message,
        page: page,
        amountOfPages: amountOfPages,
        leagueName: leagueName,
        leagueSeasons: JSON.parse(JSON.stringify(leagueSeasons))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        page: 1,
        amountOfPages: 1,
        leagueName: leagueName,
        leagueSeasons: []
      }
    }
  }
}
)
