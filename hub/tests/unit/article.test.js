import { screen, render } from '@testing-library/react'
import { subMinutes } from 'date-fns'
import Article from '@/components/Article'

describe('Article component tests', () => {
  it('renders correctly with proper data', () => {
    const minutesSince = 45
    render(
      <Article
        headline="Extry Extry!"
        link="https://mylink.bippitybop"
        published={subMinutes(new Date(), 45)}
        publisher="Chattanoogan"
      />,
    )

    expect(screen.getByTestId('time-posted')).toEqual(
      `Posted ${minutesSince} Minutes Ago`,
    )
  })
})
