import styles from './Message.module.css'

import { FaTimes } from 'react-icons/fa'

export default function Message ({ type, message, handleCloseMessage }) {
  const getMessageTypeStyle = () => {
    if (type === 'danger') {
      return styles.danger
    } else if (type === 'success') {
      return styles.success
    } else if (type === 'warning') {
      return styles.warning
    }
  }

  return (
    <>
      <div className={`${styles.message} ${getMessageTypeStyle()}`}>
        <p>{message}</p>
        <FaTimes className={`${styles.closeButton}`} onClick={handleCloseMessage} />
      </div>
    </>
  )
}
