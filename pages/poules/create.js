import styles from './CreatePoule.module.css'

import Layout from '../../components/Layout'

export default function CreatePoule () {
  return (
    <>
      <Layout>
        <h1>Create a new poule!</h1>
        <form className={styles.form} onSubmit={console.log('submit')}>
          <label className={styles.label} htmlFor='poulename'>Name of the poule
            <input className={styles.input} id='poulename' type='text' />
          </label>
          <label className={styles.label} htmlFor='league'>
            League
            <select className={styles.select} id='league' onChange={console.log('change')}>
              <option value='grapefruit'>Eredivisie</option>
              <option value='lime'>Bundesliga</option>
              <option value='coconut'>Champions League</option>
              <option value='mango'>Nog een league</option>
            </select>
          </label>
          <label className={styles.labelapprove} htmlFor="approve">
            <input className={styles.inputapprove} defaultChecked name='approve' id='approve' type='checkbox' />
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
