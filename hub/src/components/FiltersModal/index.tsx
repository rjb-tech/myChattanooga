import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import styles from './FiltersModal.module.scss'
import { useContext, useEffect } from 'react'
import { Close } from '@mui/icons-material'
import Filters from '../Filters'
import { NewsContext } from '@/context/news.context'

interface FiltersModalProps {
  open?: boolean
  closeModal: () => void
}

export default function FiltersModal({ open, closeModal }: FiltersModalProps) {
  const { state } = useContext(NewsContext)

  return (
    <Dialog open={open ?? false} onClose={closeModal}>
      <DialogTitle className={styles.title}>
        {'Filter articles by publisher'}
        <span className={styles.closeButton} onClick={closeModal}>
          <Close />
        </span>
      </DialogTitle>
      <DialogContent className={styles.modalContent}>
        <Filters publishers={state.publishers} />
      </DialogContent>
    </Dialog>
  )
}
