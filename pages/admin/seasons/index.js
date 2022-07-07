import styles from './Seasons.module.css'

import { convertDateTimeToDate } from '../../../lib/dates'
import { withSessionSsr } from '../../../lib/withSession'
import { useEffect, useState } from 'react'
import BackButton from '../../../components/BackButton'
import Message from '../../../components/Message'
import Layout from '../../../components/Layout'

export default function AdminSeasons () {
  const [seasons, setSeasons] = useState([])
  const [inputFields, setInputFields] = useState({
    seasonName: '',
    seasonStartDate: '',
    seasonEndDate: ''
  })
  const [message, setMessage] = useState({})

  const fetchSeasons = async () => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch('/api/seasons', {
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const abortController = new AbortController()

    const response = await fetch('/api/seasons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      setInputFields({ ...inputFields, seasonName: '', seasonStartDate: '', seasonEndDate: '' })

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
        <BackButton href='/admin' backTo='admin main page' />
        <h1>Admin</h1>
        <h2>Available seasons</h2>
        <ul>
          {seasons?.map((season) => (
            <li key={season.SeasonId.toString()}>{season.SeasonName} <span className={styles.smalltext}>from {convertDateTimeToDate(season.StartDate)} till {convertDateTimeToDate(season.EndDate)}</span></li>
          ))}
        </ul>
        <h2 className={styles.h2}>Add new seasons to the list</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='seasonName'>Name of the new season
            <input className={styles.input} required minLength='4' maxLength='15' id='seasonName' name='seasonName' type='text' value={inputFields.seasonName} onChange={inputsHandler} />
          </label>
          <label className={styles.label} htmlFor='seasonStartDate'>Start date of the season
            <input className={styles.input} required id='seasonStartDate' name='seasonStartDate' type='date' value={inputFields.seasonStartDate} onChange={inputsHandler} />
          </label>
          <label className={styles.label} htmlFor='seasonEndDate'>End date of the season
            <input className={styles.input} required id='seasonEndDate' name='seasonEndDate' type='date' value={inputFields.seasonEndDate} onChange={inputsHandler} />
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
  req
}) {
  const uid = req.session.user?.id
  const role = req.session.user?.role

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

  return {
    props: {}
  }
}
)
