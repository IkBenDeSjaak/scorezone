import styles from './signup.module.css'
import Layout from '../../components/layout'

export default function SignUp () {
  return (
    <>
      <Layout>
        <h2>Sign up</h2>
        <p>Create your own account and start predicting!</p>
        <form className={styles.form} onSubmit={console.log('submit')}>
          <label className={styles.label} htmlFor='email'>Email<input className={styles.input} id='email' type='email' /></label>
          <label className={styles.label} htmlFor='username'>Username<input className={styles.input} id='username' type='text' /></label>
          <label className={styles.label} htmlFor='password'>Password<input className={styles.input} id='password' type='password' /></label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Signup' /></label>
        </form>
      </Layout>
    </>
  )
}
