import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import styles from './FiltersModal.module.scss'
import { useContext } from 'react'
import { Close } from '@mui/icons-material'
import Filters from '../Filters'
import { NewsContext } from '@/context/news.context'
import classNames from 'classnames'

interface FiltersModalProps {
  open?: boolean
  closeModal: () => void
}

export default function FiltersModal({ open, closeModal }: FiltersModalProps) {
  const { state } = useContext(NewsContext)

  return (
    <Dialog open={open ?? false} onClose={closeModal}>
      <DialogTitle className={classNames(styles.title, styles.background)}>
        {'Filter by publisher'}
        <span className={styles.closeButton} onClick={closeModal}>
          <Close />
        </span>
      </DialogTitle>
      <DialogContent
        className={classNames(styles.modalContent, styles.background)}
      >
        <Filters publishers={state.publishers} />
      </DialogContent>
    </Dialog>
  )
}
