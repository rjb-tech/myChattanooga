'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#506DCE',
    },
  },
})

interface ThemeProps {
  children: ReactNode
}

export default function MyChattanoogaTheme({ children }: ThemeProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
