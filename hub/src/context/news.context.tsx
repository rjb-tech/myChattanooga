'use client'

import { publisher } from '@/types'
import React, { Dispatch, createContext, useReducer } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type NewsState = {
  selectedPublisher?: publisher
  subscribeModalOpen?: boolean
}

type ActionType = {
  type: string
  publisher?: publisher
  open?: boolean
}

const initialState: NewsState = {
  selectedPublisher: 'all',
  subscribeModalOpen: false,
}

export enum NEWS_ACTIONS {
  CHANGE_PUBLISHER = 'CHANGE_PUBLISHER',
  TOGGLE_SUBSCRIBE_MODAL = 'TOGGLE_SUBSCRIBE_MODAL',
}

const reducer = (state: NewsState, action: ActionType): NewsState => {
  switch (action.type) {
    case NEWS_ACTIONS.CHANGE_PUBLISHER:
      return { ...state, selectedPublisher: action.publisher }
    case NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL:
      return { ...state, subscribeModalOpen: action.open }
    default:
      return state
  }
}

export const NewsContext = createContext<{
  state: NewsState
  dispatch: Dispatch<ActionType>
}>({ state: initialState, dispatch: () => null })

export const NewsContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <NewsContext.Provider value={{ state, dispatch }}>
      {children}
      <ToastContainer />
    </NewsContext.Provider>
  )
}
