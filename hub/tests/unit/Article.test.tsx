import React from 'react'
import { screen, render } from '@testing-library/react'
import { addMinutes, subMinutes } from 'date-fns'
import { getUtcTime } from '../utils'
import Article from '@/components/Article'

describe('Article component tests', () => {
  it('correctly renders the time since posted under an hour', () => {
    const minutesSince = 45
    render(
      <Article
        isActive={true}
        id={0}
        saved={new Date().toISOString()}
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), minutesSince).toISOString()}
        publisher="Chattanoogan"
      />,
    )

    expect(screen.getByTestId('time-posted').textContent).toEqual(
      `Posted ${minutesSince} minutes ago`,
    )
  })

  it('correctly renders the time since posted over an hour ago', () => {
    render(
      <Article
        isActive={true}
        id={0}
        saved={new Date().toISOString()}
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), 65).toISOString()}
        publisher="Chattanoogan"
      />,
    )

    expect(screen.getByTestId('time-posted').textContent).toEqual(
      'Posted over 1 hour ago',
    )
  })

  it('correctly renders the time since posted 2 or more hours ago', () => {
    render(
      <Article
        isActive={true}
        id={0}
        saved={new Date().toISOString()}
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), 185).toISOString()}
        publisher="Chattanoogan"
      />,
    )

    expect(screen.getByTestId('time-posted').textContent).toEqual(
      'Posted over 3 hours ago',
    )
  })

  it('does not render articles with posted dates from the future', () => {
    render(
      <Article
        isActive={true}
        id={0}
        saved={new Date().toISOString()}
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={addMinutes(getUtcTime(), 185).toISOString()}
        publisher="Chattanoogan"
      />,
    )

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('correctly renders test id for active articles', () => {
    render(
      <>
        <Article
          isActive={true}
          id={0}
          saved={new Date().toISOString()}
          headline="Extry Extry!"
          link="https://mylink.bippitybop"
          published={subMinutes(getUtcTime(), 185).toISOString()}
          publisher="Chattanoogan"
        />
        <Article
          isActive={false}
          id={1}
          saved={new Date().toISOString()}
          headline="Extry Extry!"
          link="https://mylink.bippitybop"
          published={subMinutes(getUtcTime(), 185).toISOString()}
          publisher="Chattanoogan"
        />
      </>,
    )

    expect(screen.queryAllByTestId('active-article').length).toEqual(1)
  })
})
