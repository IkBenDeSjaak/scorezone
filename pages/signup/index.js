import styles from './SignUp.module.css'

import Layout from '../../components/Layout'
import { useState } from 'react'

export default function SignUp () {
  const [inputFields, setInputFields] = useState({
    email: '',
    username: '',
    password: '',
  })

  const inputsHandler = (e) =>{
    setInputFields( {...inputFields, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/signup', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputFields)
    }).then(res => res.json())
    console.log(response)
  }

  return (
    <>
      <Layout>
        <h2>Sign up</h2>
        <p>Create your own account and start predicting!</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor='email'>Email<input className={styles.input} onChange={inputsHandler} name="email" id='email' type='email' /></label>
          <label className={styles.label} htmlFor='username'>Username<input className={styles.input} onChange={inputsHandler} name="username" id='username' type='text' /></label>
          <label className={styles.label} htmlFor='password'>Password<input className={styles.input} onChange={inputsHandler} name="password" id='password' type='password' /></label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Signup' /></label>
        </form>
      </Layout>
    </>
  )
}
