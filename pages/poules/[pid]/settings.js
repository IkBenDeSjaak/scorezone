import styles from './Settings.module.css'

import { querydb } from '../../../lib/db'
import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Message from '../../../components/Message'
import { getPouleInfoData } from '../../api/poules/[pid]'

export default function Settings ({ reqMessage }) {
  const router = useRouter()
  const { pid } = router.query

  const [message, setMessage] = useState(reqMessage)
  const [generalPouleInfo, setGeneralPouleInfo] = useState({
    PouleName: '',
    ApproveParticipants: true
  })
  const [newParticipants, setNewParticipants] = useState([])
  const [points, setPoints] = useState([])

  useEffect(async () => {
    const generalPouleInfo = await fetch(`/api/poules/${pid}`, {
      method: 'GET'
    }).then((res) => res.json())

    const newParticipants = await fetch(`/api/poules/${pid}/newparticipants`, {
      method: 'GET'
    }).then((res) => res.json())

    const points = await fetch(`/api/poules/${pid}/points`, {
      method: 'GET'
    }).then((res) => res.json())

    setGeneralPouleInfo(generalPouleInfo)
    setNewParticipants(newParticipants)
    setPoints(points)
  }, [])

  const inputsHandlerPouleInfo = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setGeneralPouleInfo({ ...generalPouleInfo, [name]: value })
  }

  const handleSubmitPouleInfo = async (e) => {
    e.preventDefault()

    const response = await fetch(`/api/poules/${pid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generalPouleInfo)
    })

    if (response.status === 200) {
      const newMessage = {
        type: 'success',
        message: 'You have succesfully updated the poule information'
      }

      setMessage(newMessage)
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }
  }

  const onApproveNewParticipant = async (UserId) => {
    const response = await fetch(`/api/poules/${pid}/participants/${UserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 200) {
      const updatedNewParticipants = newParticipants.filter(p => p.UserId !== UserId)

      setNewParticipants(updatedNewParticipants)
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }
  }

  const onDisapproveNewParticipant = async (UserId) => {
    const response = await fetch(`/api/poules/${pid}/participants/${UserId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 200) {
      const updatedNewParticipants = newParticipants.filter(p => p.UserId !== UserId)

      setNewParticipants(updatedNewParticipants)
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }
  }

  const inputsHandlerPoints = (e) => {
    const target = e.target
    const pointAmount = target.value
    const optionId = parseInt(target.name)

    const newPoints = points.map((p) => {
      if (p.OptionId === optionId) {
        p.Points = pointAmount
        return p
      } else {
        return p
      }
    })

    setPoints(newPoints)
  }

  const handleSubmitPoints = async (e) => {
    e.preventDefault()

    const response = await fetch(`/api/poules/${pid}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(points)
    })

    if (response.status === 200) {
      const newMessage = {
        type: 'success',
        message: 'You have succesfully updated the points of this poule'
      }

      setMessage(newMessage)
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }
  }

  const onDeletePoule = async () => {
    const response = await fetch(`/api/poules/${pid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.status === 200) {
      router.push('/poules')
    } else {
      const responseJson = await response.json()
      const newMessage = {
        type: 'danger',
        message: responseJson.message
      }

      setMessage(newMessage)
    }
  }

  return (
    <>
      <Layout>
        <p className={styles.backButton}>
          <Link href={`/poules/${pid}`}>
            <a>← Back to poule</a>
          </Link>
        </p>
        <h1>Settings</h1>
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} />
        )}
        <h2>General</h2>
        <form className={styles.pouleInfoForm} onSubmit={handleSubmitPouleInfo}>
          <label className={styles.label} htmlFor='PouleName'>
            Poule name
            <input className={styles.input} required maxLength='25' name='PouleName' id='PouleName' type='text' value={generalPouleInfo.PouleName} onChange={inputsHandlerPouleInfo} />
          </label>
          <label className={styles.labelApprove} htmlFor='ApproveParticipants'>
            <input className={styles.inputapprove} name='ApproveParticipants' id='ApproveParticipants' checked={generalPouleInfo.ApproveParticipants} type='checkbox' onChange={inputsHandlerPouleInfo} />
            Approve or disapprove new participants
          </label>
          <label className={`${styles.label} ${styles.labelSubmitSettings}`}><input className={`${styles.submitbutton} ${styles.input}`} id='submitButtonPouleInfo' type='submit' value='Save settings' /></label>
        </form>
        <h2>Approve participants</h2>
        {newParticipants.length > 0
          ? (
            <>
              <p>There are people who want to join your poule! Click on the checkmark to approve a participant for your poule or click on the cross to reject the join request.</p>
              <div className={styles.approveTable}>
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
                    {newParticipants.map((p) => (
                      <tr key={p.UserId}>
                        <td>{p.Username}</td>
                        <td className={styles.approveTableName}>{`${p.FirstName ? p.FirstName : ''} ${p.LastName ? p.LastName : ''}`}</td>
                        <td className={styles.tableDataCentered}>
                          <FaCheck className={`${styles.icon} ${styles.iconCheck}`} onClick={() => onApproveNewParticipant(p.UserId)}/>
                        </td>
                        <td className={styles.tableDataCentered}>
                          <FaTimes className={`${styles.icon} ${styles.iconCross}`} onClick={() => onDisapproveNewParticipant(p.UserId)}/>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            )
          : (<p>There are no new participants to approve or disapprove.</p>)}
        <h2>Custom points</h2>
        <p>By default your poule uses ScoreZone's points system that can be found in the <Link href='/rules'><a className={styles.inlineClickable}>rules</a></Link> section.
          You can customize points that will be awarded after every match by changing and saving the values below.
        </p>
        <form className={styles.pointsStrategyForm} onSubmit={handleSubmitPoints}>
          {points?.map((p) => (
            <div key={p.OptionName}>
              <label htmlFor={p.OptionName}>{p.OptionName}</label>
              <input type='number' required min='0' max='20' name={p.OptionId} id={p.OptionName} value={p.Points} onChange={inputsHandlerPoints} />
            </div>
          ))}
          <div>
            <label><input className={`${styles.submitbutton}`} id='submitButtonPoints' type='submit' value='Save points' /></label>
          </div>
        </form>
        <h2>Delete poule</h2>
        <p>If you wish to delete the poule you created press the button below.</p>
        <button className={styles.deleteButton} onClick={onDeletePoule}>Delete poule</button>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  req,
  res
}) {
  const uid = req.session.user?.id
  const pid = params.pid
  const message = {
    type: '',
    message: ''
  }

  try {
    const pouleInfo = await getPouleInfoData(pid)

    if (pouleInfo[0].Creator !== uid) {
      return {
        redirect: {
          destination: `/poules/${pid}`,
          permanent: false
        }
      }
    }

    return {
      props: {
        reqMessage: message
      }
    }
  } catch (error) {
    message.type = 'danger'
    message.message = 'Something went wrong'

    return {
      props: {
        reqMessage: message
      }
    }
  }
}
)
