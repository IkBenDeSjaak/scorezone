import styles from './Message.module.css'

export default function Message ({ type, message }) {
  const getMessageTypeStyle = () => {
    if (type === 'danger') {
      return styles.danger
    } else if (type === 'success') {
      return styles.success
    }
  }

  return (
    <>
      <p className={`${styles.message} ${getMessageTypeStyle()}`}>{message}</p>
    </>
  )
}
