import styles from './Footer.module.css'

export default function Footer () {
  const getDateTime = () => {
    const date = new Date()
    const currentDate = date.toLocaleDateString()
    const currentTime = date.toLocaleTimeString()
    const currentDateTime = `${currentDate} ${currentTime}`
    return currentDateTime
  }

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.content}>
          <p>&copy; ScoreZone</p>
          <p>{getDateTime()}</p>
        </div>
      </footer>
    </>
  )
}
