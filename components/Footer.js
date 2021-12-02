import styles from './Footer.module.css'

import { FaEnvelope } from 'react-icons/fa';
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
              <FaEnvelope className={styles.icon}/>
            </a>
          </p>
          <p><time dateTime={convertDateTimeToDate(new Date())}>{convertDateTimeToDate(new Date())}</time></p>
        </div>
      </footer>
    </>
  )
}
