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

test('publisher filtering', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('article')).toHaveCount(totalExpectedArticles)

  await page.getByTestId('Chattanoogan-filter-selector').click()
  await expect(page.getByTestId('article')).toHaveCount(
    expectedChattanooganArticles,
  )
  await page.getByTestId('Chattanoogan-filter-selector').click()

  await page.getByTestId('FoxChattanooga-filter-selector').click()
  await expect(page.getByTestId('article')).toHaveCount(
    expectedFoxChattanoogaArticles,
  )
  await page.getByTestId('FoxChattanooga-filter-selector').click()

  await page.getByTestId('Local3News-filter-selector').click()
  await expect(page.getByTestId('article')).toHaveCount(
    expectedLocal3NewsArticles,
  )
  await page.getByTestId('Local3News-filter-selector').click()

  await page.getByTestId('TimesFreePress-filter-selector').click()
  await expect(page.getByTestId('article')).toHaveCount(
    expectedTimesFreePressArticles,
  )
  await page.getByTestId('TimesFreePress-filter-selector').click()

  await page.getByTestId('WDEF-filter-selector').click()
  await expect(page.getByTestId('article')).toHaveCount(expectedWDEFArticles)
  await page.getByTestId('WDEF-filter-selector').click()

  await expect(page.getByTestId('article')).toHaveCount(totalExpectedArticles)
})
