import styles from './BackButton.module.css'

import Link from 'next/link'

export default function BackButton({ href, backTo }) {
  return (
    <>
      <p className={styles.backButton}>
        <Link href={`${href}`}>
          <a>← Back to {backTo}</a>
        </Link>
      </p>
    </>
  )
}
