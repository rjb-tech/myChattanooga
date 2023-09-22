import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import styles from './SettingsModal.module.scss'
import { useState } from 'react'
import validator from 'validator'
import { Close } from '@mui/icons-material'
import { toast } from 'react-toastify'
import config from '@/config'

interface NewsletterSubscribeModalProps {
  open?: boolean
  closeModal: () => void
}

export default function SettingsModal({
  open,
  closeModal,
}: NewsletterSubscribeModalProps) {
  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const onSubmit = async () => {
    toast('Processing subscription, please wait...', {
      position: 'bottom-left',
    })
    closeModal()
    const response = await fetch(`${config.apiRoutes.url}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        firstName,
      }),
    })

    if (response.status === 201)
      toast.success("You're subscribed! Check your email.", {
        position: 'bottom-left',
      })
    else if (response.status === 400)
      toast.error("You're already subscribed.", {
        position: 'bottom-left',
      })
    else if (response.status === 404)
      toast.error('Error adding you to the newsletter. Try again later.', {
        position: 'bottom-left',
      })
  }

  const emailValid = validator.isEmail(email) && !validator.isEmpty(email)
  const firstNameValid = !validator.isEmpty(firstName)
  const buttonDisabled = !emailValid || !firstNameValid

  return (
    <Dialog open={open ?? false} onClose={closeModal}>
      <DialogTitle className={styles.title}>
        {"Get today's news in your inbox"}
        <span className={styles.closeButton} onClick={closeModal}>
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
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  )
}
