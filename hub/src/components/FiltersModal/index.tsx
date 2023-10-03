import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import styles from './FiltersModal.module.scss'
import { Close } from '@mui/icons-material'
import Filters from '../Filters'
import classNames from 'classnames'
import { publisher } from '@/types'

interface FiltersModalProps {
  open?: boolean
  closeModal: () => void
  publishers: publisher[]
}

export default function FiltersModal({
  open,
  closeModal,
  publishers,
}: FiltersModalProps) {
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
        <Filters publishers={publishers} />
      </DialogContent>
    </Dialog>
  )
}
