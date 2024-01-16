'use client'

import { publisher } from '@/types'
import React, { Dispatch, createContext, useReducer } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type NewsState = {
  selectedPublisher?: publisher
  subscribeModalOpen?: boolean
  filtersModalOpen?: boolean
  publishers: publisher[]
}

type ActionType = {
  type: string
  publisher?: publisher
  open?: boolean
  publishers?: publisher[]
}

const initialState: NewsState = {
  selectedPublisher: 'all',
  subscribeModalOpen: false,
  filtersModalOpen: false,
  publishers: [],
}

// I'm not sure why this is triggering the no-unused-vars rule, but it is
/* eslint-disable no-unused-vars */
export enum NEWS_ACTIONS {
  CHANGE_PUBLISHER = 'CHANGE_PUBLISHER',
  SET_PUBLISHER_OPTIONS = 'SET_PUBLISHER_OPTIONS',
  TOGGLE_SUBSCRIBE_MODAL = 'TOGGLE_SUBSCRIBE_MODAL',
  TOGGLE_FILTERS_MODAL = 'TOGGLE_FILTERS_MODAL',
}

const reducer = (state: NewsState, action: ActionType): NewsState => {
  switch (action.type) {
    case NEWS_ACTIONS.CHANGE_PUBLISHER:
      return { ...state, selectedPublisher: action.publisher }
    case NEWS_ACTIONS.TOGGLE_SUBSCRIBE_MODAL:
      return { ...state, subscribeModalOpen: action.open }
    case NEWS_ACTIONS.TOGGLE_FILTERS_MODAL:
      return { ...state, filtersModalOpen: action.open }
    case NEWS_ACTIONS.SET_PUBLISHER_OPTIONS:
      return { ...state, publishers: action.publishers ?? [] }
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
