import styles from './Profile.module.css'

import { withSessionSsr } from '../../lib/withSession'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Message from '../../components/Message'

export default function Profile ({ userId }) {
  const [message, setMessage] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [userInfo, setUserInfo] = useState({
    Email: '',
    Username: '',
    FirstName: '',
    LastName: '',
    HidePredictions: undefined
  })

  useEffect(async () => {
    const userInfo = await fetch(`/api/user/${userId}`, {
      method: 'GET'
    }).then((res) => res.json())

    setUserInfo(userInfo)
  }, [])

  console.log(userInfo)

  const inputsHandlerUserInfo = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setUserInfo({ ...userInfo, [name]: value || '' })
  }

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault()

    const response = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo)
    })

    if (response.status === 200) {
      const newMessage = {
        type: 'success',
        message: 'You have succesfully updated the user information'
      }

      setIsEditMode(false)
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

  return (
    <>
      <Layout>
        <h1>{isEditMode ? 'Edit profile' : 'Profile'}</h1>
        {
          isEditMode
            ? (
              <p className={styles.backButton} onClick={() => setIsEditMode(false)}>
                ← Back to profile
              </p>
              )
            : ''
        }
        {(message.type && message.message) && (
          <Message type={message.type} message={message.message} />
        )}
        <form className={styles.userInfoForm} onSubmit={handleSubmitUserInfo}>
          <label className={styles.label} htmlFor='Email'>
            Email
            <input className={styles.input} disabled={!isEditMode} required maxLength='64' name='Email' id='Email' type='text' value={userInfo.Email} onChange={inputsHandlerUserInfo} />
          </label>
          <label className={styles.label} htmlFor='Username'>
            Username
            <input className={styles.input} disabled={!isEditMode} required minLength='6' maxLength='20' name='Username' id='Username' type='text' value={userInfo.Username} onChange={inputsHandlerUserInfo} />
          </label>
          <label className={styles.label} htmlFor='FirstName'>
            First name
            <input className={styles.input} disabled={!isEditMode} maxLength='50' name='FirstName' id='FirstName' type='text' value={userInfo.FirstName} onChange={inputsHandlerUserInfo} />
          </label>
          <label className={styles.label} htmlFor='LastName'>
            Last name
            <input className={styles.input} disabled={!isEditMode} maxLength='50' name='LastName' id='LastName' type='text' value={userInfo.LastName} onChange={inputsHandlerUserInfo} />
          </label>
          <label className={styles.labelHidePredictions} htmlFor='HidePredictions'>
            <input className={styles.inputHidePredictions} disabled={!isEditMode} name='HidePredictions' id='HidePredictions' value={userInfo.HidePredictions} type='checkbox' onChange={inputsHandlerUserInfo} />
            Hide my predictions from other users
          </label>
          {isEditMode
            ? (
              <label className={`${styles.label} ${styles.labelSubmitUserInfo}`}><input className={`${styles.submitbutton} ${styles.input}`} id='submitButtonUserInfo' type='submit' value='Save' /></label>
              )
            : ''}
        </form>
        {!isEditMode
          ? (
            <button
              className={styles.editButton} onClick={() => {
                setIsEditMode(true)
                setMessage('')
              }}
            >Edit
            </button>
            )
          : ''}
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res
}) {
  const uid = req.session.user?.id

  if (!uid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      userId: uid
    }
  }
}
)
