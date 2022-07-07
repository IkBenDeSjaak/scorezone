import styles from './LeagueSeasons.module.css'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { withSessionSsr } from '../../../../lib/withSession'
import Layout from '../../../../components/Layout'
import Message from '../../../../components/Message'
import BackButton from '../../../../components/BackButton'
import { getAllSeasonsData } from '../../../api/seasons'

export default function AdminLeagueSeasons({ reqMessage, allSeasons }) {
  const router = useRouter()
  const { lid } = router.query

  const [seasons, setSeasons] = useState([])
  const [inputFields, setInputFields] = useState({
    seasonId: ''
  })
  const [message, setMessage] = useState(reqMessage)

  const fetchSeasons = async () => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch(`/api/leagues/${lid}/seasons`, {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setSeasons(responseJson)
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
    fetchSeasons()
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

  console.log(inputFields)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const abortController = new AbortController()

    const response = await fetch(`/api/leagues/${lid}/seasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      setInputFields({ ...inputFields, seasonId: '' })

      fetchSeasons()
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

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <BackButton href={`/admin/matchleagues`} backTo='match leagues page' />
        <h1>Admin</h1>
        <h2>Add another season to this league</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='season'>
            Available seasons
            <select className={styles.select} required name='seasonId' id='season' value={inputFields.seasonId} onChange={inputsHandler}>
              <option value='' disabled hidden>Choose a season...</option>
              {allSeasons?.map((season) => (
                <option key={season.SeasonId.toString()} value={season.SeasonId}>{season.SeasonName}</option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            <input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Add' />
          </label>
        </form>
        <h2>Select season</h2>
        <p>Select a season from this league to manage the matches from.</p>
        <div className={styles.actions}>
          {seasons?.map((season) => (
            <Link key={season.SeasonId.toString()} href={`/admin/leagues/${lid}/seasons/${season.SeasonId}/matches`}>
              <a className={styles.actionCard}>{season.SeasonName}</a>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const uid = req.session.user?.id
  const role = req.session.user?.role
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
    const allSeasons = await getAllSeasonsData()

    return {
      props: {
        reqMessage: message,
        allSeasons: JSON.parse(JSON.stringify(allSeasons))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        allSeasons: []
      }
    }
  }
}
)
