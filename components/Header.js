import styles from './Header.module.css'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useRouter } from 'next/router'
import useUser from '../lib/useUser'
import fetcher from '../lib/fetcher'

export default function Header () {
  const router = useRouter()
  const [menuActive, setMenuActive] = useState(false)
  const { user, mutateUser } = useUser()

  const toggleMenu = () => {
    if (menuActive) {
      setMenuActive(false)
    } else {
      setMenuActive(true)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    mutateUser(await fetcher('/api/logout', {
      method: 'POST'
    }), false)
    router.push('/logout')
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
                <li className={`${styles.item} ${styles.userNameItem}`}><p className={styles.userName}>{user.username}</p></li>
                <li className={`${styles.item} ${styles.logout}`}><Link href='/logout'><a onClick={handleLogout}>Logout</a></Link></li>
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
