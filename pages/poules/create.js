import styles from './CreatePoule.module.css'

import { withSessionSsr } from '../../lib/withSession'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Message from '../../components/Message'
import Layout from '../../components/Layout'

export default function CreatePoule () {
  const router = useRouter()
  const [leagues, setLeagues] = useState([])
  const [inputFields, setInputFields] = useState({
    pouleName: '',
    leagueId: '',
    approveParticipants: true
  })
  const [message, setMessage] = useState({})

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const response = await fetch('/api/leagues', {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setInputFields((prevInputFields) => ({ ...prevInputFields, leagueId: responseJson[0].LeagueId }))
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

    const response = await fetch('/api/poules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      router.push('/poules')
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
        <h1>Create a new poule!</h1>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='pouleName'>Name of the poule
            <input className={styles.input} required maxLength='25' id='pouleName' name='pouleName' type='text' onChange={inputsHandler} />
          </label>
          <label className={styles.label} htmlFor='league'>
            League
            <select className={styles.select} required name='leagueId' id='league' value={inputFields.leagueId} onChange={inputsHandler}>
              {leagues?.map((league) => (
                <option key={league.LeagueId.toString()} value={league.LeagueId}>{league.LeagueName}</option>
              ))}
            </select>
          </label>
          <label className={styles.labelapprove} htmlFor='approveParticipants'>
            <input className={styles.inputapprove} name='approveParticipants' id='approveParticipants' type='checkbox' checked={inputFields.approveParticipants} onChange={inputsHandler} />
            I want to be able to approve/disapprove new members
          </label>
          <label className={styles.label}>
            <input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Create poule' />
          </label>
        </form>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const user = req.session.user

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
)
