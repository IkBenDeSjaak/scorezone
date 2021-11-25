import styles from './CreatePoule.module.css'

import { withSessionSsr } from '../../lib/withSession'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import Layout from '../../components/Layout'

export default function CreatePoule () {
  const router = useRouter()
  const [leagues, setLeagues] = useState([])
  const [inputFields, setInputFields] = useState({
    pouleName: '',
    leagueId: '',
    approveParticipants: true
  })
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(async () => {
    const leagues = await fetch('/api/leagues', {
      method: 'GET'
    }).then((res) => res.json())

    setInputFields({ ...inputFields, leagueId: leagues[0].LeagueId })
    setLeagues(leagues)
  }, [])

  const inputsHandler = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    console.log(name)
    console.log(value)
    setInputFields({ ...inputFields, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('/api/user/poules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      router.push('/poules')
    } else {
      const responseJson = await response.json()
      setErrorMessage(responseJson.message)
    }
  }

  return (
    <>
      <Layout>
        <h1>Create a new poule!</h1>
        {errorMessage ? <ErrorMessage message={errorMessage} /> : ''}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='pouleName'>Name of the poule
            <input className={styles.input} id='pouleName' name='pouleName' type='text' onChange={inputsHandler} />
          </label>
          <label className={styles.label} htmlFor='league'>
            League
            <select className={styles.select} name='leagueId' id='league' value={inputFields.leagueId} onChange={inputsHandler}>
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
  req,
  res
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
