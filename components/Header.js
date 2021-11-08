import styles from './Header.module.css'

import Script from 'next/script'
import Link from 'next/link'
import { useState } from 'react'
import useUser from '../lib/useUser'

export default function Header () {
  const [menuActive, setMenuActive] = useState(false)
  const { user, mutateUser } = useUser()

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
            <li className={styles.item}><Link href='/predict'><a>Predict</a></Link></li>
            <li className={styles.item}><Link href='/poules'><a>Poules</a></Link></li>
            <li className={styles.item}><Link href='/leagues'><a>Leagues</a></Link></li>
            <li className={styles.item}><Link href='/rules'><a>Rules</a></Link></li>
            <li className={styles.item}><Link href='/contact'><a>Contact</a></Link>
            </li>
            <li className={`${styles.item} ${styles.button}`}><Link href='/login'><a>Log In</a></Link></li>
            <li className={`${styles.item} ${styles.button} ${styles.secondary}`}><Link href='/signup'><a>Sign Up</a></Link></li>
            <li className={styles.toggle} onClick={toggleMenu}>
              <span style={{ color: 'white' }}>
                {menuActive ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
              </span>
            </li>
          </ul>
        </nav>
      </header>
      <Script src='https://kit.fontawesome.com/d10d8015fa.js' crossorigin='anonymous' />
    </>
  )
}
