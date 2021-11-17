import styles from './Pagination.module.css'

import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Pagination ({ page, amountOfPages }) {
  const router = useRouter()
  const { lid } = router.query

  return (
    <>
      <ul className={styles.list}>
        {page > 2 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${1}`}><a>{'<<'}</a></Link>
          </li>
        )}
        {page > 1 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page - 1}`}><a>{'<'}</a></Link>
          </li>
        )}
        {page > 2 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page - 2}`}><a>{page - 2}</a></Link>
          </li>
        )}
        {page > 1 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page - 1}`}><a>{page - 1}</a></Link>
          </li>
        )}
        <li className={`${styles.item} ${styles.itemSelected}`}>
          <Link href={`/rankings/${lid}?page=${page}`}><a>{page}</a></Link>
        </li>
        {page <= amountOfPages - 1 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page + 1}`}><a>{page + 1}</a></Link>
          </li>
        )}
        {page <= amountOfPages - 2 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page + 2}`}><a>{page + 2}</a></Link>
          </li>
        )}
        {page <= amountOfPages - 1 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${page + 1}`}><a>{'>'}</a></Link>
          </li>
        )}
        {page <= amountOfPages - 2 && (
          <li className={styles.item}>
            <Link href={`/rankings/${lid}?page=${amountOfPages}`}><a>{'>>'}</a></Link>
          </li>
        )}
      </ul>
    </>
  )
}
