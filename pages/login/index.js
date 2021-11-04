import styles from './login.module.css'
import Layout from '../../components/layout'

export default function Login () {
  return (
    <>
      <Layout>
        <h2>Login</h2>
        <p>Login with your username and password.</p>
        <form className={styles.form} onSubmit={console.log('submit')}>
          <label className={styles.label} htmlFor='username'>Username<input className={styles.input} id='username' type='text' /></label>
          <label className={styles.label} htmlFor='password'>Password<input className={styles.input} id='password' type='password' /></label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitbutton' type='submit' value='Login' /></label>
          <label className={styles.labelrememberme}>
            <input className={styles.inputrememberme} defaultChecked name='rememberme' id='rememberme' type='checkbox' />
            Remember me
          </label>
        </form>
      </Layout>
    </>
  )
}
