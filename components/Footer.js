import styles from './Footer.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { convertDateTimeToDate } from '../lib/dates'

export default function Footer () {
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
          <p><time dateTime={convertDateTimeToDate(new Date())}>{convertDateTimeToDate(new Date())}</time></p>
        </div>
      </footer>
    </>
  )
}
