import styles from './SignUp.module.css'

import Layout from '../../components/Layout'
import ErrorMessage from '../../components/ErrorMessage'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SignUp () {
  const router = useRouter()
  const [inputFields, setInputFields] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('')

  const inputsHandler = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputFields)
    })

    if (response.status === 200) {
      router.push('/login')
    } else {
      const responseJson = await response.json()
      setErrorMessage(responseJson.message)
    }
  }

  return (
    <>
      <Layout>
        <h2>Sign up</h2>
        <p>Create your own account and start predicting!</p>
        {errorMessage ? <ErrorMessage message={errorMessage} /> : ''}
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
