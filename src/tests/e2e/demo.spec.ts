/* eslint-disable @typescript-eslint/await-thenable */
import { expect, test } from '@playwright/test'

test('demo launch', async ({ page, baseURL }) => {
  if (!baseURL) return

  await page.goto(baseURL)

  const demoButton = await page.getByRole('button', { name: 'Try demo' })

  await expect(demoButton).toBeVisible()

  await demoButton.click()

  const loader = page.locator('#loader')

  await expect(loader).toBeVisible()

  await expect(loader).toHaveCount(0)

  await expect(page.locator('#desktop-menu-project')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-map')).toBeVisible({ visible: true })

  await expect(page.locator('#desktop-menu-reports')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-colors')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-data')).toBeVisible({
    visible: true,
  })
})
