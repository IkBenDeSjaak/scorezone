import styles from './Admin.module.css'

import Link from 'next/link'
import { withSessionSsr } from '../../lib/withSession'
import Layout from '../../components/Layout'

export default function Admin () {
  return (
    <>
      <Layout>
        <h1>Admin</h1>
        <div className={styles.actions}>
          <Link href='/admin/leagues'>
            <a className={styles.actionCard}>Add new leagues</a>
          </Link>
          <Link href='/admin/seasons'>
            <a className={styles.actionCard}>Add new seasons</a>
          </Link>
          <Link href='/admin/matchleagues'>
            <a className={styles.actionCard}>Add new matches</a>
          </Link>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const uid = req.session.user?.id
  const role = req.session.user?.role

  if (!uid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  if (role !== 'Admin') {
    return {
      notFound: true
    }
  }

  return {
    props: {}
  }
}
)
