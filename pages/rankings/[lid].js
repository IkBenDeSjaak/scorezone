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
import { FaSort } from 'react-icons/fa'

export default function LeagueRanking ({ reqMessage, amountOfPages, leagueName, leagueSeasons }) {
  const router = useRouter()
  const { lid, page, season, sortCol } = router.query

  const [message, setMessage] = useState(reqMessage)
  const [rankings, setRankings] = useState([])

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch(`/api/leagues/${lid}/ranking?page=${page}&season=${season}&sortCol=${sortCol}`, {
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
  }, [lid, page, season, sortCol])

  const handleCloseMessage = () => {
    setMessage({})
  }

  const onChangeSeasonHandler = (e) => {
    const target = e.target
    const value = target.value

    router.push({
      pathname: `/rankings/${lid}`,
      query: {
        page: 1,
        season: value
      }
    })
  }

  const onChangeSortHandler = (col) => {
    router.push({
      pathname: `/rankings/${lid}`,
      query: {
        page: 1,
        season: season,
        sortCol: col
      }
    })
  }

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
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
                <th className={styles.sortableColumn} scope='col' onClick={() => onChangeSortHandler('Points')}>Points <FaSort className={styles.sortIcon} /></th>
                <th className={styles.sortableColumn} scope='col' onClick={() => onChangeSortHandler('WinnerCorrect')}>Times winner correct <FaSort className={styles.sortIcon} /></th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((user, index) => (
                <tr key={user.UserId}>
                  <td className={styles.rankingsPosition}>{user.Points === rankings[index - 1]?.Points ? '' : index + 1}</td>
                  <td>{user.Username}</td>
                  <td className={`${styles.rankingsPointsData} ${styles.dataBold}`}>{user.Points ? user.Points : '-'}</td>
                  <td className={styles.dataBold}>{user.WinnerCorrect ? user.WinnerCorrect : '-'}</td>
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
  params
}) {
  const lid = params.lid
  const { page, season } = query
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

    if (!page || !season) {
      return {
        redirect: {
          permanent: false,
          destination: `/rankings/${lid}?page=${!page ? 1 : page}&season=${!season ? leagueSeasons[0]?.SeasonId : season}`
        }
      }
    }

    const itemsPerPage = 25
    const amountOfPages = Math.ceil(leagueInfo.Participants / itemsPerPage)

    if (amountOfPages > 0) {
      if (page > amountOfPages) {
        return {
          redirect: {
            permanent: false,
            destination: `/rankings/${lid}?page=${amountOfPages}&season=${leagueSeasons[0]?.SeasonId}`
          }
        }
      } else if (page < 1 || isNaN(page)) {
        return {
          redirect: {
            permanent: false,
            destination: `/rankings/${lid}?page=${1}&season=${leagueSeasons[0]?.SeasonId}`
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
