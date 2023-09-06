import config from '@/config'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import styles from './NewsletterSubscribeModal.module.scss'

interface NewsletterSubscribeModalProps {
  open: boolean
}

export default function NewsletterSubscribeModal({
  open,
}: NewsletterSubscribeModalProps) {
  return (
    <Dialog open={open}>
      <DialogTitle>Headlines in your inbox every night</DialogTitle>
      <DialogContent>
        <button
          onClick={() => {
            fetch(`${config.apiRoutes.url}/subscribe`, {
              method: 'POST',
              body: JSON.stringify({
                email: 'rburden1996@hotmail.com',
                first_name: 'ryne',
              }),
            })
          }}
        >
          hey
        </button>
      </DialogContent>
    </Dialog>
  )
}
