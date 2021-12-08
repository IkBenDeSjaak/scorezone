import styles from './SignUp.module.css'

import { withSessionSsr } from '../../lib/withSession'
import Layout from '../../components/Layout'
import Message from '../../components/Message'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SignUp () {
  const router = useRouter()
  const [inputFields, setInputFields] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [message, setMessage] = useState({})

  const handleCloseMessage = () => {
    setMessage({})
  }

  const inputsHandler = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const abortController = new AbortController()

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: abortController.signal,
      body: JSON.stringify(inputFields)
    })

    if (response.status === 201) {
      router.push('/login')
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
        <h2>Sign up</h2>
        <p>Create your own account and start predicting!</p>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='email'>Email<input className={styles.input} required maxLength='64' name='email' id='email' type='email' value={inputFields.email} onChange={inputsHandler} /></label>
          <label className={styles.label} htmlFor='username'>Username<input className={styles.input} required minLength='6' maxLength='20' name='username' id='username' type='text' value={inputFields.username} onChange={inputsHandler} /></label>
          <label className={styles.label} htmlFor='password'>Password<input className={styles.input} required minLength='8' maxLength='50' name='password' id='password' type='password' value={inputFields.password} onChange={inputsHandler} /></label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Signup' /></label>
        </form>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const user = req.session.user

  if (user) {
    return {
      redirect: {
        destination: '/predictions',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
)
