import Script from 'next/script'
import styles from './header.module.css'
import { useState } from 'react'

export default function Header () {
  const [menuActive, setMenuActive] = useState(false)

  const toggleMenu = () => {
    if (menuActive) {
      setMenuActive(false)
    } else {
      setMenuActive(true)
    }
  }

  return (
    <>
      <header>
        <nav className={styles.nav}>
          <ul className={`${styles.menu} ${menuActive ? styles.active : ''}`}>
            <li className={styles.logo}><a href='#'>ScoreZone</a></li>
            <li className={styles.item}><a href='#'>Predict</a></li>
            <li className={styles.item}><a href='#'>Poules</a></li>
            <li className={styles.item}><a href='#'>Rules</a></li>
            <li className={styles.item}><a href='#'>Contact</a>
            </li>
            <li className={`${styles.item} ${styles.button}`}><a href='#'>Log In</a></li>
            <li className={`${styles.item} ${styles.button} ${styles.secondary}`}><a href='#'>Sign Up</a></li>
            <li className={styles.toggle} onClick={toggleMenu}>
              <span style={{ color: 'white' }}>
                {menuActive ? <i class='fas fa-times' /> : <i className='fas fa-bars' />}
              </span>
            </li>
          </ul>
        </nav>
      </header>
      <Script src='https://kit.fontawesome.com/d10d8015fa.js' crossorigin='anonymous' />
    </>
  )
}
