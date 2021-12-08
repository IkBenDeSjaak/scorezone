import styles from './Poules.module.css'

import { withSessionSsr } from '../../lib/withSession'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Message from '../../components/Message'

export default function Poules ({ user }) {
  const [message, setMessage] = useState({})
  const [poules, setPoules] = useState([])

  useEffect(async () => {
    if (user) {
      const abortController = new AbortController()

      const response = await fetch('/api/user/poules', {
        method: 'GET',
        signal: abortController.signal
      })

      if (response.status === 200) {
        const responseJson = await response.json()

        setPoules(responseJson)
      } else {
        const responseJson = await response.json()
        const newMessage = {
          type: 'danger',
          message: responseJson.message
        }

        setMessage(newMessage)
      }

      return () => abortController?.abort()
    }
  }, [])

  const handleCloseMessage = () => {
    setMessage({})
  }

  return (
    <>
      <Layout>
        <div>
          {(message.type && message.message) && (
            <Message type={message.type} message={message.message} handleCloseMessage={handleCloseMessage} />
          )}
          <h1>Poules</h1>
          <h3 className={styles.fontWeightNormal}>Here you can see all the poules you participate in or create a new poule!</h3>
          {user
            ? (
              <>
                <p className={styles.button}><Link href='/poules/create'><a>Create poule</a></Link></p>
                {(poules.length > 0)
                  ? (
                    <div className={styles.poulesContainer}>
                      <div className={`${styles.pouleRow} ${styles.poulesInfo}`}>
                        <p>Poule name</p>
                        <p>League</p>
                        <p>Season</p>
                      </div>
                      {poules?.map((poule) => (
                        <div key={poule.PouleId.toString()} className={`${styles.pouleRow} ${styles.pouleRowData}`}>
                          <p className={styles.pouleName}><Link href={`poules/${poule.PouleId}`}><a className={styles.pouleText}>{poule.PouleName}</a></Link></p>
                          <p>{poule.LeagueName}</p>
                          <p>{poule.SeasonName}</p>
                        </div>
                      ))}
                    </div>
                    )
                  : (<p>You did not join or create any poule yet.</p>)}
              </>
              )
            : (<p>You can join and create poules when you are logged in.</p>)}
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const user = req.session.user

  if (user) {
    return {
      props: {
        user: user.id
      }
    }
  }

  return {
    props: {}
  }
}
)
