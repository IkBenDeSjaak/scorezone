import styles from './Footer.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer () {
  const getDateLocal = () => {
    const date = new Date()
    const currentDate = date.toLocaleDateString()
    return currentDate
  }

  const getDate = () => {
    const date = new Date()
    const currentDate = date.toISOString()
    return currentDate
  }

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.content}>
          <p>&copy; ScoreZone</p>
          <p>
            <a className={styles.clickableText} href='mailto:info@scorezone.nl'>
              <span className={styles.hideText}>Send me an email</span>
              <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
            </a>
          </p>
          <p><time dateTime={getDate()}>{getDateLocal()}</time></p>
        </div>
      </footer>
    </>
  )
}
