'use client'

import { publisher } from '@/types'
import React, { Dispatch, createContext, useReducer } from 'react'

type NewsState = {
  selectedPublisher: publisher
}

type ActionType = {
  type: string
  publisher: publisher
}

const initialState: NewsState = {
  selectedPublisher: 'all',
}

export enum NEWS_ACTIONS {
  CHANGE_PUBLISHER = 'CHANGE_PUBLISHER',
}

const reducer = (state: NewsState, action: ActionType): NewsState => {
  switch (action.type) {
    case NEWS_ACTIONS.CHANGE_PUBLISHER:
      return { ...state, selectedPublisher: action.publisher }
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
    </NewsContext.Provider>
  )
}
