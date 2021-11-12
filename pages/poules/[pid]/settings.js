import styles from './Settings.module.css'

import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'

export default function Settings ({ test }) {
  const router = useRouter()
  const { pid } = router.query
  console.log(test)

  return (
    <>
      <Layout>
        <h1>Settings</h1>
        <div className={styles.buttons}>
          <button className={styles.deleteButton}>Delete poule</button>
        </div>
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