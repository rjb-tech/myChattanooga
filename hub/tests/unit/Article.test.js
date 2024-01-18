import { screen, render } from '@testing-library/react'
import { addMinutes, subMinutes } from 'date-fns'
import { getUtcTime } from '../utils'
import Article from '@/components/Article'

describe('Article component tests', () => {
  it('correctly renders the time since posted under an hour', () => {
    const minutesSince = 45
    render(
      <Article
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), minutesSince)}
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
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), 65)}
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
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(getUtcTime(), 185)}
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
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={addMinutes(getUtcTime(), 185)}
        publisher="Chattanoogan"
      />,
    )
  })

  expect(screen.queryByTestId('article')).not.toBeInTheDocument()
})
