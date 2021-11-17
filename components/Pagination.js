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
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: 1 }
              })
            }}
          ><p>{'<<'}</p>
          </li>
        )}
        {page > 1 && (
          <li
            className={`${styles.item} ${styles.onePageModifier}`} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) - 1 }
              })
            }}
          ><p>{'<'}</p>
          </li>
        )}
        {page > 2 && (
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) - 2 }
              })
            }}
          ><p>{page - 2}</p>
          </li>
        )}
        {page > 1 && (
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) - 1 }
              })
            }}
          ><p>{page - 1}</p>
          </li>
        )}
        <li className={`${styles.item} ${styles.itemSelected}`}><p>{page}</p></li>
        {page <= amountOfPages - 1 && (
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) + 1 }
              })
            }}
          ><p>{Number(page) + 1}</p>
          </li>
        )}
        {page <= amountOfPages - 2 && (
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) + 2 }
              })
            }}
          ><p>{Number(page) + 2}</p>
          </li>
        )}
        {page <= amountOfPages - 1 && (
          <li
            className={`${styles.item} ${styles.onePageModifier}`} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: Number(page) + 1 }
              })
            }}
          ><p>{'>'}</p>
          </li>
        )}
        {page <= amountOfPages - 2 && (
          <li
            className={styles.item} onClick={() => {
              router.push({
                pathname: `/rankings/${lid}`,
                query: { page: amountOfPages }
              })
            }}
          ><p>{'>>'}</p>
          </li>
        )}
      </ul>
    </>
  )
}
