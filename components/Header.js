import styles from './Header.module.css'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
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
            <li className={styles.item}><Link href='/predictions'><a>Predict</a></Link></li>
            <li className={styles.item}><Link href='/poules'><a>Poules</a></Link></li>
            <li className={styles.item}><Link href='/leagues'><a>Leagues</a></Link></li>
            <li className={styles.item}><Link href='/rankings'><a>Rankings</a></Link></li>
            <li className={styles.item}><Link href='/rules'><a>Rules</a></Link></li>
            {user?.isLoggedIn === true && (
              <>
                <li className={`${styles.item} ${styles.userNameItem}`}><p className={styles.userName}>IkBenDeSjaak</p></li>
                <li className={`${styles.item} ${styles.logout}`}><Link href='/logout'><a>Logout</a></Link></li>
              </>
            )}
            {user?.isLoggedIn === false && (
              <>
                <li className={`${styles.item} ${styles.button}`}><Link href='/login'><a>Log In</a></Link></li>
                <li className={`${styles.item} ${styles.button} ${styles.secondary}`}><Link href='/signup'><a>Sign Up</a></Link></li>
              </>
            )}
            <li className={styles.toggle} onClick={toggleMenu}>
              {menuActive ? <FontAwesomeIcon icon={faTimes} className={styles.icon} /> : <FontAwesomeIcon icon={faBars} className={styles.icon} />}
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
