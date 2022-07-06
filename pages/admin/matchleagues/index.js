import styles from './MatchLeagues.module.css'

import Link from 'next/link'
import { useState } from 'react'
import { withSessionSsr } from '../../../lib/withSession'
import Layout from '../../../components/Layout'
import Message from '../../../components/Message'
import { getLeagues } from '../../api/leagues'

export default function AdminMatchLeagues({ reqMessage, leagues }) {
  const [message, setMessage] = useState(reqMessage)

  const handleCloseMessage = () => {
    setMessage({})
  }

  return (
    <>
      <Layout>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
        )}
        <p className={styles.backButton}>
          <Link href={`/admin`}>
            <a>← Back to admin main page</a>
          </Link>
        </p>
        <h1>Admin</h1>
        <p>Select a league to manage the matches from.</p>
        <div className={styles.actions}>
          {leagues?.map((league) => (
            <Link key={league.LeagueId.toString()} href={`/admin/leagues/${league.LeagueId}`}>
              <a className={styles.actionCard}>{league.LeagueName}</a>
            </Link>
          ))}
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
  const message = {
    type: '',
    message: ''
  }

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

  try {
    const leagues = await getLeagues()

    return {
      props: {
        reqMessage: message,
        leagues: JSON.parse(JSON.stringify(leagues))
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = error.message

    return {
      props: {
        reqMessage: message,
        leagues: []
      }
    }
  }
}
)
