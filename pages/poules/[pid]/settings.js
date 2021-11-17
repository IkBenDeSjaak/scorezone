import styles from './Settings.module.css'

import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function Settings ({ test }) {
  const router = useRouter()
  const { pid } = router.query
  console.log(test)

  return (
    <>
      <Layout>
        <p className={styles.backButton}>
          <Link href={`../${pid}`}>
            <a>← Back to poule</a>
          </Link>
        </p>
        <h1>Settings</h1>
        <h2>General</h2>
        <form className={styles.pouleInfoForm}>
          <label className={styles.label} htmlFor='pouleName'>
            Poule name
            <input className={styles.input} id='pouleName' type='text' defaultValue="Jantje's poule" />
          </label>
          <label className={styles.labelApprove} htmlFor='approve'>
            <input className={styles.inputapprove} name='approve' id='approve' defaultChecked type='checkbox' />
            Approve or disapprove new participants
          </label>
          <label className={styles.label}><input className={`${styles.submitbutton} ${styles.input}`} id='submitButtonPouleInfo' type='submit' value='Save settings' /></label>
        </form>
        <h2>Approve participants</h2>
        {/* <p>There are no participants to approve or disapprove.</p> */}
        <p>There are people who want to join your poule! Click on the checkmark to approve a participant for your poule or click on the cross to reject the join request.</p>
        <div class={styles.approveTable}>
          <table>
            <thead>
              <tr>
                <th scope='col'>User</th>
                <th className={styles.approveTableName} scope='col'>Name</th>
                <th scope='col'>Approve</th>
                <th scope='col'>Disapprove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sjaakieeeeeeeee</td>
                <td className={styles.approveTableName}>Sjaak Kok</td>
                <td className={styles.tableDataCentered}>
                  <FontAwesomeIcon className={`${styles.icon} ${styles.iconCheck}`} icon={faCheck} />
                </td>
                <td className={styles.tableDataCentered}>
                  <FontAwesomeIcon className={`${styles.icon} ${styles.iconCross}`} icon={faTimes} />
                </td>
              </tr>
              <tr>
                <td>Bertassssdklaasasdasdasdasdasdasddasdasdsjd</td>
                <td className={styles.approveTableName}>Bert de Knaap</td>
                <td className={styles.tableDataCentered}>
                  <FontAwesomeIcon className={`${styles.icon} ${styles.iconCheck}`} icon={faCheck} />
                </td>
                <td className={styles.tableDataCentered}>
                  <FontAwesomeIcon className={`${styles.icon} ${styles.iconCross}`} icon={faTimes} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Custom points</h2>
        <p>By default your poule uses ScoreZone's points system that can be found in the <Link href='/rules'><a className={styles.inlineClickable}>rules</a></Link> section.
          You can customize points that will be awarded after every match by changing and saving the values below.
        </p>
        <form className={styles.pointsStrategyForm}>

          <div>
            <label htmlFor='totalscore'>Total score correct</label>
            <input type='number' name='totalscore' id='totalscore' defaultValue='10' />
          </div>

          <div>
            <label htmlFor='drawcorrect'>Draw correct</label>
            <input type='number' name='drawcorrect' id='drawcorrect' defaultValue='10' />
          </div>
          <div>
            <label htmlFor='winnercorrect'>Winner correct</label>
            <input type='number' name='winnercorrect' id='winnercorrect' defaultValue='10' />
          </div>
          <div>
            <label htmlFor='homegoals'>Number of home goals correct</label>
            <input type='number' name='homegoals' id='homegoals' defaultValue='10' />
          </div>
          <div>
            <label htmlFor='awaygoals'>Number of away goals correct</label>
            <input type='number' name='away goals' id='awaygoals' defaultValue='10' />
          </div>
          <div>
            <label><input className={`${styles.submitbutton}`} id='submitButtonPoints' type='submit' value='Save points' /></label>
          </div>
        </form>
        <h2>Delete poule</h2>
        <p>If you wish to delete the poule you created press the button below.</p>
        <button className={styles.deleteButton}>Delete poule</button>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  req,
  res
}) {
  const pid = params.pid
  const user = req.session.user

  console.log(pid)

  // if (user === undefined) {
  //   res.setHeader("location", "/login");
  //   res.statusCode = 302;
  //   res.end();
  //   return {
  //     props: {
  //       user: { isLoggedIn: false, login: "", avatarUrl: "" },
  //     },
  //   };
  // }

  // return {
  //   props: { user: req.session.user },
  // };\

  return {
    props: {
      test: 'testtekst'
    } // will be passed to the page component as props
  }
}
)
