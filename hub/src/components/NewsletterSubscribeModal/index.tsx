import config from '@/config'
import {
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import styles from './NewsletterSubscribeModal.module.scss'
import { useState } from 'react'

interface NewsletterSubscribeModalProps {
  open: boolean
  setOpen: Function
}

export default function NewsletterSubscribeModal({
  open,
  setOpen,
}: NewsletterSubscribeModalProps) {
  const [email, setEmail] = useState<string>('')
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
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
