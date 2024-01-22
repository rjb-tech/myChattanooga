import { test, expect } from '@playwright/test'
import config from '../../src/config'

const totalExpectedArticles = config.mockData.articles.length
const expectedChattanooganArticles = config.mockData.articles.filter(
  (x) => x.publisher === 'Chattanoogan',
).length
const expectedFoxChattanoogaArticles = config.mockData.articles.filter(
  (x) => x.publisher === 'FoxChattanooga',
).length
const expectedLocal3NewsArticles = config.mockData.articles.filter(
  (x) => x.publisher === 'Local3News',
).length
const expectedTimesFreePressArticles = config.mockData.articles.filter(
  (x) => x.publisher === 'TimesFreePress',
).length
const expectedWDEFArticles = config.mockData.articles.filter(
  (x) => x.publisher === 'WDEF',
).length

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'

test.describe('Article filtering', () => {
  test.use(userAgent)

  test('clicking publisher filters changes active article state', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForTimeout(5000)

    await expect(page.getByTestId('active-article')).toHaveCount(
      totalExpectedArticles,
    )

    await page.getByTestId('Chattanoogan-filter-selector').click()
    await expect(page.getByTestId('active-article')).toHaveCount(
      expectedChattanooganArticles,
    )
    await page.getByTestId('Chattanoogan-filter-selector').click()

    await page.getByTestId('FoxChattanooga-filter-selector').click()
    await expect(page.getByTestId('active-article')).toHaveCount(
      expectedFoxChattanoogaArticles,
    )
    await page.getByTestId('FoxChattanooga-filter-selector').click()

    await page.getByTestId('Local3News-filter-selector').click()
    await expect(page.getByTestId('active-article')).toHaveCount(
      expectedLocal3NewsArticles,
    )
    await page.getByTestId('Local3News-filter-selector').click()

    await page.getByTestId('TimesFreePress-filter-selector').click()
    await expect(page.getByTestId('active-article')).toHaveCount(
      expectedTimesFreePressArticles,
    )
    await page.getByTestId('TimesFreePress-filter-selector').click()

    await page.getByTestId('WDEF-filter-selector').click()
    await expect(page.getByTestId('active-article')).toHaveCount(
      expectedWDEFArticles,
    )
    await page.getByTestId('WDEF-filter-selector').click()

    await expect(page.getByTestId('active-article')).toHaveCount(
      totalExpectedArticles,
    )
  })
})
