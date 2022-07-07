import styles from './Leagues.module.css'

import { withSessionSsr } from '../../../lib/withSession'
import { useEffect, useState } from 'react'
import Message from '../../../components/Message'
import Layout from '../../../components/Layout'
import BackButton from '../../../components/BackButton'

import { getAssociations } from '../../api/associations'

export default function AdminLeagues ({ reqMessage, associations }) {
  const [leagues, setLeagues] = useState([])
  const [inputFields, setInputFields] = useState({
    leagueName: '',
    associationId: ''
  })
  const [message, setMessage] = useState(reqMessage)

  const fetchLeagues = async () => {
    const abortController = new AbortController()

    const fetchData = async () => {
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
    }

    fetchData()

    return () => abortController?.abort()
  }

  useEffect(() => {
    fetchLeagues()

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

    const response = await fetch('/api/leagues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      setInputFields({ ...inputFields, leagueName: '' })

      fetchLeagues()
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
        <h2>Available leagues</h2>
        <ul>
          {leagues?.map((league) => (
            <li key={league.LeagueId.toString()}>{league.LeagueName}</li>
          ))}
        </ul>
        <h2 className={styles.h2}>Add new leagues to the list</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='association'>
            Association
            <select className={styles.select} required name='associationId' id='association' value={inputFields.associationId} onChange={inputsHandler}>
              <option value='' disabled hidden>Choose an association...</option>
              {associations?.map((ass) => (
                <option key={ass.AssociationId.toString()} value={ass.AssociationId}>{ass.AssociationName}</option>
              ))}
            </select>
          </label>
          <label className={styles.label} htmlFor='leagueName'>Name of the new league
            <input className={styles.input} required minLength='4' maxLength='25' id='leagueName' name='leagueName' type='text' value={inputFields.leagueName} onChange={inputsHandler} />
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
    const associations = await getAssociations()

    return {
      props: {
        reqMessage: message,
        associations: JSON.parse(JSON.stringify(associations))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        associations: []
      }
    }
  }
}
)
