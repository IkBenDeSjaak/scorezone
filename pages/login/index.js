import styles from './Login.module.css'

import { useState } from 'react'
import Layout from '../../components/Layout'
import Message from '../../components/Message'
import useUser from '../../lib/useUser'
import fetcher, { FetchError } from '../../lib/fetcher'

export default function Login () {
  const { mutateUser } = useUser({
    redirectTo: '/predictions',
    redirectIfFound: true
  })
  const [inputFields, setInputFields] = useState({
    username: '',
    password: ''
    // rememberme: false
  })
  const [message, setMessage] = useState({})

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
    try {
      mutateUser(
        await fetcher('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputFields)
        })
      )
    } catch (error) {
      if (error instanceof FetchError) {
        const newMessage = {
          type: 'danger',
          message: error.data.message
        }
        setMessage(newMessage)
      } else {
        const newMessage = {
          type: 'danger',
          message: error.message
        }
        setMessage(newMessage)
      }
    }
  }

  return (
    <>
      <Layout>
        <h2>Login</h2>
        <p>Login with your username and password.</p>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='username'>Username<input className={styles.input} required name='username' id='username' type='text' value={inputFields.username} onChange={inputsHandler} /></label>
          <label className={styles.label} htmlFor='password'>Password<input className={styles.input} required name='password' id='password' type='password' value={inputFields.password} onChange={inputsHandler} /></label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Login' /></label>
          {/* <label className={styles.labelrememberme}>
            <input className={styles.inputrememberme} name='rememberme' id='rememberme' type='checkbox' checked={inputFields.rememberme} onChange={inputsHandler} />
            Remember me
          </label> */}
        </form>
      </Layout>
    </>
  )
}
