import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import styles from './NewsletterSubscribeModal.module.scss'
import { useState } from 'react'

interface NewsletterSubscribeModalProps {
  open?: boolean
  closeModal: () => void
}

export default function NewsletterSubscribeModal({
  open,
  closeModal,
}: NewsletterSubscribeModalProps) {
  const [email, setEmail] = useState<string>('')
  const onSubmit = () => {}

  return (
    <Dialog open={open ?? false} onClose={closeModal}>
      <DialogTitle>myChattanooga Nighly News Roundup</DialogTitle>
      <DialogContent className={styles.modalContent}>
        Relevant news from around the city in your inbox.
        <TextField
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </DialogContent>
    </Dialog>
  )
}
