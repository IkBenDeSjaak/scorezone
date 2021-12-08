import styles from './Footer.module.css'

import { FaEnvelope } from 'react-icons/fa'
import { useState } from 'react'
import { convertDateTimeToAmericanDate, convertDateTimeToDate } from '../lib/dates'

export default function Footer () {
  const [date] = useState(new Date())

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.content}>
          <p>&copy; ScoreZone</p>
          <p>
            <a className={styles.clickableText} href='mailto:info@scorezone.nl'>
              <span className={styles.hideText}>Send me an email</span>
              <FaEnvelope className={styles.icon} />
            </a>
          </p>
          <p><time dateTime={convertDateTimeToAmericanDate(date)}>{convertDateTimeToDate(date)}</time></p>
        </div>
      </footer>
    </>
  )
}
