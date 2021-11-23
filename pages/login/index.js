import styles from './Login.module.css'

import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function Login () {
  const router = useRouter()
  const [inputFields, setInputFields] = useState({
    username: '',
    password: '',
    // rememberme: false
  })
  const [errorMessage, setErrorMessage] = useState('')

  const inputsHandler = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setInputFields({ ...inputFields, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputFields)
    })
    if (response.status === 200) {
      router.push('/predictions')
    } else {
      const responseJson = await response.json()
      setErrorMessage(responseJson.message)
    }
  }

  return (
    <>
      <Layout>
        <h2>Login</h2>
        <p>Login with your username and password.</p>
        {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : ''}
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
