import Script from 'next/script'
import Link from 'next/link'
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
            <li className={styles.logo}><Link href='/'><a>ScoreZone</a></Link></li>
            <li className={styles.item}><Link href='/'><a>Predict</a></Link></li>
            <li className={styles.item}><Link href='/'><a>Poules</a></Link></li>
            <li className={styles.item}><Link href='/'><a>Rules</a></Link></li>
            <li className={styles.item}><Link href='/'><a>Contact</a></Link>
            </li>
            <li className={`${styles.item} ${styles.button}`}><Link href='/login'><a>Log In</a></Link></li>
            <li className={`${styles.item} ${styles.button} ${styles.secondary}`}><Link href='/signup'><a>Sign Up</a></Link></li>
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
