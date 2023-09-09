import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import styles from './NewsletterSubscribeModal.module.scss'
import { useContext, useState } from 'react'
import validator from 'validator'
import { Close, CloseRounded, ExitToApp } from '@mui/icons-material'
import { NEWS_ACTIONS, NewsContext } from '@/context/news.context'

interface NewsletterSubscribeModalProps {
  open?: boolean
  closeModal: () => void
}

export default function NewsletterSubscribeModal({
  open,
  closeModal,
}: NewsletterSubscribeModalProps) {
  const { dispatch } = useContext(NewsContext)
  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const onSubmit = async () => {
    setLoading(true)
  } // WORK ON THIS AND ADD LOADING STATE

  const emailValid = validator.isEmail(email) && !validator.isEmpty(email)
  const firstNameValid = !validator.isEmpty(firstName)
  const buttonDisabled = !emailValid || !firstNameValid

  return (
    <Dialog open={open ?? false} onClose={closeModal}>
      <DialogTitle className={styles.title}>
        {'Get the local news in your inbox every day'}
        <span
          className={styles.closeButton}
          onClick={() => {
            dispatch({ type: NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL, open: false })
          }}
        >
          <Close />
        </span>
      </DialogTitle>
      <DialogContent className={styles.modalContent}>
        <TextField
          value={email}
          label="Email"
          fullWidth
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          value={firstName}
          label="First Name"
          fullWidth
          required
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Button
          className={styles.submit}
          fullWidth
          disabled={buttonDisabled}
          variant="contained"
        >
          {loading ? 'Please wait' : 'Submit'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
