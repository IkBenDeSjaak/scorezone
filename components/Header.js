import styles from './Header.module.css'

import Link from 'next/link'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import useUser from '../lib/useUser'
import { useRouter } from 'next/router'
import fetcher from '../lib/fetcher'

export default function Header () {
  const router = useRouter()
  const [menuActive, setMenuActive] = useState(false)
  const { user, isLoading, mutateUser } = useUser()

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
            {(user?.isLoggedIn === true && user?.role === 'Admin') && (
              <>
                <li className={styles.item}><Link href='/admin'><a>Admin</a></Link></li>
              </>
            )}
            {user?.isLoggedIn === true && (
              <>
                <li className={`${styles.item} ${styles.userNameItem}`}><Link href='/profile'><a className={styles.userName}>{user.username}</a></Link></li>
                <li className={`${styles.item} ${styles.logout}`}><Link href='/logout'><a onClick={handleLogout}>Logout</a></Link></li>
              </>
            )}
            {(user?.isLoggedIn === false || isLoading) && (
              <>
                <li className={`${styles.item} ${styles.button}`}><Link href='/login'><a>Log In</a></Link></li>
                <li className={`${styles.item} ${styles.button} ${styles.secondary}`}><Link href='/signup'><a>Sign Up</a></Link></li>
              </>
            )}
            <li className={styles.toggle} onClick={toggleMenu}>
              {menuActive ? <FaTimes className={styles.icon} /> : <FaBars className={styles.icon} />}
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
